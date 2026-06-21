import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DepartmentEntity} from "./entity/department.entity";
import {GroupsEntity} from "./entity/groups.entity";
import {DepartmentService} from "./department.service";
import {DepartmentController} from "./department.controller";
import {HelperModule} from "../Helper/helper.module";
import {UsersModule} from "../Users/users.module";

const entities = [DepartmentEntity, GroupsEntity]

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        HelperModule,
        forwardRef(() => UsersModule),
    ],
    providers: [DepartmentService],
    controllers: [DepartmentController],
    exports: [DepartmentService],
})

export class DepartmentModule {}