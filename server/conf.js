import dotenv from "dotenv";
dotenv.config();

const conf = {
  FRONTEND_URL: String(process.env.FRONTEND_URL),
  MONGO_URI: String(process.env.MONGO_URI),
  JWT_SECRET: String(process.env.JWT_SECRET),
  PORT: String(process.env.PORT),
  CORS_ORIGIN1: String(process.env.CORS_ORIGIN1),
  ADMIN_EMAILS: String(process.env.ADMIN_EMAILS),
};

export default conf;
