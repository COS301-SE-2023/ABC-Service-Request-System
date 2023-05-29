import { ConnectOptions, connect } from "mongoose";

export const dbConnection = () => {
    connect(process.env.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connected to MongoDB"),
        (error) => console.log(error)
    );
}
