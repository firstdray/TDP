import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { StudentService } from "./student.service";
import { CreateStudentDTO } from "./DTO/createStudent.dto";
import { EntityPipe } from "../../Helper/pipe/entity.pipe";
import { GroupsEntity } from "../../department/entity/groups.entity";
import { AuthGuard } from "@nestjs/passport";
import { updateUserDto } from "../DTO/updateUser.dto";
import { Roles } from "../../Auth/decorators/roles.decorators";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger";

@ApiTags("Student")
@Controller('student')
export class StudentsController {
    constructor(
        private readonly studentService: StudentService,
        private readonly entityPipe: EntityPipe
    ) {}

    @Post('register')
    @ApiOperation({
        summary: 'Регистрация студента',
        description: 'Создает нового студента. Группа должна существовать в системе.'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'student123', description: 'Логин студента' },
                password: { type: 'string', example: 'password123', description: 'Пароль' },
                fio: { type: 'string', example: 'Иванов Иван Иванович', description: 'ФИО' },
                email: { type: 'string', example: 'student@example.com', description: 'Email' },
                phone: { type: 'string', example: '+79123456789', description: 'Телефон' },
                group: { type: 'string', example: 'ИСиП-41', description: 'Название группы' }
            },
            required: ['login', 'password', 'fio', 'email', 'phone', 'group']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Студент успешно создан',
        schema: {
            example: {
                id: 1,
                login: "student123",
                fio: "Иванов Иван Иванович",
                email: "student@example.com",
                phone: "+79123456789",
                group: {
                    id: 1,
                    name: "ИСиП-41"
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибка валидации данных'
    })
    @ApiResponse({
        status: 409,
        description: 'Студент с таким логином уже существует'
    })
    async register(@Body() createStudentDTO: CreateStudentDTO) {
        const group = await this.entityPipe.transform(
            createStudentDTO.group,
            {
                metatype: {
                    entityClass: GroupsEntity,
                    searchField: 'name',
                    targetField: 'entity',
                }
            }
        )
        return this.studentService.CreateStudent(createStudentDTO, group);
    }

    @Get()
    @ApiOperation({ summary: 'Получить всех студентов' })
    @ApiResponse({
        status: 200,
        description: 'Список всех студентов',
        schema: {
            example: [
                {
                    id: 1,
                    login: "student123",
                    fio: "Иванов Иван Иванович",
                    email: "student@example.com",
                    phone: "+79123456789",
                    group: {
                        id: 1,
                        name: "ИСиП-41"
                    }
                },
                {
                    id: 2,
                    login: "student456",
                    fio: "Петров Петр Петрович",
                    email: "petrov@example.com",
                    phone: "+79876543210",
                    group: {
                        id: 2,
                        name: "ИСиП-42"
                    }
                }
            ]
        }
    })
    async getAllStudents() {
        return this.studentService.getAllStudent()
    }

    @Get('search')
    @ApiOperation({ summary: 'Поиск студента по полю' })
    @ApiQuery({
        name: 'field',
        description: 'Поле для поиска',
        enum: ['login', 'fio', 'email', 'phone'],
        example: 'fio'
    })
    @ApiQuery({
        name: 'value',
        description: 'Значение для поиска',
        example: 'Иванов'
    })
    @ApiResponse({
        status: 200,
        description: 'Найденные студенты',
        schema: {
            example: [
                {
                    id: 1,
                    login: "student123",
                    fio: "Иванов Иван Иванович",
                    email: "student@example.com",
                    phone: "+79123456789",
                    group: {
                        id: 1,
                        name: "ИСиП-41"
                    }
                }
            ]
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Студент не найден'
    })
    async searchStudent(
        @Query('field') field: string,
        @Query('value') value: string,
    ) {
        return this.studentService.getStudentByField(field, value);
    }

    @Put('update')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Обновить данные студента',
        description: 'Обновляет данные студента. Только для авторизованных студентов.'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'student123', description: 'Логин (обязательно)' },
                fio: { type: 'string', example: 'Новое Имя', description: 'ФИО (опционально)' },
                password: { type: 'string', example: 'newpassword123', description: 'Новый пароль (опционально)' },
                phone: { type: 'string', example: '+79876543210', description: 'Телефон (опционально)' },
                email: { type: 'string', example: 'new@example.com', description: 'Email (опционально)' },
                direction: {type: 'string', example: 'Backend development', description: "Направление (опционально)"},
                link: { type: 'string', example: 'https://github.com', description: 'Ссылка на внешнее портфолио (опционально)' },
                skills: { type: 'array', example: ['Javascript', 'NodeJS'], description: 'Навыки студеннта (опционально)' },
                photo: {type: 'string', example: "../../image/1.png", description: 'Путь к фотке студента (опционально)'},
                card: {type: 'string', example: 'JSON', description: 'стиль NFC карты (опционально)'},
                cardReceived: {type: 'boolean', example: true, description: 'получил ли студент карту (опционально)'},
                group: { type: 'string', example: 'ИСиП-42', description: 'Новая группа (опционально)' }
            },
            required: ['login']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Данные студента обновлены',
        schema: {
            example: {
                login: "student123",
                fio: "Новое Имя",
                phone: "+79876543210",
                email: "new@example.com",
                group: {
                    id: 2,
                    name: "ИСиП-42"
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибка валидации данных'
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен (только студенты)'
    })
    @ApiResponse({
        status: 404,
        description: 'Студент не найден'
    })
    @UseGuards(AuthGuard('jwt'))
    @Roles('student')
    async updateStudent(
        @Body() updateData: updateUserDto,
        @Body('group') groupName?: string
    ) {
        let group: GroupsEntity | undefined

        if (groupName) {
            group = await this.entityPipe.transform(groupName, {
                metatype: {
                    entityClass: GroupsEntity,
                    searchField: 'name',
                    targetField: 'entity',
                }
            })
        }

        return this.studentService.updateStudent(updateData, group);
    }

    @Delete('delete/:login')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Удалить студента по логину',
        description: 'Удаляет студента из системы. Только для администраторов.'
    })
    @ApiParam({
        name: 'login',
        description: 'Логин студента для удаления',
        example: 'student123'
    })
    @ApiResponse({
        status: 204,
        description: 'Студент успешно удален'
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован'
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен (только администраторы)'
    })
    @ApiResponse({
        status: 404,
        description: 'Студент не найден'
    })
    @UseGuards(AuthGuard('jwt'))
    @Roles('admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteStudent(@Param('login') login: string) {
        await this.studentService.deleteStudent(login)
    }
}