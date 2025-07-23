import { Sequelize, DataTypes } from 'sequelize';
import {
    BusinessObject,
    IDataAdapter,
    IDatabaseResponse
} from '../types/types';
import { traceMethod } from '../../tracer';

/**
 * This whole class needs some refactor to more loosely couple the adapter
 * with the data types. The adapter should be able to handle any data type.
 */
export class MysqlDatabaseAdapter implements IDataAdapter {
    sequelize: any;
    model: any;

    constructor() {
        // TODO: refactor connection info.
        this.sequelize = new Sequelize(
            'business_database',
            'root',
            'password',
            {
                host: '127.0.0.1',
                port: 3307,
                dialect: 'mysql'
            }
        );

        this.model = this.sequelize.define(
            'business',
            {
                // id: {
                //   type: DataTypes.INTEGER,
                //   primaryKey: true,
                //   autoIncrement: true,
                // },
                businessId: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                businessValue: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                createdAt: {
                    type: DataTypes.DATE
                },
                updatedAt: {
                    type: DataTypes.DATE
                }
            },
            {
                tableName: 'business'
            }
        );
    }

    /**
     * TODO: remove.
     */
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            await this.model.sync();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    @traceMethod()
    async createData<BusinessObject>(
        id: string,
        value: BusinessObject
    ): Promise<IDatabaseResponse<BusinessObject>> {
        try {
            const result = await this.model.create({
                businessId: id,
                businessValue: value
            });
            return { data: result.dataValues };
        } catch (error) {
            console.error('Error creating record:', error);
            throw new Error('Error creating record');
        }
    }

    @traceMethod()
    async getData<BusinessObject>(
        id: string
    ): Promise<IDatabaseResponse<BusinessObject> | undefined> {
        const result = await this.model.findAll({ where: { businessId: id } });
        if (result && result.length > 0) {
            return { data: result[0].dataValues };
        } else {
            return undefined;
        }
    }
}
