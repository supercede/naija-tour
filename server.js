import { config } from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app';

config();

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.MONGO_PASSWORD
);

console.log(db);
mongoose
  .connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(console.log('Connected to DB'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is listening on port ${port}`));
