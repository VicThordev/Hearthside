import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { failed: boolean };

// Keeps a crash in one view from blanking the whole app. Key it by view so navigating away resets it.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('view_crashed', error.message, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="flex-1 grid place-items-center p-6 text-center">
        <div>
          <p className="font-semibold text-[#081d2c]">This screen could not be displayed.</p>
          <p className="mt-2 text-sm text-[#64748B]">Your other screens are still available from the menu.</p>
          <button onClick={() => this.setState({ failed: false })} className="mt-4 rounded-lg bg-[#00685f] px-4 py-2 text-sm font-semibold text-white">Try again</button>
        </div>
      </div>
    );
  }
}
