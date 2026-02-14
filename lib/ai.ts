import { config } from '@/constants/config';
import { Task, DailyPlan, TimeBlock } from '@/types';
import { aiCache } from '@/lib/aiCache';

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

// OpenRouter AI Servisi
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
            console.warn('OpenRouter API key ayarlanmamış');
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
                throw new Error(`API Hatası: ${response.status}`);
            }

            const data: OpenRouterResponse = await response.json();
            return data.choices[0]?.message?.content || this.getFallbackResponse();
        } catch (error) {
            console.error('AI Servis Hatası:', error);
            return this.getFallbackResponse();
        }
    }

    private getFallbackResponse(): string {
        return 'Şu an AI önerisi alınamıyor. Görevlerinizi öncelik sırasına göre tamamlamayı deneyin.';
    }

    // ============ GÜNLÜK ÖNERI ============
    async getDailyInsight(
        tasks: Task[],
        energyLevel: number,
        currentHour: number
    ): Promise<string> {
        // Cache kontrolü (15 dk TTL)
        const cacheKey = aiCache.makeKey('daily', energyLevel, currentHour, tasks.length);
        const cached = await aiCache.get<string>(cacheKey);
        if (cached) return cached;

        const taskList = tasks
            .filter(t => !t.isCompleted)
            .map(t => `- ${t.title} (${t.priority} öncelik, ${t.energyLevel} enerji, ${t.estimatedMinutes}dk)`)
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

        const result = await this.chat(messages);
        await aiCache.set(cacheKey, result, 15 * 60 * 1000); // 15 dk cache
        return result;
    }

    // ============ HAFTALIK RAPOR ============
    async getWeeklyReport(stats: {
        tasksCompleted: number;
        focusMinutes: number;
        streak: number;
        totalXp: number;
    }): Promise<string> {
        // Cache kontrolü (1 saat TTL)
        const cacheKey = aiCache.makeKey('weekly', stats.tasksCompleted, stats.focusMinutes, stats.streak);
        const cached = await aiCache.get<string>(cacheKey);
        if (cached) return cached;

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen FlowMind AI, kişisel verimlilik koçusun. Türkçe yanıt ver. 
Kullanıcının haftalık performansını analiz et, olumlu noktaları vurgula ve gelişim önerileri sun.
Samimi ve motive edici bir dil kullan. Max 4-5 cümle. Emoji kullan.`,
            },
            {
                role: 'user',
                content: `Bu haftaki istatistiklerim:
- Tamamlanan görev: ${stats.tasksCompleted}
- Odaklanma süresi: ${stats.focusMinutes} dakika (${Math.round(stats.focusMinutes / 60 * 10) / 10} saat)
- Streak: ${stats.streak} gün
- Kazanılan XP: ${stats.totalXp}

Performansımı değerlendir ve öneri ver.`,
            },
        ];

        const result = await this.chat(messages);
        await aiCache.set(cacheKey, result, 60 * 60 * 1000); // 1 saat cache
        return result;
    }

    // ============ GÖREV ANALİZİ ============
    async getTaskAnalysis(task: Task): Promise<string> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen FlowMind AI, görev analiz uzmanısın. Türkçe yanıt ver.
Verilen görevi analiz et: ne kadar sürer, hangi enerji seviyesinde yapılmalı, 
dikkat edilmesi gerekenler neler. Max 3 cümle. Pratik öneriler ver.`,
            },
            {
                role: 'user',
                content: `Görev: ${task.title}
Açıklama: ${task.description || 'Yok'}
Kategori: ${task.category}
Tahmini süre: ${task.estimatedMinutes} dakika
Öncelik: ${task.priority}

Bu görevi nasıl en verimli şekilde yapabilirim?`,
            },
        ];

        return this.chat(messages);
    }

    // ============ AKILLI ZAMANLAMA ============
    async getSmartSchedule(
        tasks: Task[],
        energyLevel: number,
        peakHours: { start: number; end: number }
    ): Promise<string> {
        const pendingTasks = tasks.filter(t => !t.isCompleted);
        const taskList = pendingTasks
            .map(t => `- ${t.title} (${t.priority}, ${t.energyLevel} enerji, ${t.estimatedMinutes}dk)`)
            .join('\n');

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen FlowMind AI, zaman yönetimi uzmanısın. Türkçe yanıt ver.
Kullanıcının görevlerini enerji seviyeleri ve önceliklere göre sırala.
Yüksek enerjili görevleri peak saatlere, düşük enerjilileri molalara yakın zamanlara koy.
Kısa ve net bir program öner. Max 5-6 satır.`,
            },
            {
                role: 'user',
                content: `Enerji seviyem: ${energyLevel}/5
Verimli saatlerim: ${peakHours.start}:00 - ${peakHours.end}:00

Görevlerim:
${taskList || 'Henüz görev yok'}

Bunları bugün nasıl sıralayıp yapmalıyım?`,
            },
        ];

        return this.chat(messages);
    }

    // ============ MOTİVASYON MESAJI ============
    async getMotivation(streak: number, completedToday: number): Promise<string> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `Sen FlowMind AI, motivasyon koçusun. Türkçe yanıt ver.
Kısa, samimi ve motive edici bir mesaj yaz. Max 2 cümle. Emoji kullan.
Kullanıcının başarılarını takdir et.`,
            },
            {
                role: 'user',
                content: `Streak: ${streak} gün
Bugün tamamladığım görev: ${completedToday}

Beni motive et!`,
            },
        ];

        return this.chat(messages);
    }

    // ============ GÖREV ZAMANLAMA (LOJİK) ============
    getScheduleSuggestion(
        tasks: Task[],
        peakHours: { start: number; end: number }
    ): TimeBlock[] {
        const pendingTasks = tasks.filter(t => !t.isCompleted);

        // Önce yüksek öncelikli + yüksek enerjili görevleri peak saatlere koy
        const sorted = [...pendingTasks].sort((a, b) => {
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
            const energyOrder = { high: 0, medium: 1, low: 2 };
            return (priorityOrder[a.priority] - priorityOrder[b.priority]) ||
                (energyOrder[a.energyLevel] - energyOrder[b.energyLevel]);
        });

        const timeBlocks: TimeBlock[] = [];
        let currentHour = peakHours.start;

        for (const task of sorted) {
            if (currentHour >= peakHours.end) break;

            const durationHours = Math.ceil(task.estimatedMinutes / 60);
            const endHour = Math.min(currentHour + durationHours, peakHours.end);

            timeBlocks.push({
                startTime: `${currentHour.toString().padStart(2, '0')}:00`,
                endTime: `${endHour.toString().padStart(2, '0')}:00`,
                type: task.energyLevel === 'high' ? 'focus' : 'light_work',
                taskId: task.id,
                suggestion: `${task.title} - ${task.estimatedMinutes} dakika`,
            });

            currentHour = endHour;

            // Yoğun işten sonra mola ekle
            if (task.energyLevel === 'high' && currentHour < peakHours.end) {
                timeBlocks.push({
                    startTime: `${currentHour.toString().padStart(2, '0')}:00`,
                    endTime: `${currentHour.toString().padStart(2, '0')}:15`,
                    type: 'break',
                    suggestion: '☕ 15 dakika mola',
                });
                currentHour += 0.25;
            }
        }

        return timeBlocks;
    }

    // ============ SESLİ GİRİŞ AYRIŞTIRICISI ============
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
