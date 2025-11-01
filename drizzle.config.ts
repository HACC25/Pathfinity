import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env' });

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};
