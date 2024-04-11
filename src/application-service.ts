import { traceMethod } from './tracer';

export class ApplicationService {
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
