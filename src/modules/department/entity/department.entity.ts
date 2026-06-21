import {BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GroupsEntity} from "./groups.entity";

@Entity('departments')
export class DepartmentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => GroupsEntity, (group) => group.department)
    groups: GroupsEntity[];
}