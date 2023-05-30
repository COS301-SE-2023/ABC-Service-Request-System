import { ConnectOptions, createConnection } from "mongoose";

let db: any;

export const dbConnection = () => {
    if (!db) {
        db = createConnection(process.env.MONGO_USER_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        db.on('connected', () => {
            console.log("Connected to userMongoDB");
        });

        db.on('error', (error:any) => {
            console.error("An error occurred while connecting to MongoDB", error);
        });
    }

    return db;
}
