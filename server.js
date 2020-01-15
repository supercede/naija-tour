import { config } from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app';

config();

process.on('uncaughtException', err => {
  console.log('Uncaught Exception', { name: err.name, message: err });
  process.exit(1);
});

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.MONGO_PASSWORD
);

mongoose
  .connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to DB'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`app is listening on port ${port}`)
);

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection:', { name: err.name, message: err.message });
  server.close(() => {
    process.exit(1);
  });
});
