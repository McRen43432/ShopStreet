import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-4xl font-black text-red-500 mb-4">Что-то пошло не так</h1>
            <p className="text-white/70 mb-6">Произошла ошибка в приложении. Попробуйте перезагрузить страницу.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-neon text-ink px-6 py-3 text-sm font-black uppercase tracking-widest hover:bg-white transition-colors"
            >
              Перезагрузить
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-white/40 cursor-pointer">Подробности ошибки</summary>
                <pre className="text-red-400 text-xs mt-2 bg-black/50 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}