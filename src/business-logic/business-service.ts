import { traceMethod } from '../tracer';
import { BusinessLogic, BusinessObject } from '../types/types';

export class BusinessService implements BusinessLogic<BusinessObject> {
  objectStore: BusinessObject[] = [];

  @traceMethod()
  createRecord(record: BusinessObject): BusinessObject {
    this.objectStore.push(record);
    return record;
  }

  @traceMethod()
  getRecord(key: string): BusinessObject | undefined {
    return this.objectStore.find((r) => r.id === key);
  }
}
