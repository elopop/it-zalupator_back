import { Request, Response, Router } from 'express';
import {HttpStatus} from "../../core/types/http-statuses.db";
import {db} from "../../db/in-memory.db";
import {badRequest, isoNow, plusDaysISO, validateCreate, validateUpdate} from "../../validation/videos.validation";
import {Video} from "../types/videos";

export const videosRouter: Router = Router()
// роут с videos
videosRouter
    .get('/', function (_req: Request, res: Response) {
        return res.status(HttpStatus.OK).send(db.videos);
    })
    //создание записи в бд
    .post('/', function (req: Request, res: Response) {
        // валидируем входной body
        const errors = validateCreate(req.body);
        if (errors.length > 0) {
            return badRequest(res, errors);
        }
        // генерим id как lastId + 1 (in-memory автоинкремент)
        const lastId = db.videos.length > 0 ? (db.videos[db.videos.length -1] ?.id ?? 0) : 0;

        const createdAt = isoNow();

        const video: Video = {
            id: lastId +1,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt,
            publicationDate: plusDaysISO(createdAt, 1),
            availableResolutions: req.body.availableResolutions,
        };
        db.videos.push(video);
        return  res.status(HttpStatus.Created).send(video);

    })
    // Получить видео по id. 404, если не найдено.
    .get('/:id', function (req: Request, res: Response) {
        const id = Number(req.params.id);
        const video = db.videos.find(function (v) {
            return v.id === id;
        });
        if (!video) {
            return res.sendStatus(HttpStatus.NotFound); // для тестов важно прописать sendStatus
        }
        return res.status(HttpStatus.OK).send(video);
    })

    .put('/:id', function (req: Request, res: Response) {
        const id = Number(req.params.id);
        const video = db.videos.find(v => v.id === id);

        if (!video) {
            return res.sendStatus(HttpStatus.NotFound)
        }

        const errors = validateUpdate(req.body);
        if (errors.length > 0) {
            return badRequest(res, errors);
        }

        //Обновляем поля
        video.title = req.body.title;
        video.author = req.body.author;
        video.availableResolutions = req.body.availableResolutions;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.publicationDate = req.body.publicationDate;

        return res.sendStatus(HttpStatus.NoContent);
    })

    .delete('/:id', function (req: Request, res: Response) {
        let id = Number(req.params.id);
        let index = db.videos.findIndex(function (v) { return v.id === id; });

        if (index === -1) {
            return res.sendStatus(HttpStatus.NotFound);
        }
        db.videos.splice(index, 1);
        return res.sendStatus(HttpStatus.NoContent)
    })


