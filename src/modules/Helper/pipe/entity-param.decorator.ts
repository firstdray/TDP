import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {EntityPipe} from "./entity.pipe";

interface EntityParamOptions {
    entityClass: any;
    searchField: string;
    returnField?: string;
}

export const EntityParam = (options: EntityParamOptions) => {
    return createParamDecorator(
        async (data: unknown, ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            const value = req.body[data as string];

            const pipe = new EntityPipe(req.app.get('datasource'))

            return pipe.transform(value, {
                entityClass: options.entityClass,
                searchField: options.searchField,
                returnField: options.returnField || 'id'
            })
        }
    )
}