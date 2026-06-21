import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StudentEntity} from "./entity/student.entity";
import {In, Repository} from "typeorm";
import {CreateStudentDTO} from "./DTO/createStudent.dto";
import {HelperService} from "../../Helper/helper.service";
import {GroupsEntity} from "../../department/entity/groups.entity";
import {AuthService} from "../../Auth/auth.service";
import {updateUserDto} from "../DTO/updateUser.dto";
import {getStudentDTO} from "./DTO/getStudent.dto";

@Injectable()
export class StudentService {
    private readonly logger = new Logger(StudentService.name);
    constructor(
        @InjectRepository(StudentEntity)
        private readonly studentRepository: Repository<StudentEntity>,
        private readonly helperService: HelperService,
        private readonly authService: AuthService
    ) {}

    async CreateStudent(createData: CreateStudentDTO, group: GroupsEntity) {
        try {
            const result = await this.helperService.isExist(
                this.studentRepository,
                'login',
                createData.login,
                'Students'
            )

            if (result.success) {
                this.logger.warn('Student already exists');
                throw new ConflictException('Student already exists');
            }

            const hashPassword = await this.helperService.hashedPassword(createData.password)

            const student = this.studentRepository.create({
                login: createData.login,
                password: hashPassword,
                fio: createData.fio,
                phone: createData.phone,
                email: createData.email,
                direction: '',
                link: '',
                skills: [''],
                photo: '',
                group: group,
            })

            const save = await this.studentRepository.save(student)

            const token = await this.authService.generateToken({
                id: save.id,
                login: save.login,
                role: 'student'
            })

            const {id,password, ...Student} = save

            return {
                accessToken: token,
                user: Student
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error creating student');
        }
    }

    async updateStudent(updateData: updateUserDto, group?: GroupsEntity) {
        try {
            const student = await this.helperService.isExist(
                this.studentRepository,
                'login',
                updateData.login,
                'Students'
            )

            if (!student.success || !student.data) {
                throw new NotFoundException(`Student with login "${updateData.login}" not found`);
            }

            if (updateData.password) {
                student.data.password = await this.helperService.hashedPassword(updateData.password)
            }

            if (updateData.fio) {
                student.data.fio = updateData.fio;
            }

            if (updateData.phone) {
                student.data.phone = updateData.phone;
            }

            if (updateData.email) {
                student.data.email = updateData.email
            }

            if (updateData.card) {
                student.data.card = updateData.card
            }

            if (updateData.cardReceived) {
                student.data.cardReceived = updateData.cardReceived
            }

            if (group) {
                student.data.group = group
            }

            if (updateData.direction) {
                student.data.direction = updateData.direction
            }

            if (updateData.link) {
                student.data.link = updateData.link
            }

            if (updateData.skills) {
                student.data.skills = updateData.skills
            }

            if (updateData.photo) {
                student.data.photo = updateData.photo
            }

            const saved = await this.studentRepository.save(student.data)

            const {id, ...studentNotId} = saved

            return studentNotId;
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error update student')
        }
    }

    async getStudentByField(field: string, value: string): Promise<getStudentDTO[]> {
        try {
            const students = await this.studentRepository.find({
                where: { [field]: value },
                relations: ['group']
            });

            return students.map(({ password, group, ...students}) => ({
                ...students,
                group: group.name
            }))
        } catch (err) {
            this.logger.error(err);

            if (err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error getting students');
        }
    }

    async getAllStudent(): Promise<getStudentDTO[]> {
        try {
            const students = await this.studentRepository.find({
                relations: ['group']
            })

            return students.map(({ password, group, ...students}) => ({
                ...students,
                group: group.name
            }))
        }catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error getting students');
        }
    }

    async deleteStudent(login: string) {
        try {
            const result = await this.studentRepository.delete({login: login});

            if (result.affected === 0) {
                throw new NotFoundException(`Student with login: ${login} not found`);
            }

            return { message: 'Student deleted successfully' };
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error deleting student');
        }
    }

    async deleteStudentsByIds(ids: number[]) {
        try {
            if (!ids || ids.length === 0) {
                return { deleted: 0 };
            }

            const result = await this.studentRepository.delete({
                id: In(ids)
            });

            this.logger.log(`Deleted ${result.affected} students`);

            return {
                deleted: result.affected,
                deletedIds: ids
            };
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error deleting students');
        }
    }
}