import { traceMethod } from '../../tracer';
import { BusinessLogic, BusinessObject } from '../types/types';

export class BusinessService implements BusinessLogic<BusinessObject> {
    objectStore: BusinessObject[] = [];

    constructor() {
        this.seedStore();
    }

    @traceMethod()
    createRecord(record: BusinessObject): BusinessObject {
        this.objectStore.push(record);
        return record;
    }

    @traceMethod()
    getRecord(key: string): BusinessObject | undefined {
        return this.objectStore.find((r) => r.id === key);
    }

    seedStore() {
        this.createRecord({ id: '1', value: 'First' });
        this.createRecord({ id: '2', value: 'Second' });
    }
}
