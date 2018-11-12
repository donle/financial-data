import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { Express } from 'express';

const app: Express = createExpressServer({
    controllers: []
});

app.listen(8888);