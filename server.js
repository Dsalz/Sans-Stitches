import express from 'express';
import redFlagRouter from './routes/red-flag';

const app = express();

const currApiPrefix = "/api/v1";

app.use(express.bodyparser());
app.use(express.validator())

app.use(`${currApiPrefix}/red-flag` , redFlagRouter);

app.listen('4000');

export default app;