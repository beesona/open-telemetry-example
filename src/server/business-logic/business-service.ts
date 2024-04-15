import { traceMethod } from '../../tracer';
import { BusinessLogic, BusinessObject, IDataAdapter } from '../types/types';

export class BusinessService implements BusinessLogic<BusinessObject> {
  dataAdapter: IDataAdapter;
  constructor(dataAdapter: IDataAdapter) {
    this.dataAdapter = dataAdapter;
  }

  @traceMethod()
  async createRecord(record: BusinessObject): Promise<BusinessObject> {
    await this.dataAdapter.createData(record.id, record.value);
    return record;
  }

  @traceMethod()
  async getRecord(key: string): Promise<BusinessObject | undefined> {
    const result = await this.dataAdapter.getData(key);
    return { id: result.data.id, value: result.data.value };
  }
}
