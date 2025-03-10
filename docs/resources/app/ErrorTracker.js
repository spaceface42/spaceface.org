class ErrorTracker {
    constructor() {
        this.errors = [];
    }

    init() {
        window.addEventListener('error', (event) => {
            this.captureError({
                level: 'error',
                message: event.message,
                error: event.error,
                context: { filename: event.filename, line: event.lineno, column: event.colno }
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.captureError({
                level: 'warn',
                message: 'Unhandled Promise Rejection',
                error: event.reason
            });
        });
    }

    captureError({ level = 'error', message, error, context = {} }) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            stack: error?.stack || null,
            context
        };

        this.errors.push(errorEntry);
        console[level === 'fatal' ? 'error' : 'warn'](`[spaceface:error] ${message}`, errorEntry);
    }

    getErrors() {
        return [...this.errors];
    }

    clearErrors() {
        this.errors = [];
    }
}

const errorTracker = new ErrorTracker();
export default errorTracker;