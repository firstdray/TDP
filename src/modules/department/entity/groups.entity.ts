import {
    BaseEntity,
    Column, Entity,
    JoinColumn, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {DepartmentEntity} from "./department.entity";
import {StudentEntity} from "../../Users/Student/entity/student.entity";

@Entity('groups')
export class GroupsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => DepartmentEntity, (department) => department.groups)
    @JoinColumn({name: 'department_id'})
    department: DepartmentEntity;

    @OneToMany(() => StudentEntity, (student) => student.group)
    students: StudentEntity[];
}