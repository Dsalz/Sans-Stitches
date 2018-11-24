import express from 'express';
import redFlagRouter from './routes/red-flag';

const app = express();
const port = process.env.PORT || 4000;

const currApiPrefix = '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${currApiPrefix}/red-flag`, redFlagRouter);

app.listen(port, () => console.log('Now Serving'));

export default app;
