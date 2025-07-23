import { Router } from 'express';

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

interface IHttpRouter<T> {
  router: Router;
  businessLogicService: BusinessLogic<T>;
  postRequest(req: HttpRequest): Promise<HttpResponse>;
  getRequest(id: string): Promise<HttpResponse>;
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
  businessId: string;
  businessValue: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewBusinessObject {
  businessId: string;
  businessValue: string;
}

interface IDatabaseResponse<T> {
  data: T;
}

interface IDataAdapter {
  createData<T>(id: string, value: T): Promise<IDatabaseResponse<T>>;
  getData<T>(id: string): Promise<IDatabaseResponse<T> | undefined>;
}

export {
  HttpRequest,
  HttpResponse,
  IHttpRouter,
  HttpController,
  BusinessLogic,
  BusinessObject,
  IDatabaseResponse,
  IDataAdapter
};
