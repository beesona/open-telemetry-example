import { trace, Span } from '@opentelemetry/api';

export function traceMethod() {
    const traceName: string = process.env.TRACE_NAME || 'dice-server';
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const tracer = trace.getTracer(traceName);
        const originalMethod = descriptor.value;
        const methodName = propertyKey;
        descriptor.value = function (...args: any[]) {
            return tracer.startActiveSpan(methodName, (span: Span) => {
                const result = originalMethod.apply(this, args);
                span.end();
                return result;
            });
        };
        return descriptor;
    };
}
