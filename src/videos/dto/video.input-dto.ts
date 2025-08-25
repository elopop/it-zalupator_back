// Swagger: h01.CreateVideoInputModel

import { Resolutions } from "../types/videos";

export interface CreateVideoInputDto {
    /** maxLength: 40 */
    title: string;
    /** maxLength: 20 */
    author: string;
    /**
     * At least one resolution should be added
     * Enum: Resolutions[]
     */
    availableResolutions: Resolutions[];
}