import { ConnectOptions, createConnection } from "mongoose";

let db: any;

export const dbConnection = () => {
    if (!db) {
        db = createConnection(process.env.MONGO_TICKET_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        db.on('connected', () => {
            console.log("Connected to ticketMongoDB");
        });

        db.on('error', (error:any) => {
            console.error("An error occurred while connecting to MongoDB", error);
        });
    }

    return db;
}
