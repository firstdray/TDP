// DTO/login.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        example: "student123",
        description: 'Логин пользователя',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Логин обязателен' })
    login: string;

    @ApiProperty({
        example: "password123",
        description: 'Пароль пользователя',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Пароль обязателен' })
    password: string;

    @ApiProperty({
        example: "student",
        description: 'Тип пользователя',
        enum: ['student', 'teacher'],
        required: true
    })
    @IsString()
    @IsIn(['student', 'teacher'], {
        message: 'userType должен быть "student" или "teacher"'
    })
    userType: 'student' | 'teacher';
}