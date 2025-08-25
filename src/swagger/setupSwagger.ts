import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { OpenAPIV3 } from 'openapi-types';

// маленький deep-merge для объектов OpenAPI
function deepMerge<T extends Record<string, any>>(target: T, source: T): T {
    for (const key of Object.keys(source)) {
        const sv = source[key];
        const tv = (target as any)[key];
        if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
            (target as any)[key] = deepMerge(tv ?? {}, sv);
        } else {
            (target as any)[key] = sv;
        }
    }
    return target;
}

// src/swagger/setupSwagger.ts
function loadYaml(file: string) {
    const baseName = file.replace(/\.ya?ml$/i, ''); // обрежем расширение, если вдруг передали
    const candidates = [
        // dist рядом с собранным js
        path.resolve(__dirname, `${baseName}.yml`),
        path.resolve(__dirname, `${baseName}.yaml`),
        // исходники
        path.resolve(process.cwd(), 'src/swagger', `${baseName}.yml`),
        path.resolve(process.cwd(), 'src/swagger', `${baseName}.yaml`),
    ];

    for (const full of candidates) {
        if (fs.existsSync(full)) {
            const text = fs.readFileSync(full, 'utf8');
            return YAML.parse(text) as Record<string, any>;
        }
    }

    throw new Error(
        `Swagger YAML not found: ${file}. Tried:\n- ${candidates.join('\n- ')}`
    );
}

export function setupSwagger(app: Express): void {
    // базовый каркас OpenAPI
    const doc: OpenAPIV3.Document = {
        openapi: '3.0.3',
        info: {
            title: 'Homework 1 — Videos API',
            version: '1.0.0',
            description:
                'CRUD для /videos + тестовый очиститель /testing/all-data. +поля и валидация',
        },
        servers: [{ url: 'http://localhost:5001/api', description: 'Local dev' }],
        tags: [
            { name: 'videos', description: 'Видео' },
            { name: 'testing', description: 'Тестовые ручки (очистка БД)' },
        ],
        paths: {},
        components: { schemas: {} },
    };

    // мержим по частям
    deepMerge(doc, loadYaml('./components.schemas.yml')); // схемы
    deepMerge(doc, loadYaml('./videos.swagger.yml'));     // пути /videos
    deepMerge(doc, loadYaml('./testing.swagger.yml'));    // путь /testing/all-data

    // UI по /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(doc));

// JSON по /openapi.json
    app.get('/openapi.json', function (_req, res) {
        res.json(doc);
    });
}