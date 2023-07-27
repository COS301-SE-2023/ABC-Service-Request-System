import { ConnectOptions, connect, connection, Connection } from 'mongoose';

let db: Connection;

export const mongooseWrapper = {
  connect: connect,
  connection: connection
}

export const dbConnection = async () => {
  if (!db) {
    await connect(process.env['MONGO_URI']!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    db = connection.useDb('test'); 

    db.once('open', () => {
      // console.log('Connected to testTicketMongoDB');
    });

    db.on('error', (error: any) => {
      // console.error('An error occurred while connecting to MongoDB', error);
    });
  }

  return db;
};
