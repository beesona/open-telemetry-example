import { traceMethod } from '../tracer';
const http = require('http');

class ClientApplication {
    @traceMethod()
    static makeRequest() {
        const randomId = Math.floor(Math.random() * 2) + 1;
        http.get(
            {
                host: 'localhost',
                port: 8080,
                path: `/business/${randomId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            (response: any) => {
                const body: any[] = [];
                response.on('data', (chunk: any) => body.push(chunk));
                response.on('end', () => {
                    console.log(body.toString());
                });
            }
        );

        // console.log(
        //     'Sleeping 5 seconds before shutdown to ensure all records are flushed.'
        // );
        // setTimeout(() => {
        //     console.log('Completed.');
        // }, 5000);
    }
}

for (let i = 0; i < 10; i++) {
    console.log(`Making request ${i + 1}`);
    ClientApplication.makeRequest();
}
