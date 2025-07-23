import pino from 'pino';
import { traceMethod } from '../../tracer';
import { BusinessLogic, BusinessObject, IDataAdapter } from '../types/types';

export class BusinessService implements BusinessLogic<BusinessObject> {
  logger = pino();
  dataAdapter: IDataAdapter;
  constructor(dataAdapter: IDataAdapter) {
    this.dataAdapter = dataAdapter;
  }

  @traceMethod()
  async createRecord(record: BusinessObject): Promise<BusinessObject> {
    try {
      await this.dataAdapter.createData(record.businessId, record.businessValue);
      this.logger.info(`Created record: ${record}`);
      return record;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error creating record');
    }
  }

  @traceMethod()
  async getRecord(key: string): Promise<BusinessObject | undefined> {
    const result = await this.dataAdapter.getData<BusinessObject>(key);
    if (result) {
      this.logger.info(`Retrieved record: ${result.data}`);
      return {
        id: result.data.id,
        businessId: result.data.businessId,
        businessValue: result.data.businessValue,
        createdAt: result.data.createdAt,
        updatedAt: result.data.updatedAt
      };
    } else {
      return undefined;
    }
  }
}
