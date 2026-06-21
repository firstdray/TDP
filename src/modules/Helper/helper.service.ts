import {Injectable, Logger, NotFoundException} from "@nestjs/common";
import {ObjectLiteral, Repository} from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class HelperService {
    private readonly logger = new Logger(HelperService.name);
    constructor() {}

    async isExist<T extends ObjectLiteral>(
        repository: Repository<T>,
        field: string,
        value: any,
        entityName: string,
        relations?: string[]
    ): Promise<{data: T | null, success: boolean}> {
        const entity = await repository.findOne({
            where: { [field]: value } as any,
            relations: relations
        });
        if (!entity) {
            this.logger.warn(`${entityName} with ${field} "${value}" not found`);
            return {
                data: null as unknown as T,
                success: false
            };
        }
        return {
            data: entity,
            success: true
        }
    }

    async hashedPassword(password: string) {
        return bcrypt.hash(password, 10)
    }
}
