import express from 'express';
const app = express();
import cors from 'cors';
import configRoutes from './routes/index.js';
// app.use(cors());

app.use(express.json());

configRoutes(app);

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});