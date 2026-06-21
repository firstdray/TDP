import {BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {StudentEntity} from "../../Users/Student/entity/student.entity";

@Entity('portfolio')
export class PortfolioEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'portfolio_name'})
    portfolioName: string;

    @Column({name: 'path_file'})
    pathFile: string

    @Index()
    @Column()
    role: string;

    @Column()
    description: string;

    @Column()
    stack: string

    @Index()
    @Column({default: false})
    confirmed: boolean

    @ManyToOne(() => StudentEntity, (student) => student.portfolios, {
        onDelete: 'CASCADE'
    })
    student: StudentEntity;
}