# Open Telemetry Example

- Uses an Express Instrumentation to capture request events.
- Implements custom trace spans with experimental decorators.
- Uses HTTP instrumentation to trace across client and remote processes.

##### Table of Contents

[Running the app(s)](#to-run-this-with-open-telemetry-bootstrapped)  
[Decorator Example](#custom-telemetry-via-decorators)  
[Exploring Trace Telemetry](#exploring-trace-telemetry)  
[Traces Over Remote Resources](#tracing-requests-over-remote-resources)

## To run this with Open-Telemetry bootstrapped 🏃‍♂️‍➡️

### Server

- use the command `npm run start:server`

### Client

- use the command `npm run start:client`

## Custom Telemetry via decorators 🎄

This app uses function decorators to tell Open-Telemetry we want to trace function calls using active spans. Here's an example of how to tell Open-Telemetry to include a function as part of the nested spans activated with an HTTP request:

```
  @traceMethod() // This is the magic part 🧙‍♂️
  getRequest(id: string): HttpResponse {
    const response: HttpResponse = {
      responseCode: '200',
      responseBody: undefined,
      responseHeaders: [],
    };
    if (id) {
      const item = this.businessLogicService.getRecord(id);
      if (!item) {
        response.responseCode = '404';
      } else {
        response.responseBody = item;
      }
    } else {
      response.responseCode = '400';
    }
    return response;
  }
```

And that's it! The function has been added to the active spans of the request trace telemetry!

## Exploring Trace Telemetry 🕵️‍♂️

When a request comes into the Express server, instrumentation, Express and Custom, begin tracing the request. The following is an example of POST request telemetry. Note some of the following data:

- The first record is the Express Server.
- The second record is the HTTP Route abstraction layer.
  - This is custom telemetry that includes the method arguments.
- The final record is the business logic.
- Every call in the request shares a traceId.
- Every subsequent call has a parentId that matches the id of the call before it.

```
{
  traceId: '17420fa70c4c5e019eecd70bf9acf2d6',
  parentId: undefined,
  traceState: undefined,
  name: 'POST /business',
  id: 'df4732631beaabe1',
  kind: 1,
  timestamp: 1712875736247000,
  duration: 30040.791,
  attributes: {
    'http.url': 'http://localhost:8080/business',
    'http.host': 'localhost:8080',
    'net.host.name': 'localhost',
    'http.method': 'POST',
    'http.scheme': 'http',
    'http.target': '/business',
    'http.user_agent': 'PostmanRuntime/7.37.0',
    'http.request_content_length_uncompressed': 41,
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'net.host.ip': '::1',
    'net.host.port': 8080,
    'net.peer.ip': '::1',
    'net.peer.port': 52072,
    'http.status_code': 201,
    'http.status_text': 'CREATED',
    'http.route': '/business'
  },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: '17420fa70c4c5e019eecd70bf9acf2d6',
  parentId: 'df4732631beaabe1',
  traceState: undefined,
  name: 'postRequest',
  id: 'efde36046dbad3af',
  kind: 0,
  timestamp: 1712875736274000,
  duration: 102.5,
  attributes: {
    methodArgs: '[{"context":{"requestType":"POST","requestBody":{"id":"hello","value":"world"}}}]'
  },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: '17420fa70c4c5e019eecd70bf9acf2d6',
  parentId: 'efde36046dbad3af',
  traceState: undefined,
  name: 'createRecord',
  id: '6dce7bdf049e2409',
  kind: 0,
  timestamp: 1712875736274000,
  duration: 19.958,
  attributes: { methodArgs: '[{"id":"hello","value":"world"}]' },
  status: { code: 0 },
  events: [],
  links: []
}
```

Then compare this trace to the next call, which is a GET request:

- The traceId has changed.
- All of this telemetry is generated by the same traceMethod decorators, making it generic and extensible.

```
{
  traceId: 'afacd622d2c18c4a6388243ded28a0b8',
  parentId: undefined,
  traceState: undefined,
  name: 'GET /business/:id',
  id: 'e6c9a31f5854c774',
  kind: 1,
  timestamp: 1712876384595000,
  duration: 6356.625,
  attributes: {
    'http.url': 'http://localhost:8080/business/hello',
    'http.host': 'localhost:8080',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/business/hello',
    'http.user_agent': 'PostmanRuntime/7.37.0',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'net.host.ip': '::1',
    'net.host.port': 8080,
    'net.peer.ip': '::1',
    'net.peer.port': 54823,
    'http.status_code': 200,
    'http.status_text': 'OK',
    'http.route': '/business/:id'
  },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: 'afacd622d2c18c4a6388243ded28a0b8',
  parentId: 'e6c9a31f5854c774',
  traceState: undefined,
  name: 'getRequest',
  id: '6064849f073a1503',
  kind: 0,
  timestamp: 1712876384599000,
  duration: 185.041,
  attributes: { methodArgs: '["hello"]' },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: 'afacd622d2c18c4a6388243ded28a0b8',
  parentId: '6064849f073a1503',
  traceState: undefined,
  name: 'getRecord',
  id: '67e4fa01610ea203',
  kind: 0,
  timestamp: 1712876384600000,
  duration: 71.125,
  attributes: { methodArgs: '["hello"]' },
  status: { code: 0 },
  events: [],
  links: []
}
```

## Tracing Requests over remote resources 💻 ➡️ 🖥️

The latest version of this application now has a client and server app. The client is a simple HTTP GET request, and the server is the original application logic. Requests using the HTTP instrumentation will pass trace info over HTTP and the remote resource will use it to continue the trace.

- To get this working, simply start the server app (`npm run start:server`), then start the client in a separate terminal (`npm run start:client`). Monitor both consoles to view the telemetry (A future version of this example will include a telemetry collector and display).

Here is an Example of the output:

### The Client Trace

```
{
  traceId: '851cd721840fdebffdbbf3f9ab1455a5',
  parentId: undefined,
  traceState: undefined,
  name: 'makeRequest',
  id: '4b5035395e8b8c03',
  kind: 0,
  timestamp: 1712935408011000,
  duration: 16922.9,
  attributes: { methodArgs: '[]' },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: '851cd721840fdebffdbbf3f9ab1455a5', // NOTE this ID
  parentId: '4b5035395e8b8c03',
  traceState: undefined,
  name: 'GET',
  id: 'daba7118c88efd72', // AND THIS ID
  kind: 2,
  timestamp: 1712935408016000,
  duration: 33604.6,
  attributes: {
    'http.url': 'http://localhost:8080/business/1',
    'http.method': 'GET',
    'http.target': '/business/1',
    'net.peer.name': 'localhost',
    'http.host': 'localhost:8080',
    'net.peer.ip': '::1',
    'net.peer.port': 8080,
    'http.response_content_length_uncompressed': 26,
    'http.status_code': 200,
    'http.status_text': 'OK',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp'
  },
  status: { code: 0 },
  events: [],
  links: []
}
```

### The Server Trace

```
[{
  traceId: '851cd721840fdebffdbbf3f9ab1455a5', // This is the incoming (HTTP) traceId from the client
  parentId: 'daba7118c88efd72', // The id of the client GET request
  traceState: undefined,
  name: 'GET /business/:id',
  id: 'badbc2ff85db84d8',
  kind: 1,
  timestamp: 1712935408039000,
  duration: 10211.3,
  attributes: {
    'http.url': 'http://localhost:8080/business/1',
    'http.host': 'localhost:8080',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.scheme': 'http',
    'http.target': '/business/1',
    'http.flavor': '1.1',
    'net.transport': 'ip_tcp',
    'net.host.ip': '::1',
    'net.host.port': 8080,
    'net.peer.ip': '::1',
    'net.peer.port': 59593,
    'http.status_code': 200,
    'http.status_text': 'OK',
    'http.route': '/business/:id'
  },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: '851cd721840fdebffdbbf3f9ab1455a5',
  parentId: 'badbc2ff85db84d8',
  traceState: undefined,
  name: 'getRequest',
  id: '4028cbff5accf34c',
  kind: 0,
  timestamp: 1712935408044000,
  duration: 274,
  attributes: { methodArgs: '["1"]' },
  status: { code: 0 },
  events: [],
  links: []
},
{
  traceId: '851cd721840fdebffdbbf3f9ab1455a5',
  parentId: '4028cbff5accf34c',
  traceState: undefined,
  name: 'getRecord',
  id: '27e80a7aa8c74bab',
  kind: 0,
  timestamp: 1712935408045000,
  duration: 59.4,
  attributes: { methodArgs: '["1"]' },
  status: { code: 0 },
  events: [],
  links: []
}]
```
