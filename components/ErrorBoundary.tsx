import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <View style={styles.container}>
                    <Text style={styles.emoji}>😵</Text>
                    <Text style={styles.title}>Bir Şeyler Ters Gitti</Text>
                    <Text style={styles.message}>
                        {this.state.error?.message || 'Beklenmeyen bir hata oluştu.'}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                        <Text style={styles.buttonText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#0F0F23',
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
