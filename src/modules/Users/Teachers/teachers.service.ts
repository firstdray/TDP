import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TeacherEntity} from "./entity/teacher.entity";
import {Repository} from "typeorm";
import {HelperService} from "../../Helper/helper.service";
import {AuthService} from "../../Auth/auth.service";
import {CreateTeacherDTO} from "./DTO/createTeacher.dto";
import {DepartmentEntity} from "../../department/entity/department.entity";
import {updateUserDto} from "../DTO/updateUser.dto";
import {getTeacherDTO} from "./DTO/getTeacger.dto";

@Injectable()
export class TeachersService {
    private readonly logger = new Logger(TeachersService.name);
    constructor(
        @InjectRepository(TeacherEntity)
        private readonly teacherRepository: Repository<TeacherEntity>,
        private readonly helperService: HelperService,
        private authService: AuthService,
    ) {}

    async createTeacher(createData: CreateTeacherDTO, department?: DepartmentEntity){
        try {
            const result = await this.helperService.isExist(
                this.teacherRepository,
                'login',
                createData.login,
                'Teachers'
            )

            if (result.success) {
                this.logger.warn('Teacher already exists');
                throw new ConflictException('Teacher already exists');
            }

            const hashPassword = await this.helperService.hashedPassword(createData.password)

            const teacher = this.teacherRepository.create({
                login: createData.login,
                password: hashPassword,
                fio: createData.fio,
                phone: createData.phone,
                email: createData.email,
                department: department,
                role: createData.role
            })

            const save = await this.teacherRepository.save(teacher)

            const token = await this.authService.generateToken({
                id: save.id,
                login: save.login,
                role: save.role === 'admin' ? 'admin' : 'teacher',
            })

            const {id, password, ...Teacher} = save;

            return {
                accessToken: token,
                user: Teacher
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error creating teacher');
        }
    }

    async updateTeacher(updateData: updateUserDto, department?: DepartmentEntity): Promise<getTeacherDTO> {
        try {
            const teacher = await this.helperService.isExist(
                this.teacherRepository,
                'login',
                updateData.login,
                'Teachers',
                ['department']
            )

            if (!teacher.success || !teacher.data) {
                throw new NotFoundException(`Teacher with login "${updateData.login}" not found`);
            }

            if (updateData.password) {
                teacher.data.password = await this.helperService.hashedPassword(updateData.password)
            }

            if (updateData.fio) {
                teacher.data.fio = updateData.fio;
            }

            if (updateData.phone) {
                teacher.data.phone = updateData.phone
            }

            if (updateData.email) {
                teacher.data.email = updateData.email
            }

            if (department) {
                teacher.data.department = department
            }

            const saved = await this.teacherRepository.save(teacher.data)

            return {
                login: saved.login,
                fio: saved.fio,
                department: teacher.data.department?.name || 'Без отделения',
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error update teacher')
        }
    }

    async getTeacherByField(field: string, value: string): Promise<getTeacherDTO[]> {
        try{
            const teacher = await this.teacherRepository.find({
                where: { [field]: value },
                relations: ['department']
            });

            return teacher.map(({ password, department, ...teachers}) => ({
                ...teachers,
                department: department?.name || 'Без отделения'
            }))
        } catch (err) {
            this.logger.error(err);

            if (err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error getting teachers');
        }
    }

    async deleteTeacher(login: string) {
        try {
            const result = await this.teacherRepository.delete({ login: login});

            if (result.affected === 0) {
                throw new NotFoundException(`Teacher with login: ${login} not found`);
            }

            return { message: 'Teacher deleted successfully' };
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error deleting teacher');
        }
    }
}