import express, { Express } from "express";
import {testingRouter} from "./testing/routers/testing.router";
import {videosRouter} from "./videos/routers/videos.router";



export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get("/", (req, res) => {
    res.status(200).send("Hello world!")
  });

app.use('/hometask_01/api/videos', videosRouter);
app.use('/hometask_01/api/testing', testingRouter);
  return app;
};
