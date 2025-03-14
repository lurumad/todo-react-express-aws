import { ProblemDocument } from 'http-problem-details'
import { IMappingStrategy, MapperRegistry } from 'http-problem-details-mapper'
import { logger } from '@/infrastructure/logger'


export class TodoMappingStrategy implements IMappingStrategy {
    public registry: MapperRegistry

    constructor(registry: MapperRegistry) {
        this.registry = registry
    }

    map(error: Error) {
        logger.error(error)

        return new ProblemDocument({
            status: 500,
            title: "Internal Server Error",
            type: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500",
            detail: "An unexpected error occurred",
        });
    }
}