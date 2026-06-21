// DTO/createAdmin.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateAdminDTO {
    @ApiProperty({
        example: "admin",
        description: 'Логин администратора',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Логин обязателен' })
    login: string;

    @ApiProperty({
        example: "admin123",
        description: 'Пароль (минимум 6 символов)',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Пароль обязателен' })
    password: string;

    @ApiProperty({
        example: "Администратор Системы",
        description: 'ФИО администратора',
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'ФИО обязательно' })
    fio: string;

    @ApiProperty({
        example: "admin@example.com",
        description: 'Email администратора',
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
    @IsPhoneNumber('RU', {
        message: 'Некорректный номер телефона (формат: +7XXXXXXXXXX)'
    })
    @IsNotEmpty({ message: 'Телефон обязателен' })
    phone: string;
}