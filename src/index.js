import express from 'express';
import path from 'path';
import paymentsRoute from './routes/payments.routes.js';
import { PORT } from './config.js';
const app = express();

app.use(express.json());

app.use('/api', paymentsRoute);

app.use(express.static(path.resolve('src/public')));


app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});