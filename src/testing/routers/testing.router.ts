import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses.db';

export const testingRouter: Router = Router();
//Ручка для удаления всех данных
testingRouter
    .delete('/all-data', (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
})
