import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DestinationAttributes {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type DestinationCreationAttributes = Optional<DestinationAttributes, 'id' | 'sortOrder'>;

class Destination
  extends Model<DestinationAttributes, DestinationCreationAttributes>
  implements DestinationAttributes
{
  declare id: number;
  declare name: string;
  declare latitude: number;
  declare longitude: number;
  declare sortOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Destination.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'O nome do destino é obrigatório' },
        len: { args: [2, 255], msg: 'O nome deve ter entre 2 e 255 caracteres' },
      },
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Latitude inválida' },
        min: { args: [-90], msg: 'Latitude deve ser >= -90' },
        max: { args: [90], msg: 'Latitude deve ser <= 90' },
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Longitude inválida' },
        min: { args: [-180], msg: 'Longitude deve ser >= -180' },
        max: { args: [180], msg: 'Longitude deve ser <= 180' },
      },
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'destinations',
    modelName: 'Destination',
  },
);

export default Destination;
