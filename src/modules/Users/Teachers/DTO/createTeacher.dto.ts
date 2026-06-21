import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateTeacherDTO {
    @ApiProperty({
        example: "teacher123",
        description: 'Логин преподавателя (уникальный)',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Логин обязателен' })
    login: string;

    @ApiProperty({
        example: "password123",
        description: 'Пароль (минимум 6 символов)',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Пароль обязателен' })
    password: string;

    @ApiProperty({
        example: "Петров Петр Петрович",
        description: 'Полное ФИО преподавателя',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'ФИО обязательно' })
    fio: string;

    @ApiProperty({
        example: "teacher@example.com",
        description: 'Email преподавателя',
        required: true
    })
    @IsEmail({}, { message: 'Некорректный формат email' })
    @IsNotEmpty({ message: 'Email обязателен' })
    email: string;

    @ApiProperty({
        example: "+79123456789",
        description: 'Номер телефона в формате +7XXXXXXXXXX',
        required: true
    })
    @IsPhoneNumber('RU', { message: 'Некорректный номер телефона (формат: +7XXXXXXXXXX)' })
    @IsNotEmpty({ message: 'Телефон обязателен' })
    phone: string;

    @ApiProperty({
        example: "IT Department",
        description: 'Название департамента (должен существовать)',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Департамент обязателен' })
    department: string;

    @ApiProperty({
        example: "teacher",
        description: 'Роль (опционально, по умолчанию "teacher")',
        required: false
    })
    @IsString()
    @IsOptional()
    role?: string;
}