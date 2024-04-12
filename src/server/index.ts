import express, { Express } from 'express';
import { BusinessService } from './business-logic/business-service';
import { HttpRouter } from './http-logic/http-router';

const PORT: number = parseInt(process.env.PORT || '8080');

const app: Express = express();

app.use(express.json());
app.use('/business', new HttpRouter(new BusinessService()).router);

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
