import { config } from '@/constants/config';
import { Task, DailyPlan, TimeBlock } from '@/types';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenRouterResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

// OpenRouter AI Service
class AIService {
    private apiKey: string;
    private baseUrl: string;
    private model: string;

    constructor() {
        this.apiKey = config.openrouter.apiKey;
        this.baseUrl = config.openrouter.baseUrl;
        this.model = config.openrouter.model;
    }

    private async chat(messages: ChatMessage[]): Promise<string> {
        if (!this.apiKey) {
            console.warn('OpenRouter API key not configured');
            return this.getFallbackResponse();
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://flowmind.app',
                    'X-Title': 'FlowMind AI',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data: OpenRouterResponse = await response.json();
            return data.choices[0]?.message?.content || this.getFallbackResponse();
        } catch (error) {
            console.error('AI Service Error:', error);
            return this.getFallbackResponse();
        }
    }

    private getFallbackResponse(): string {
        return 'Şu an AI önerisi alınamıyor. Görevlerinizi öncelik sırasına göre tamamlamayı deneyin.';
    }

    // Generate daily productivity suggestions
    async getDailyInsight(
        tasks: Task[],
        energyLevel: number,
        currentHour: number
    ): Promise<string> {
        const taskList = tasks
            .filter(t => !t.isCompleted)
            .map(t => `- ${t.title} (${t.priority} priority, ${t.energyLevel} energy, ${t.estimatedMinutes}min)`)
            .join('\n');

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen FlowMind AI, kişisel verimlilik koçusun. Türkçe yanıt ver. Kısa ve motive edici ol. 
Kullanıcının enerji seviyesine ve saate göre öneri yap. Max 2-3 cümle.`,
            },
            {
                role: 'user',
                content: `Saat: ${currentHour}:00
Enerji seviyem: ${energyLevel}/5
Bugünkü görevlerim:
${taskList || 'Henüz görev eklenmemiş'}

Bugün nasıl verimli olabilirim?`,
            },
        ];

        return this.chat(messages);
    }

    // Generate task scheduling suggestion
    async getScheduleSuggestion(
        tasks: Task[],
        peakHours: { start: number; end: number }
    ): Promise<TimeBlock[]> {
        const pendingTasks = tasks.filter(t => !t.isCompleted);

        // Simple scheduling logic (AI can enhance this)
        const timeBlocks: TimeBlock[] = [];
        let currentHour = peakHours.start;

        for (const task of pendingTasks) {
            if (currentHour >= peakHours.end) break;

            const endHour = currentHour + Math.ceil(task.estimatedMinutes / 60);

            timeBlocks.push({
                startTime: `${currentHour.toString().padStart(2, '0')}:00`,
                endTime: `${endHour.toString().padStart(2, '0')}:00`,
                type: task.energyLevel === 'high' ? 'focus' : 'light_work',
                taskId: task.id,
                suggestion: `${task.title} - ${task.estimatedMinutes} dakika`,
            });

            currentHour = endHour;

            // Add break after focus work
            if (task.energyLevel === 'high') {
                timeBlocks.push({
                    startTime: `${currentHour.toString().padStart(2, '0')}:00`,
                    endTime: `${(currentHour + 0.25).toString().padStart(2, '0')}:15`,
                    type: 'break',
                    suggestion: '15 dakika mola',
                });
                currentHour += 0.25;
            }
        }

        return timeBlocks;
    }

    // Parse voice input to task
    async parseVoiceToTask(voiceText: string): Promise<Partial<Task> | null> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen bir görev ayrıştırıcısın. Kullanıcının sesli girişinden görev bilgilerini çıkar.
JSON formatında yanıt ver: {"title": "...", "priority": "low|medium|high|urgent", "estimatedMinutes": number, "category": "work|personal|health|learning"}
Sadece JSON döndür, başka bir şey yazma.`,
            },
            {
                role: 'user',
                content: voiceText,
            },
        ];

        try {
            const response = await this.chat(messages);
            return JSON.parse(response);
        } catch {
            return null;
        }
    }
}

export const aiService = new AIService();
