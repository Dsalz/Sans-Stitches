import express from 'express';
import redFlagRouter from './routes/red-flag';
import userRouter from './routes/user';

const app = express();
const port = process.env.PORT || 4000;

const currApiPrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${currApiPrefix}/red-flags`, redFlagRouter);
app.use(`${currApiPrefix}/user`, userRouter);

app.listen(port);

export default app;
