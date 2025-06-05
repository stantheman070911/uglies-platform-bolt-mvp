import React, { Component, ErrorInfo } from 'react';
import { MaterialButton } from '../ui/MaterialButton';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-surface-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-surface-600 mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <MaterialButton
              onClick={this.handleReset}
              color="primary"
              size="large"
            >
              Try Again
            </MaterialButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;