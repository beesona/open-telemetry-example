import express, { Express } from 'express';
import { BusinessService } from './business-logic/business-service';
import { HttpRouter } from './http-logic/http-router';
import { MysqlDatabaseAdapter } from './data-logic/database-adapter';
import { trace } from '@opentelemetry/api';
import jsonwebtoken from 'jsonwebtoken';

const PORT: number = parseInt(process.env.PORT || '8080');

const app: Express = express();

app.use(express.json());

app.use((req, res, next) => {
    const currentSpan = trace.getActiveSpan();
    if (currentSpan) {
        const jwt = req.headers['authorization']?.split(' ')[1];
        if (jwt) {
            try {
                const decoded = jsonwebtoken.verify(
                    jwt,
                    process.env.JWT_SECRET || ''
                );
                if (typeof decoded === 'object' && decoded !== null) {
                    currentSpan.setAttribute(
                        'http.request.userId',
                        (decoded as any)['userId']
                    );
                    currentSpan.setAttribute(
                        'http.request.userEmail',
                        (decoded as any)['email']
                    );
                    currentSpan.setAttribute(
                        'http.request.userOrganizationId',
                        (decoded as any)['organizationId']
                    );
                }
            } catch (error) {
                console.error('JWT verification failed:', error);
            }
        }
    }
    next();
});

app.use(
    '/business',
    new HttpRouter(new BusinessService(new MysqlDatabaseAdapter())).router
);

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
