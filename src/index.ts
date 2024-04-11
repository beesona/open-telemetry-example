import { trace } from '@opentelemetry/api';
import express, { Express } from 'express';
import { DiceRollingService } from '../dice';

const PORT: number = parseInt(process.env.PORT || '8080');
const traceName: string = process.env.TRACE_NAME || 'dice-server';
const tracer = trace.getTracer(traceName);
const diceRollingService = new DiceRollingService();

const app: Express = express();

app.get('/rolldice', (req, res) => {
    const randomNumber = diceRollingService.rollTheDice(3, 1, 6);
    res.send(randomNumber.toString());
});

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
