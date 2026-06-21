import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./DTO/login.dto";
import { CreateAdminDTO } from "./DTO/createAdmin.dto";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: 'Авторизация пользователя',
        description: 'Вход в систему для студентов и преподавателей'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'student123', description: 'Логин пользователя' },
                password: { type: 'string', example: 'password123', description: 'Пароль' },
                userType: {
                    type: 'string',
                    enum: ['student', 'teacher'],
                    example: 'student',
                    description: 'Тип пользователя'
                }
            },
            required: ['login', 'password', 'userType']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Успешная авторизация',
        schema: {
            example: {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                    id: 1,
                    login: "student123",
                    fio: "Иванов Иван Иванович",
                    role: "student"
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Неверный логин или пароль'
    })
    @ApiResponse({
        status: 404,
        description: 'Пользователь не найден'
    })
    async login(@Body() login: LoginDTO) {
        return this.authService.login(login);
    }

    @Post('admin')
    @ApiOperation({
        summary: 'Создание администратора',
        description: 'Регистрация нового администратора в системе'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'admin', description: 'Логин администратора' },
                password: { type: 'string', example: 'admin123', description: 'Пароль' },
                fio: { type: 'string', example: 'Администратор Системы', description: 'ФИО' },
                email: { type: 'string', example: 'admin@example.com', description: 'Email' },
                phone: { type: 'string', example: '+79123456789', description: 'Телефон' }
            },
            required: ['login', 'password', 'fio', 'email', 'phone']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Администратор успешно создан',
        schema: {
            example: {
                id: 1,
                login: "admin",
                fio: "Администратор Системы",
                email: "admin@example.com",
                phone: "+79123456789",
                role: "admin"
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Ошибка валидации данных'
    })
    @ApiResponse({
        status: 409,
        description: 'Администратор с таким логином уже существует'
    })
    async createAdmin(@Body() createData: CreateAdminDTO) {
        return this.authService.createAdmin(createData);
    }
}