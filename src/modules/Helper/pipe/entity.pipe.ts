import {Injectable, Logger, NotFoundException, PipeTransform} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

@Injectable()
export class EntityPipe implements PipeTransform<string, Promise<any>> {
    private readonly logger = new Logger(EntityPipe.name);
    constructor(
        @InjectDataSource()
        private datasource: DataSource
    ) {}

    async transform(value: string, metadata: any): Promise<any> {
        const entityClass = metadata.metatype?.entityClass;
        const searchField = metadata.metatype?.searchField;
        const returnField = metadata.metatype?.targetField || 'id';

        if (!entityClass || !searchField) {
            this.logger.warn(`Entity Class/searchField ${entityClass}/${searchField} not found`);
            throw new Error('EntityPipe not valid data')
        }

        const repository = this.datasource.getRepository(entityClass);

        const entity = await repository.findOne({ where: { [searchField]: value } });

        if (!entity) {
            throw new NotFoundException(`${entityClass.name} with ${searchField} "${value}" not found`);
        }

        if (returnField === 'entity') {
            return entity;
        }

        return entity[returnField];
    }
}
