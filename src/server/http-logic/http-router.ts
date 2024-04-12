import express from 'express';
import { BusinessLogic, HttpRequest, HttpResponse } from '../types/types';
import { traceMethod } from '../../tracer';

export class HttpRouter<T> {
    router = express.Router();
    businessLogicService: BusinessLogic<T>;

    constructor(service: BusinessLogic<T>) {
        this.businessLogicService = service;

        this.router.get('/:id', (req, res) => {
            const id = req.url.split('/')[1];
            const result = this.getRequest(id);
            res.statusCode = +result.responseCode;
            res.send(result.responseBody);
        });

        this.router.post('/', (req, res) => {
            const formattedReq: HttpRequest = {
                context: {
                    requestType: 'POST',
                    requestBody: req.body
                }
            };
            const result = this.postRequest(formattedReq);
            res.statusCode = +result.responseCode;
            res.send(result.responseBody);
        });
    }

    @traceMethod()
    postRequest(req: HttpRequest): HttpResponse {
        const response: HttpResponse = {
            responseCode: '201',
            responseBody: undefined,
            responseHeaders: []
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

    @traceMethod()
    getRequest(id: string): HttpResponse {
        const response: HttpResponse = {
            responseCode: '200',
            responseBody: undefined,
            responseHeaders: []
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
}
