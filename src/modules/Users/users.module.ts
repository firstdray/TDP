import {Global, Module} from "@nestjs/common";
import {StudentEntity} from "./Student/entity/student.entity";
import {TeacherEntity} from "./Teachers/entity/teacher.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentsController} from "./Student/students.controller";
import {StudentService} from "./Student/student.service";
import {HelperModule} from "../Helper/helper.module";
import {TeachersController} from "./Teachers/teachers.controller";
import {TeachersService} from "./Teachers/teachers.service";
import {AuthModule} from "../Auth/auth.module";

const entities = [StudentEntity, TeacherEntity];

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        HelperModule,
        AuthModule
    ],
    providers: [StudentService, TeachersService],
    controllers: [StudentsController, TeachersController],
    exports: [StudentService, TeachersService]
})

export class UsersModule {}