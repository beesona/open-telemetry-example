import { traceMethod } from '../tracer';
const http = require('http');

class ClientApplication {
  @traceMethod()
  static makeRequest() {
    http.get(
      {
        host: 'localhost',
        port: 8080,
        path: '/business/hello',
      },
      (response: any) => {
        const body: any[] = [];
        response.on('data', (chunk: any) => body.push(chunk));
        response.on('end', () => {
          console.log(body.toString());
        });
      }
    );

    console.log(
      'Sleeping 5 seconds before shutdown to ensure all records are flushed.'
    );
    setTimeout(() => {
      console.log('Completed.');
    }, 5000);
  }
}

ClientApplication.makeRequest();
