import { BusinessLogic, HttpRequest, HttpResponse } from '../types/types';

export class HttpController<T> implements HttpController<T> {
  businessLogicService: BusinessLogic<T>;

  constructor(service: BusinessLogic<T>) {
    this.businessLogicService = service;
  }

  postRequest(req: HttpRequest): HttpResponse {
    const traceId =
      req.context.requestHeaders?.find((h) => h.key === 'TRACE_ID')?.value ||
      '-1';
    const response: HttpResponse = {
      responseCode: '201',
      responseBody: undefined,
      responseHeaders: [],
    };
    const item = req.context.requestBody as T;
    if (item) {
      try {
        this.businessLogicService.createRecord(item);
        response.responseBody = item;
      } catch (exception) {
        response.responseCode = '500';
      }
    } else {
      response.responseCode = '400';
    }
    return response;
  }

  getRequest(req: HttpRequest): HttpResponse {
    const response: HttpResponse = {
      responseCode: '200',
      responseBody: undefined,
      responseHeaders: [],
    };
    const id = req.context.queryParams?.find((qp) => qp.key === 'id')?.value;
    if (id) {
      const item = this.businessLogicService.getRecord(id);
      response.responseBody = item;
    } else {
      response.responseCode = '404';
    }
    return response;
  }
}

export class httpControllerFactory {
  static create<T>(service: BusinessLogic<T>): HttpController<T> {
    return new HttpController(service);
  }
}
