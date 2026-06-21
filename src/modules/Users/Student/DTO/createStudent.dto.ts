import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDTO {
    @ApiProperty({
        example: "student123",
        description: 'Логин студента (уникальный)',
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
        example: "Иванов Иван Иванович",
        description: 'Полное ФИО студента',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'ФИО обязательно' })
    fio: string;

    @ApiProperty({
        example: "student@example.com",
        description: 'Email студента',
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
        example: "ИСиП-41",
        description: 'Название группы',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Группа обязательна' })
    group: string;
}