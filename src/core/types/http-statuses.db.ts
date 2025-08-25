export enum HttpStatus {
    OK = 200,            // GET /videos, GET /videos/{id}
    Created = 201,       // POST /videos
    NoContent = 204,     // DELETE /testing/all-data, PUT /videos/{id} (успешный апдейт), DELETE /videos/{id}
    BadRequest = 400,    // валидационные ошибки InputModel
    NotFound = 404       // видео не найдено по id
}