import { ConnectOptions, connect, connection, Connection } from 'mongoose';

let db: Connection;

export const dbConnection = async () => {
  if (!db) {
    await connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    db = connection.useDb('ticketDB'); 

    db.once('open', () => {
      // console.log('Connected to ticketMongoDB');
    });

    db.on('error', (error: any) => {
      // console.error('An error occurred while connecting to MongoDB', error);
    });
  }

  return db;
};
