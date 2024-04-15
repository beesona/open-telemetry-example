interface HttpRequest {
  context: {
    path?: string;
    requestType: 'GET' | 'POST';
    requestHeaders?: { key: string; value: string }[];
    requestBody?: any;
    queryParams?: { key: string; value: string }[];
  };
}

interface HttpResponse {
  responseCode: '200' | '201' | '400' | '404' | '500';
  responseHeaders?: any;
  responseBody?: any;
}

interface HttpController<T> {
  businessLogicService: BusinessLogic<T>;
  postRequest(req: HttpRequest): HttpResponse;
  getRequest(req: HttpRequest): HttpResponse;
}

interface BusinessLogic<T> {
  createRecord(obj: T): Promise<T>;
  getRecord(key: string): Promise<T | undefined>;
}

interface BusinessObject {
  id: string;
  value: string;
}

interface IDatabaseResponse<T> {
  data: T;
}

interface IDataAdapter {
  createRecord(
    id: string,
    value: string
  ): Promise<IDatabaseResponse<BusinessObject>>;
  getRecord(id: string): Promise<IDatabaseResponse<BusinessObject>>;
}

export {
  HttpRequest,
  HttpResponse,
  HttpController,
  BusinessLogic,
  BusinessObject,
  IDatabaseResponse,
  IDataAdapter,
};
