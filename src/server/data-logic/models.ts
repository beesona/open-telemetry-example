import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize
} from 'sequelize';

const sequelize = new Sequelize('business_database', 'root', 'replace_me', {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql'
});

class BusinessObject extends Model<
    InferAttributes<BusinessObject>,
    InferCreationAttributes<BusinessObject>
> {
    businessId!: string;
    businessValue!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

BusinessObject.init(
    {
        businessId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        businessValue: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize
    }
);

export { BusinessObject };
