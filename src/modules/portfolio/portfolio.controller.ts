import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger";
import { PortfolioService } from "./portfolio.service";
import { Roles } from "../Auth/decorators/roles.decorators";
import { CreatePortfolioDTO } from "./DTO/createPortfolio.dto";
import { UpdatePortfolioDTO } from "./DTO/updatePortfolio.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Portfolio")
@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Post('create')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Создать портфолио',
        description: 'Создает новое портфолио для авторизованного студента'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                portfolioName: { type: 'string', example: 'Мое портфолио', description: 'Название портфолио' },
                pathFile: { type: 'string', example: '/uploads/portfolio.pdf', description: 'Путь к файлу' },
                role: { type: 'string', example: 'Frontend Developer', description: 'Роль' },
                description: { type: 'string', example: 'Описание портфолио', description: 'Описание' },
                stack: { type: 'string', example: 'React, TypeScript, Node.js', description: 'Стек технологий' }
            },
            required: ['portfolioName', 'pathFile', 'role', 'description', 'stack']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Портфолио успешно создано',
        schema: {
            example: {
                id: 1,
                portfolioName: "Мое портфолио",
                pathFile: "/uploads/portfolio.pdf",
                role: "Frontend Developer",
                description: "Описание портфолио",
                stack: "React, TypeScript, Node.js",
                confirmed: false,
                studentFio: "Иванов Иван Иванович"
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только студенты)' })
    @ApiResponse({ status: 409, description: 'Портфолио с таким названием уже существует' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('student')
    async createPortfolio(
        @Body() createData: CreatePortfolioDTO,
        @Req() req: any,
    ) {
        const studentId = req.user.id;
        return await this.portfolioService.createPortfolio(createData, studentId);
    }

    @Put('update')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Обновить портфолио',
        description: 'Обновляет данные портфолио по названию'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                portfolioName: { type: 'string', example: 'Мое портфолио', description: 'Название портфолио (обязательно)' },
                pathFile: { type: 'string', example: '/uploads/new-portfolio.pdf', description: 'Новый путь к файлу' },
                description: { type: 'string', example: 'Новое описание', description: 'Новое описание' },
                stack: { type: 'string', example: 'React, Vue, Angular', description: 'Новый стек технологий' }
            },
            required: ['portfolioName']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Портфолио обновлено',
        schema: {
            example: {
                portfolioName: "Мое портфолио",
                pathFile: "/uploads/new-portfolio.pdf",
                description: "Новое описание",
                stack: "React, Vue, Angular",
                confirmed: false,
                studentFio: "Иванов Иван Иванович"
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только студенты)' })
    @ApiResponse({ status: 404, description: 'Портфолио не найдено' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('student')
    async updatePortfolio(@Body() updateData: UpdatePortfolioDTO) {
        return await this.portfolioService.updatePortfolio(updateData);
    }

    @Put('confirmed')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Подтвердить портфолио',
        description: 'Подтверждает портфолио (только для преподавателей)'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                namePortfolio: { type: 'string', example: 'Мое портфолио', description: 'Название портфолио' }
            },
            required: ['namePortfolio']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Портфолио подтверждено',
        schema: {
            example: {
                portfolioName: "Мое портфолио",
                pathFile: "/uploads/portfolio.pdf",
                role: "Frontend Developer",
                description: "Описание портфолио",
                stack: "React, TypeScript, Node.js",
                confirmed: true,
                studentFio: "Иванов Иван Иванович"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только преподаватели)' })
    @ApiResponse({ status: 404, description: 'Портфолио не найдено' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('teacher')
    async confirmedPortfolio(@Body('namePortfolio') namePortfolio: string) {
        return await this.portfolioService.confirmedPortfolio(namePortfolio);
    }

    @Get('search')
    @ApiOperation({
        summary: 'Поиск портфолио по полю',
        description: 'Ищет портфолио по указанному полю (portfolioName, role, stack)'
    })
    @ApiQuery({
        name: 'field',
        description: 'Поле для поиска',
        enum: ['portfolioName', 'role', 'stack'],
        required: true,
        example: 'role'
    })
    @ApiQuery({
        name: 'value',
        description: 'Значение для поиска',
        required: true,
        example: 'Frontend'
    })
    @ApiResponse({
        status: 200,
        description: 'Найденные портфолио',
        schema: {
            example: [
                {
                    id: 1,
                    portfolioName: "Мое портфолио",
                    pathFile: "/uploads/portfolio.pdf",
                    role: "Frontend Developer",
                    description: "Описание портфолио",
                    stack: "React, TypeScript, Node.js",
                    confirmed: true,
                    student: {
                        id: 1,
                        fio: "Иванов Иван Иванович"
                    }
                }
            ]
        }
    })
    @ApiResponse({ status: 404, description: 'Портфолио не найдены' })
    async getPortfolio(
        @Query('field') field: string,
        @Query('value') value: string,
    ) {
        return await this.portfolioService.getPortfolioByField(field, value);
    }

    @Get()
    @ApiOperation({
        summary: 'Получить все портфолио',
        description: 'Возвращает список всех портфолио'
    })
    @ApiResponse({
        status: 200,
        description: 'Список всех портфолио',
        schema: {
            example: [
                {
                    id: 1,
                    portfolioName: "Мое портфолио",
                    pathFile: "/uploads/portfolio.pdf",
                    role: "Frontend Developer",
                    description: "Описание портфолио",
                    stack: "React, TypeScript, Node.js",
                    confirmed: true,
                    student: {
                        id: 1,
                        fio: "Иванов Иван Иванович"
                    }
                },
                {
                    id: 2,
                    portfolioName: "Мое второе портфолио",
                    pathFile: "/uploads/portfolio2.pdf",
                    role: "Backend Developer",
                    description: "Описание второго портфолио",
                    stack: "Node.js, Python, Go",
                    confirmed: false,
                    student: {
                        id: 1,
                        fio: "Иванов Иван Иванович"
                    }
                }
            ]
        }
    })
    async getAllPortfolios() {
        return await this.portfolioService.getAllPortfolio();
    }

    @Delete('delete/:portfolio')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Удалить портфолио по названию',
        description: 'Удаляет портфолио по названию (только для студентов)'
    })
    @ApiParam({
        name: 'portfolio',
        description: 'Название портфолио для удаления',
        example: 'Мое портфолио'
    })
    @ApiResponse({
        status: 200,
        description: 'Портфолио удалено',
        schema: {
            example: {
                message: "Portfolio Мое портфолио deleted successfully"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только студенты)' })
    @ApiResponse({ status: 404, description: 'Портфолио не найдено' })
    @UseGuards(AuthGuard('jwt'))
    @Roles('student')
    async deletePortfolio(@Param('portfolio') portfolio: string) {
        return await this.portfolioService.deletePortfolio(portfolio);
    }
}