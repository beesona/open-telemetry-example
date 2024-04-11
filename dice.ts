import { trace, Span, Tracer } from '@opentelemetry/api';
import { traceMethod } from './src/tracer';

export class DiceRollingService {
    constructor() {}

    @traceMethod()
    rollOnce(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    @traceMethod()
    rollTheDice(rolls: number, min: number, max: number) {
        const result: number[] = [];
        for (let i = 0; i < rolls; i++) {
            result.push(this.rollOnce(min, max));
        }
        return result;
    }
}
