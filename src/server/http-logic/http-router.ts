import express from 'express';
import {
  BusinessLogic,
  HttpRequest,
  HttpResponse,
  IHttpRouter,
} from '../types/types';
import { traceMethod } from '../../tracer';
import pino from 'pino';

export class HttpRouter<T> implements IHttpRouter<T> {
  logger = pino();
  router = express.Router();
  businessLogicService: BusinessLogic<T>;

  constructor(service: BusinessLogic<T>) {
    this.businessLogicService = service;
    this.bindRoutes();
  }

  private async bindRoutes() {
    this.router.get('/:id', (req, res) => {
      const id = req.url.split('/')[1];
      this.getRequest(id)
        .then((result) => {
          res.statusCode = +result.responseCode;
          res.send(result.responseBody);
        })
        .catch((error) => {
          res.statusCode = 500;
          res.send('Internal Server Error');
        });
    });

    this.router.post('/', (req, res) => {
      const formattedReq: HttpRequest = {
        context: {
          requestType: 'POST',
          requestBody: req.body,
        },
      };
      this.postRequest(formattedReq)
        .then((result) => {
          res.statusCode = +result.responseCode;
          res.send(result.responseBody);
        })
        .catch((error) => {
          res.statusCode = 500;
          res.send('Internal Server Error');
        });
    });
  }

  @traceMethod()
  async postRequest(req: HttpRequest): Promise<HttpResponse> {
    const response: HttpResponse = {
      responseCode: '201',
      responseBody: undefined,
      responseHeaders: [],
    };
    const item = req.context.requestBody as T;
    if (item) {
      try {
        await this.businessLogicService.createRecord(item);
        response.responseBody = item;
        this.logger.info(`Created record: ${item}`);
      } catch (exception) {
        response.responseCode = '500';
        this.logger.error(`Error creating record: ${exception}`);
      }
    } else {
      response.responseCode = '400';
    }
    return response;
  }

  @traceMethod()
  async getRequest(id: string): Promise<HttpResponse> {
    const response: HttpResponse = {
      responseCode: '200',
      responseBody: undefined,
      responseHeaders: [],
    };
    if (id) {
      const item = await this.businessLogicService.getRecord(id);
      if (!item) {
        response.responseCode = '404';
      } else {
        response.responseBody = item;
        this.logger.info(`Retrieved record: ${item}`);
      }
    } else {
      response.responseCode = '400';
    }
    return response;
  }
}
