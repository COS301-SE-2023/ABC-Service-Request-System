import { ConnectOptions, connect } from "mongoose";

export const dbConnection = () => {
    console.log(process.env.MONGO_URI);
    connect(process.env.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connected to MongoDB"),
        (error) => console.log(error)
    );
}
