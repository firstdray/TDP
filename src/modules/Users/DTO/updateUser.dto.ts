import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class updateUserDto {
    @ApiProperty({
        example: "student123",
        description: 'Логин пользователя (обязательно)',
        required: true
    })
    @IsNotEmpty({ message: 'Логин обязателен' })
    @IsString()
    login: string;

    @ApiProperty({
        example: "newpassword123",
        description: 'Новый пароль (опционально, минимум 6 символов)',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    password?: string;

    @ApiProperty({
        example: "Новое Имя",
        description: 'Новое ФИО (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'ФИО не может быть пустым' })
    fio?: string;

    @ApiProperty({
        example: "+79876543210",
        description: 'Новый телефон в формате +7XXXXXXXXXX (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Телефон не может быть пустым' })
    @IsPhoneNumber('RU', { message: 'Некорректный номер телефона (формат: +7XXXXXXXXXX)' })
    phone?: string;

    @ApiProperty({
        example: "new@example.com",
        description: 'Новый Email (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Email не может быть пустым' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    email?: string;

    @ApiProperty({
        example: "1234567890",
        description: 'Номер карты (опционально)',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'Карта не может быть пустой' })
    card?: string;

    @ApiProperty({
        example: true,
        description: 'Статус получения карты (опционально)',
        required: false
    })
    @IsBoolean({ message: 'cardReceived должен быть boolean' })
    @IsOptional()
    cardReceived?: boolean;

    @ApiProperty({
        example: true,
        description: 'Направление развития (опционально)',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    direction: string

    @ApiProperty({
        example: true,
        description: 'ссылка на внешнее портфолио (опционально)',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    link: string

    @ApiProperty({
        example: true,
        description: 'обладаемые студентом навыки (опционально)',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    skills: string[]

    @ApiProperty({
        example: true,
        description: 'путь к фотке студента (опционально)',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    photo: string
}