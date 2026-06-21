import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger, NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {PayloadDto} from "./DTO/payload.dto";
import * as process from "node:process";
import {LoginDTO} from "./DTO/login.dto";
import {StudentEntity} from "../Users/Student/entity/student.entity";
import {TeacherEntity} from "../Users/Teachers/entity/teacher.entity";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {HelperService} from "../Helper/helper.service";
import * as bcrypt from 'bcrypt';
import {CreateAdminDTO} from "./DTO/createAdmin.dto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private jwtService: JwtService,
        private helperService: HelperService,
        @InjectDataSource() private dataSource: DataSource
    ) {}

    async login(loginData: LoginDTO) {
        const entityClass = loginData.userType === 'student'
            ? StudentEntity
            : TeacherEntity

        const repository = this.dataSource.getRepository(entityClass);

        const user = await this.helperService.isExist(
            repository,
            'login',
            loginData.login,
            loginData.userType
        )

        if (!user.success || !user.data) {
            throw new NotFoundException(`User with login "${loginData.login}" not found`);
        }

        const isPasswordValid = await bcrypt.compare(
            loginData.password,
            user.data.password
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const token = this.jwtService.sign({
            id: user.data.id,
            login: user.data.login,
            role: loginData.userType
        })

        return {
            accessToken: token,
            user: {
                id: user.data.id,
                login: user.data.login,
                fio: user.data.fio,
                role: loginData.userType
            }
        }
    }

    async generateToken(payload: PayloadDto) {
        return this.jwtService.sign(
            {
            id: payload.id,
            login: payload.login,
            role: payload.role,
            },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: "24h",
            }
        )
    }

    async createAdmin(createData: CreateAdminDTO) {
        try {
            const adminRep = this.dataSource.getRepository(TeacherEntity)

            const exAdmin = await adminRep.findOne({
                where: {login: createData.login}
            })

            if (exAdmin) {
                throw new ConflictException(`Admin with login "${createData.login}" already exists`);
            }

            const hashPassword = await this.helperService.hashedPassword(createData.password)

            const newAdmin: TeacherEntity = adminRep.create({
                login: createData.login,
                password: hashPassword,
                fio: createData.fio,
                email: createData.email,
                phone: createData.phone,
                department: null,
                role: 'admin'
            })

            return await adminRep.save(newAdmin);
        } catch (err) {
            this.logger.error('Error create Admin',err)
            if (err instanceof ConflictException) {
                throw err;
            }
            throw new InternalServerErrorException('Error creating admin');
        }
    }
}