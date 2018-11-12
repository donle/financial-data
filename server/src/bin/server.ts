import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { Express, RequestHandler } from 'express';
import * as ejs from 'ejs';

export class ExpressServer {
  private app: Express;
  private controllers: any[];
  private middlewares: any[];
  private viewpath: string;
  constructor(private port: number = 8888) {
    this.controllers = [];
    this.middlewares = [];
    this.viewpath = '';
  }

  public start() {
    this.app = createExpressServer({
      controllers: this.controllers,
      middlewares: this.middlewares
    });
    this.app
      .set('views', 'public')
      .set('view engine', this.viewpath)
      .engine('html', ejs.renderFile)
      .listen(this.port);
  }

  public setViewPath(viewpath: string) {
      this.viewpath = viewpath;
  }

  public use(requestHandler: RequestHandler) {
    this.middlewares.push(requestHandler);
    return this;
  }

  public controller(controller: any | any[]) {
    if (controller instanceof Array) {
      this.controllers = this.controllers.concat(controller);
    } else {
      this.controllers.push(controller);
    }
  }
}
