import express, { Express } from "express";
import {testingRouter} from "./testing/routers/testing.router";
import {videosRouter} from "./videos/routers/videos.router";
import {setupSwagger} from "./swagger/setupSwagger";



export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get("/api/", (req, res) => {
    res.status(200).send("Hello world!")
  });

  app.use('/api/videos', videosRouter);
  app.use('/api/testing', testingRouter);
  setupSwagger(app);
  return app;
};
