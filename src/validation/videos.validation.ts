import {FieldError} from '../videos/types/validationError';
import {Resolutions} from '../videos/types/videos';
import {type} from "node:os";
import {HttpStatus} from "../core/types/http-statuses.db";
import {Response} from "express";

function isValidISODateString(value: unknown): boolean {
    // Должно быть строкой
    if (typeof value !== 'string') return false;

    // Date.parse вернёт количество миллисекунд с 1970 года, если строка валидная
    const ms = Date.parse(value);

    // Если результат NaN → строка невалидна
    return !Number.isNaN(ms);
}

function sanitizeResolutions (values: unknown): Resolutions[] | null {
    //Должен быть массивом и не пустым
    if (!Array.isArray(values) || values.length === 0) return null;

    //Берем разрешенные значения из enum Resolutions
    const allowed = new Set(Object.values(Resolutions));

    // Проверяем, что каждый элемент массива входит в список разрешённых
    for (const v of values) {
        if (typeof v !== 'string' || !allowed.has(v as Resolutions)) {
            return null;
        }
    }

    //все гуд -> возвращаем массив как Resolutions[]
    return values as Resolutions[];

}

//Возвращает текущую дату время в формате ISO
export function isoNow(): string {
    return new Date().toISOString();
}

// +N дней к ISO-строке (publicationDate = createdAT + 1d)
export function  plusDaysISO(baseIso: string, days: number): string {
    const d = new Date(baseIso);
    d.setDate(d.getDate() + days);
    return  d.toISOString();
}

//упаковка ошибок в формат по swagger (errorsMessages: FieldError[])
export function badRequest(res: Response, errors: FieldError[]) {
    return res.status(HttpStatus.BadRequest).send({errorsMessages: errors});
}

// Основные функции валидации
export function validateCreate(body: any): FieldError[] {
    const errors: FieldError[] = [];

    //Проверка title
    if (typeof body.title !== 'string' || body.title.trim().length === 0 || body.title.length > 40) {
        errors.push({field: 'title', message: 'Title must be <= 40 chars'})
    }
    // Проверка author (строка не пустая и меньше 20 символов)
    if (typeof body.author !== 'string' || body.author.trim().length === 0 || body.author.length > 20) {
        errors.push({field: 'title', message: 'Author must be <= 20 chars'})
    }
    //проверка availableResolutions
    if (!sanitizeResolutions(body.availableResolutions)) {
        errors.push(({field: 'title', message: 'At least one valid resolution required'}))
    }
    return errors;
}

export function validateUpdate(body:any): FieldError[] {
    const errors: FieldError[] = [];
    // Проверка title
    if (typeof body.title !== 'string' || body.title.trim().length === 0 || body.title.length > 40) {
        errors.push({ field: 'title', message: 'Title is required and must be <= 40 chars' });
    }

    // Проверка author
    if (typeof body.author !== 'string' || body.author.trim().length === 0 || body.author.length > 20) {
        errors.push({ field: 'author', message: 'Author is required and must be <= 20 chars' });
    }

    // Проверка availableResolutions
    if (!sanitizeResolutions(body.availableResolutions)) {
        errors.push({ field: 'availableResolutions', message: 'At least one valid resolution is required' });
    }

    // Проверка canBeDownloaded: должно быть boolean
    if (typeof body.canBeDownloaded !== "boolean") {
        errors.push({field: 'canBeDownloaded', message: 'canBeDownloaded must be a boolean'})
    }

    //првоерка minAgeRestriction (лтбо null, либо int from 1 to 18)
    const mar = body.minAgeRestriction;
    const marOK = (mar === null) || (typeof mar === 'number' && Number.isInteger(mar) && mar >= 1 && mar <= 18);
    if (!marOK) {
        errors.push({field: 'minAgeRestriction', message: 'minAgeRestriction must be integer from 1 to 18 or null'});
    }

    //Проверка publicationDate (строка в формате ISO)
    if (!isValidISODateString(body.publicationDate)) {
        errors.push({field: 'publicationDate', message: 'publicationDate must be ISO date-time string'})
    }

    return errors
}