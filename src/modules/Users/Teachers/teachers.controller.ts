import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger";
import { TeachersService } from "./teachers.service";
import { EntityPipe } from "../../Helper/pipe/entity.pipe";
import { CreateTeacherDTO } from "./DTO/createTeacher.dto";
import { DepartmentEntity } from "../../department/entity/department.entity";
import { AuthGuard } from "@nestjs/passport";
import { updateUserDto } from "../DTO/updateUser.dto";
import { Roles } from "../../Auth/decorators/roles.decorators";

@ApiTags("Teacher")
@Controller('teacher')
export class TeachersController {
    constructor(
        private readonly teacherService: TeachersService,
        private readonly entityPipe: EntityPipe
    ) {}

    @Post('register')
    @ApiOperation({
        summary: 'Регистрация преподавателя',
        description: 'Создает нового преподавателя. Департамент должен существовать.'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'teacher123', description: 'Логин преподавателя' },
                password: { type: 'string', example: 'password123', description: 'Пароль' },
                fio: { type: 'string', example: 'Петров Петр Петрович', description: 'ФИО' },
                email: { type: 'string', example: 'teacher@example.com', description: 'Email' },
                phone: { type: 'string', example: '+79123456789', description: 'Телефон' },
                department: { type: 'string', example: 'IT Department', description: 'Название департамента' },
                role: { type: 'string', example: 'teacher', description: 'Роль (опционально)' }
            },
            required: ['login', 'password', 'fio', 'email', 'phone', 'department']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Преподаватель успешно создан',
        schema: {
            example: {
                id: 1,
                login: "teacher123",
                fio: "Петров Петр Петрович",
                email: "teacher@example.com",
                phone: "+79123456789",
                department: {
                    id: 1,
                    name: "IT Department"
                },
                role: "teacher"
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    @ApiResponse({ status: 404, description: 'Департамент не найден' })
    @ApiResponse({ status: 409, description: 'Преподаватель с таким логином уже существует' })
    async register(@Body() createData: CreateTeacherDTO) {
        const department = await this.entityPipe.transform(
            createData.department,
            {
                metatype: {
                    entityClass: DepartmentEntity,
                    searchField: 'name',
                    targetField: 'entity',
                }
            }
        )
        return this.teacherService.createTeacher(createData, department);
    }

    @Get('search')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Поиск преподавателя по полю',
        description: 'Ищет преподавателя по указанному полю (login, fio, email, phone)'
    })
    @ApiQuery({
        name: 'field',
        description: 'Поле для поиска',
        enum: ['login', 'fio', 'email', 'phone'],
        required: true,
        example: 'fio'
    })
    @ApiQuery({
        name: 'value',
        description: 'Значение для поиска',
        required: true,
        example: 'Петров'
    })
    @ApiResponse({
        status: 200,
        description: 'Найденные преподаватели',
        schema: {
            example: [
                {
                    id: 1,
                    login: "teacher123",
                    fio: "Петров Петр Петрович",
                    email: "teacher@example.com",
                    phone: "+79123456789",
                    department: {
                        id: 1,
                        name: "IT Department"
                    }
                }
            ]
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 404, description: 'Преподаватель не найден' })
    @UseGuards(AuthGuard('jwt'))
    async searchStudent(
        @Query('field') field: string,
        @Query('value') value: string,
    ) {
        return this.teacherService.getTeacherByField(field, value);
    }

    @Put('update')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Обновить данные преподавателя',
        description: 'Обновляет данные преподавателя. Только для авторизованных преподавателей.'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'teacher123', description: 'Логин (обязательно)' },
                fio: { type: 'string', example: 'Новое Имя', description: 'ФИО (опционально)' },
                password: { type: 'string', example: 'newpassword123', description: 'Новый пароль (опционально)' },
                phone: { type: 'string', example: '+79876543210', description: 'Телефон (опционально)' },
                email: { type: 'string', example: 'new@example.com', description: 'Email (опционально)' },
                department: { type: 'string', example: 'HR Department', description: 'Новый департамент (опционально)' }
            },
            required: ['login']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Данные преподавателя обновлены',
        schema: {
            example: {
                login: "teacher123",
                fio: "Новое Имя",
                phone: "+79876543210",
                email: "new@example.com",
                department: {
                    id: 2,
                    name: "HR Department"
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только преподаватели)' })
    @ApiResponse({ status: 404, description: 'Преподаватель не найден' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('teacher')
    async updateTeacher(
        @Body() updateData: updateUserDto,
        @Body('department') departmentName?: string
    ) {
        let department: DepartmentEntity | undefined;

        if (departmentName) {
            department = await this.entityPipe.transform(departmentName, {
                metatype: {
                    entityClass: DepartmentEntity,
                    searchField: 'name',
                    targetField: 'entity'
                }
            })
        }

        return this.teacherService.updateTeacher(updateData, department);
    }

    @Delete('delete/:login')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Удалить преподавателя по логину',
        description: 'Удаляет преподавателя из системы. Только для администраторов.'
    })
    @ApiParam({
        name: 'login',
        description: 'Логин преподавателя для удаления',
        example: 'teacher123'
    })
    @ApiResponse({
        status: 204,
        description: 'Преподаватель успешно удален'
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только администраторы)' })
    @ApiResponse({ status: 404, description: 'Преподаватель не найден' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTeacher(@Param('login') login: string) {
        await this.teacherService.deleteTeacher(login);
    }
}