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
    postRequest(req: HttpRequest): HttpResponse;
    getRequest(id: string): HttpResponse;
}

interface HttpController<T> {
    businessLogicService: BusinessLogic<T>;
    postRequest(req: HttpRequest): HttpResponse;
    getRequest(req: HttpRequest): HttpResponse;
}

interface BusinessLogic<T> {
    objectStore: T[];
    createRecord(obj: T): T;
    getRecord(key: string): T | undefined;
}

interface BusinessObject {
    id: string;
    value: string;
}

export { HttpRequest, HttpResponse, HttpController, BusinessLogic, BusinessObject, IHttpRouter };
