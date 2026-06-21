import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DepartmentEntity} from "./entity/department.entity";
import {Repository} from "typeorm";
import {HelperService} from "../Helper/helper.service";
import {GroupsEntity} from "./entity/groups.entity";
import {StudentService} from "../Users/Student/student.service";

@Injectable()
export class DepartmentService {
    private readonly logger = new Logger(DepartmentService.name);
    constructor(
        @InjectRepository(DepartmentEntity)
        private readonly departmentRepository: Repository<DepartmentEntity>,
        @InjectRepository(GroupsEntity)
        private readonly groupsRepository: Repository<GroupsEntity>,
        private readonly helperService: HelperService,
        private readonly studentService: StudentService
    ) {}

    async createDepartment(name: string) {
        try{
            const result = await this.helperService.isExist(
                this.departmentRepository,
                'name',
                name,
                'Departments'
            )

            if (result.success) {
                this.logger.warn('Department already exists');
                throw new Error('Department already exists');
            }

            const save = await this.departmentRepository.save(
                {
                    name: name
                }
            )

            const {id, ...Department} = save;

            return Department
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error creating teacher');
        }
    }

    async addGroups(departmentName: string, groupsName: string[]) {
        try {
            const department = await this.helperService.isExist(
                this.departmentRepository,
                'name',
                departmentName,
                'Departments'
            )

            if (!department.success || !department.data) {
                throw new NotFoundException(`Department with name "${departmentName}" not found`);
            }

            const createdGroups: GroupsEntity[] = []
            const errors: string[] = []

            for (const groupName of groupsName) {
                try {
                    const exGroup = await this.helperService.isExist(
                        this.groupsRepository,
                        'name',
                        groupName,
                        'Groups'
                    )

                    if (exGroup.success) {
                        errors.push(`Group "${groupName}" already exists`);
                        continue;
                    }

                    const group = this.groupsRepository.create({
                        name: groupName,
                        department: department.data,
                    })

                    const savedGroup = await this.groupsRepository.save(group)
                    createdGroups.push(savedGroup)
                } catch (err) {
                    errors.push(`Error adding group ${groupName}: ${err.message}`);
                }
            }

            return {
                success: createdGroups.length,
                failed: errors.length,
                department: department.data.name,
                groups: createdGroups,
                errors: errors
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error adding groups');
        }
    }

    async getAllDepartment() {
        try {
            const departments = await this.departmentRepository.find({
                relations: ['groups']
            })

            if (!departments || departments.length === 0) {
                throw new NotFoundException('Department not found');
            }

            return departments.map(({ id, name, groups}) => ({
                name,
                groups: groups?.map((group) => group.name) || []
            }))
        } catch (err) {
            this.logger.error(err);

            if (err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error getting department');
        }
    }

    async deleteDepartment(name: string) {
        try {
            const department = await this.departmentRepository.findOne({
                where: { name: name },
                relations: ['groups', 'groups.students']
            });

            if (!department) {
                throw new NotFoundException(`Department with name: ${name} not found`);
            }

            const hasStudents = department.groups?.some(group =>
                group.students && group.students.length > 0
            );

            if (hasStudents) {
                throw new ConflictException(
                    'Cannot delete department: it has students in its groups'
                );
            }

            if (department.groups && department.groups.length > 0) {
                throw new ConflictException(
                    `Cannot delete department: it has ${department.groups.length} groups. 
                 Delete groups first or move students.`
                );
            }

            await this.departmentRepository.delete(department.id);

            return {
                message: 'Department deleted successfully',
                deletedDepartment: department.name
            };
        }catch (err) {
            this.logger.error(err)
            throw new InternalServerErrorException('Error deleting department')
        }
    }

    async deleteGroup(groupName: string, force: boolean = false) {
        try {
            const group = await this.groupsRepository.findOne({
                where: { name: groupName },
                relations: ['students']
            });

            if (!group) {
                throw new NotFoundException(`Group with name: ${groupName} not found`);
            }

            const studentsCount = group.students?.length || 0;

            if (studentsCount > 0 && !force) {
                throw new ConflictException(
                    `Cannot delete group "${groupName}": it has ${studentsCount} students. 
                 Use force=true to delete group with all students.`
                );
            }

            if (force && studentsCount > 0) {
                const studentIds = group.students.map(s => s.id);
                await this.studentService.deleteStudentsByIds(studentIds);
            }

            await this.groupsRepository.delete(group.id);

            return {
                message: 'Group deleted successfully',
                deletedGroup: group.name,
                deletedStudents: force ? studentsCount : 0
            };
        } catch (err) {
            this.logger.error(err);

            if (err instanceof NotFoundException || err instanceof ConflictException) {
                throw err;
            }

            throw new InternalServerErrorException('Error deleting group');
        }
    }
}