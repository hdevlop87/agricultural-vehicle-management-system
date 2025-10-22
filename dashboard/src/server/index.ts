import { Server } from 'najm-api';
import translations from '../locales';
import './modules';

const app = await Server({
  serverless: true,
  basePath: '/api',
  cors: true,
  i18n: {
    translations,
    defaultLanguage: 'fr'
  }
});

export default app;
