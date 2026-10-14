import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 text-center bg-[#1E293B]/70 border border-red-500/20 rounded-2xl my-4 mx-auto max-w-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">
            {this.props.title || "Section Temporarily Unavailable"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            We encountered a minor display issue loading this section.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EF233C] hover:bg-[#d90429] text-white text-xs font-bold rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
