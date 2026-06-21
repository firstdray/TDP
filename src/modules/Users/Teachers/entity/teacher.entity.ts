import {BaseEntity, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {DepartmentEntity} from "../../../department/entity/department.entity";

@Entity('teacher')
export class TeacherEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    password: string;

    @Index()
    @Column()
    fio: string;

    @Column()
    phone: string

    @Column()
    email: string


    @OneToOne(() => DepartmentEntity, {nullable: true})
    @JoinColumn()
    department: DepartmentEntity | null;

    @Column({default: '' })
    role: string;
}
