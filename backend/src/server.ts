import 'dotenv/config';
import app from './app';
import sequelize from './config/database';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap(): Promise<void> {
  await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
  console.log('Database synchronised');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
