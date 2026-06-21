import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {GroupsEntity} from "../../../department/entity/groups.entity";
import {PortfolioEntity} from "../../../portfolio/entity/portfolio.entity";

@Entity('students')
export class StudentEntity extends BaseEntity {
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

    @Column()
    direction: string

    @Column()
    link: string

    @Column({ type: 'text', array: true, default: [] })
    skills: string[]

    @Column()
    photo: string

    @Column({ default: ''})
    card: string

    @Column({name: 'card_received', default: false})
    cardReceived: boolean

    @Index()
    @ManyToOne(() => GroupsEntity, (group) => group.students)
    @JoinColumn({ name: 'group_id'})
    group: GroupsEntity;

    @OneToMany(() => PortfolioEntity, (portfolio) => portfolio.student)
    portfolios: PortfolioEntity[];
}
