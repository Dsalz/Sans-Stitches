import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
import redFlagRouter from './routes/red-flag';
import interventionRouter from './routes/intervention';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.static('./uploads'));

const currApiPrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${currApiPrefix}/auth`, authRouter);
app.use(`${currApiPrefix}/red-flags`, redFlagRouter);
app.use(`${currApiPrefix}/interventions`, interventionRouter);

// app.all('/', (req, res) => res.json({
//   status: 404,
//   error: 'Invalid Route',
// }));

// app.listen(port, () => console.log('now serving'));
app.listen(port);

export default app;
