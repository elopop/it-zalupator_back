import { Video, Resolutions } from "../videos/types/videos";

/**
 * Simple in-memory database with seeded data for development & tests.
 * Use testing route DELETE /api/testing/all-data to clear.
 */
export const db: { videos: Video[] } = {
    videos: [
        {
            id: 1,
            title: "Intro to Project",
            author: "Tutor",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date("2025-08-24T12:00:00.000Z").toISOString(),
            publicationDate: new Date("2025-08-25T12:00:00.000Z").toISOString(),
            availableResolutions: [Resolutions.P144, Resolutions.P360],
        },
        {
            id: 2,
            title: "Setup Environment",
            author: "Tutor",
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date("2025-08-22T09:30:00.000Z").toISOString(),
            publicationDate: new Date("2025-08-23T09:30:00.000Z").toISOString(),
            availableResolutions: [Resolutions.P720, Resolutions.P1080],
        },
        {
            id: 3,
            title: "CRUD with Express",
            author: "Mentor",
            canBeDownloaded: false,
            minAgeRestriction: 16,
            createdAt: new Date("2025-08-23T16:45:00.000Z").toISOString(),
            publicationDate: new Date("2025-08-24T16:45:00.000Z").toISOString(),
            availableResolutions: [Resolutions.P480],
        },
    ],
};

/** Utility to reset DB for tests */
export function resetAll(): void {
    db.videos = [];
}