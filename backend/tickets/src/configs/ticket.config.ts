import dotEnv from "dotenv";

if(process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}`;
    dotEnv.config({path: configFile});
}else {
    dotEnv.config();
}

const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGO_URI
}

export default config;