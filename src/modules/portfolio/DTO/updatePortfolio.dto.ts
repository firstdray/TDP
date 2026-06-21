import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePortfolioDTO {
    @ApiProperty({
        example: "Мое портфолио",
        description: 'Название портфолио (обязательно для поиска)',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Название портфолио обязательно' })
    portfolioName: string;

    @ApiProperty({
        example: "/uploads/new-portfolio.pdf",
        description: 'Новый путь к файлу (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    pathFile?: string;

    @ApiProperty({
        example: "Новое описание портфолио",
        description: 'Новое описание (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: "React, Vue, Angular",
        description: 'Новый стек технологий (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    stack?: string;
}