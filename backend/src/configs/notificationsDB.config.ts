import { ConnectOptions, connect, connection, Connection } from 'mongoose';

let db: Connection;

export const dbConnection = async () => {
  if (!db) {
    await connect(process.env['MONGO_URI']!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    db = connection.useDb('notificationsDB'); 

    db.once('open', () => {
      // console.log('Connected to notifications MongoDB');
    });

    db.on('error', (error: any) => {
      // console.error('An error occurred while connecting to MongoDB', error);
    });
  }

  return db;
};
