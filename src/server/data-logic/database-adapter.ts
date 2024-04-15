import { Sequelize, DataTypes } from 'sequelize';
import { BusinessObject, IDatabaseResponse } from '../types/types';
import { traceMethod } from '../../tracer';

/**
 * This whole class needs some refactor to more loosely couple the adapter
 * with the data types. The adapter should be able to handle any data type.
 */
export class MysqlDatabaseAdapter {
  sequelize: any;
  model: any;

  constructor() {
    // TODO: refactor connection info.
    this.sequelize = new Sequelize('business_database', 'root', 'replace_me', {
      host: '127.0.0.1',
      dialect: 'mysql',
    });

    this.model = this.sequelize.define(
      'business',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        businessId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        businessValue: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        tableName: 'business',
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
  async createRecord(
    id: string,
    value: string
  ): Promise<IDatabaseResponse<BusinessObject>> {
    const result = await this.model.create({
      businessId: id,
      businessValue: value,
    });
    return { data: result };
  }

  @traceMethod()
  async getRecord<BusinessObject>(
    id: string
  ): Promise<IDatabaseResponse<BusinessObject>> {
    const result = this.model.findAll({ where: { businessId: id } });
    return { data: result };
  }
}
