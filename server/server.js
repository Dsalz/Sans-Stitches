import express from 'express';
import redFlagRouter from './routes/red-flag';
import interventionRouter from './routes/intervention';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 4000;

const currApiPrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${currApiPrefix}/auth`, authRouter);
app.use(`${currApiPrefix}/red-flags`, redFlagRouter);
app.use(`${currApiPrefix}/interventions`, interventionRouter);

app.listen(port);

export default app;
