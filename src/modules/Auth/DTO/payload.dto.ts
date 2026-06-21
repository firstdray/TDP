import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class PayloadDto {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    login: string

    @IsString()
    @IsNotEmpty()
    role: 'student' | 'teacher' | 'admin'
}