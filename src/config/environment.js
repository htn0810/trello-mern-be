import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  AUTHOR: process.env.AUTHOR,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS,
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME,
  WEBSITE_DOMAIN_DEVELOPMENT: process.env.WEBSITE_DOMAIN_DEVELOPMENT,
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION,

  BUILD_MODE: process.env.BUILD_MODE,
};
