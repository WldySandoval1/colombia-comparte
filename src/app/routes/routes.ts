import { Express } from "express";
import { AuthRoutes } from "./user/user";
import dashboardRouter from "./dashboard";

export class RoutesApi {
  private _app: Express; //Api principal
  private authRouter: AuthRoutes;

  constructor(app: Express) {
    this._app = app;
    this.authRouter = new AuthRoutes();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._app.use("/api/v1/user", this.authRouter.router);
    this._app.use("/api/v1/dashboard", dashboardRouter);
  }
}

//localhost:3000/api/v1/user/create
