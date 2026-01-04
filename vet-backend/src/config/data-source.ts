import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Carga las variables de entorno manualmente para el CLI
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Las migraciones reemplazan a synchronize: true
  logging: true,
// Cambia esto para que soporte tanto TS como JS
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], 
  
  // Ajusta esta ruta a donde realmente quieres tus archivos .ts
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  subscribers: [],
});