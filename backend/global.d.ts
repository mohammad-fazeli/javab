namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    EMAIL_SECRET: string;
    FORGET_PASSWORD_SECRET: string;
    EMAIL_ADDRESS: string;
    EMAIL_PASSWORD: string;
    URL: string;
  }
}
