import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../Auth/Guards/roles.guard";
import { DepartmentService } from "./department.service";
import { Roles } from "../Auth/decorators/roles.decorators";

@ApiTags("Department")
@Controller('department')
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService,
    ) {}

    @Post('create-department')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Создать новый отдел (только admin)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'IT Department', description: 'Название отдела' }
            },
            required: ['name']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Отдел создан',
        schema: {
            example: {
                id: 1,
                name: "IT Department"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только admin)' })
    @ApiResponse({ status: 409, description: 'Отдел с таким названием уже существует' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async createDepartment(@Body('name') name: string) {
        return this.departmentService.createDepartment(name);
    }

    @Post('add-group')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Добавить группы в отдел (только admin)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                department: { type: 'string', example: 'IT Department', description: 'Название отдела' },
                groups: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['ИСиП-41', 'ИСиП-42', 'ИСиП-43'],
                    description: 'Список названий групп'
                }
            },
            required: ['department', 'groups']
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Группы добавлены',
        schema: {
            example: {
                success: 3,
                failed: 0,
                department: "IT Department",
                groups: [
                    { id: 1, name: "ИСиП-41" },
                    { id: 2, name: "ИСиП-42" },
                    { id: 3, name: "ИСиП-43" }
                ],
                errors: []
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только admin)' })
    @ApiResponse({ status: 404, description: 'Отдел не найден' })
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async addedGroup(@Body() body: { department: string; groups: string[] }) {
        return this.departmentService.addGroups(body.department, body.groups);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все отделы' })
    @ApiResponse({
        status: 200,
        description: 'Список всех отделов',
        schema: {
            example: [
                {
                    id: 1,
                    name: "IT Department",
                    groups: [
                        { id: 1, name: "ИСиП-41" },
                        { id: 2, name: "ИСиП-42" }
                    ]
                },
                {
                    id: 2,
                    name: "HR Department",
                    groups: []
                }
            ]
        }
    })
    async getAllDepartment() {
        return this.departmentService.getAllDepartment();
    }

    @Delete('department/:name')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удалить отдел по названию (только admin)' })
    @ApiParam({
        name: 'name',
        description: 'Название отдела для удаления',
        example: 'IT Department'
    })
    @ApiResponse({
        status: 200,
        description: 'Отдел удален',
        schema: {
            example: {
                message: "Department IT Department deleted successfully"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только admin)' })
    @ApiResponse({ status: 404, description: 'Отдел не найден' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async deleteDepartment(@Param('name') nameDepartment: string) {
        return this.departmentService.deleteDepartment(nameDepartment);
    }

    @Delete('group/:name')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Удалить группу по названию (только admin)' })
    @ApiParam({
        name: 'name',
        description: 'Название группы для удаления',
        example: 'ИСиП-41'
    })
    @ApiResponse({
        status: 200,
        description: 'Группа удалена',
        schema: {
            example: {
                message: "Group ИСиП-41 deleted successfully"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Не авторизован' })
    @ApiResponse({ status: 403, description: 'Доступ запрещен (только admin)' })
    @ApiResponse({ status: 404, description: 'Группа не найдена' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async deleteGroup(@Param('name') nameGroup: string) {
        return this.departmentService.deleteGroup(nameGroup);
    }
}