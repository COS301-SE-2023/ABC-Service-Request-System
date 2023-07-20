import mongoose from "mongoose";
import config from "../configs/ticket.config";
import { ConnectOptions } from "mongoose";

const dbConnection = async() => {
  await mongoose.connect(config.DB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(res => {
    console.log("Ticket DB connected");
  })
  .catch(err => {
    console.error("Error ============ ON TICKET DB Connection");
    console.log(err);
  });
}

export default dbConnection;