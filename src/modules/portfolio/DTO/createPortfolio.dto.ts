import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePortfolioDTO {
    @ApiProperty({
        example: "Мое портфолио",
        description: 'Название портфолио',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Название портфолио обязательно' })
    portfolioName: string;

    @ApiProperty({
        example: "/uploads/portfolio.pdf",
        description: 'Путь к файлу портфолио',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Путь к файлу обязателен' })
    pathFile: string;

    @ApiProperty({
        example: "Frontend Developer",
        description: 'Роль/специализация',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Роль обязательна' })
    role: string;

    @ApiProperty({
        example: "Описание портфолио",
        description: 'Описание портфолио',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Описание обязательно' })
    description: string;

    @ApiProperty({
        example: "React, TypeScript, Node.js",
        description: 'Стек технологий',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Стек технологий обязателен' })
    stack: string;
}