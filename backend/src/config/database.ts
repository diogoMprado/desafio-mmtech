import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'tripplanner',
  password: process.env.DB_PASSWORD || 'tripplanner123',
  database: process.env.DB_NAME || 'tripplannerdb',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
