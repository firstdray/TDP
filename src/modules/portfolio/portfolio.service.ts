import {ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PortfolioEntity} from "./entity/portfolio.entity";
import {HelperService} from "../Helper/helper.service";
import {CreatePortfolioDTO} from "./DTO/createPortfolio.dto";
import {UpdatePortfolioDTO} from "./DTO/updatePortfolio.dto";
import {getPortfolioDTO} from "./DTO/getPortfolio.dto";
import {StudentEntity} from "../Users/Student/entity/student.entity";

@Injectable()
export class PortfolioService {
    private readonly logger = new Logger(PortfolioService.name);

    constructor(
        @InjectRepository(PortfolioEntity)
        private readonly portfolioRepository: Repository<PortfolioEntity>,
        private readonly helperService: HelperService
    ) {}

    async createPortfolio(createData: CreatePortfolioDTO, studentId: number) {
        try {
            const exPortfolio = await this.helperService.isExist(
                this.portfolioRepository,
                'portfolioName',
                createData.portfolioName,
                'Portfolios'
            )

            if (exPortfolio.success) {
                this.logger.warn('Portfolio already exists');
                throw new ConflictException(`Portfolio already exists`);
            }

            const portfolio = this.portfolioRepository.create({
                portfolioName: createData.portfolioName,
                pathFile: createData.pathFile,
                role: createData.role,
                description: createData.description,
                stack: createData.stack,
                student: { id: studentId } as StudentEntity
            })

            const saved = await this.portfolioRepository.save(portfolio)

            const portfolioWS = await this.portfolioRepository.findOne({
                where: { id: saved.id },
                relations: ['student']
            });

            if (!portfolioWS) {
                throw new NotFoundException(`Portfolio with id ${saved.id} not found`);
            }

            const { id, student, ...Portfolio} = portfolioWS;

            return {
                portfolio: Portfolio,
                student: student?.fio ?? 'Не указан'
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error creating portfolio');
        }
    }

    async updatePortfolio(updateData: UpdatePortfolioDTO) {
        try {
            const exPortfolio = await this.helperService.isExist(
                this.portfolioRepository,
                'portfolioName',
                updateData.portfolioName,
                'Portfolios',
                ['student']
            )

            if (!exPortfolio.success || !exPortfolio.data) {
                throw new NotFoundException(`Portfolio with name "${updateData.portfolioName}" not found`);
            }

            if (updateData.pathFile) {
                exPortfolio.data.pathFile = updateData.pathFile
            }

            if (updateData.description) {
                exPortfolio.data.pathFile = updateData.description
            }

            if (updateData.stack) {
                exPortfolio.data.stack = updateData.stack
            }

            const save = await this.portfolioRepository.save(exPortfolio.data)

            const { student, ...portfolioNotSt } = exPortfolio.data;

            return {
                student: student.fio,
                portfolioName: exPortfolio.data.portfolioName,
                pathFile: save.pathFile,
                description: save.description,
                stack: save.stack
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error update portfolio')
        }
    }

    async confirmedPortfolio(namePortfolio: string) {
        try {
            const portfolio = await this.helperService.isExist(
                this.portfolioRepository,
                'portfolioName',
                namePortfolio,
                'Portfolios',
                ['student']
            )

            if (!portfolio.success || !portfolio.data) {
                throw new NotFoundException(`Portfolio with name "${namePortfolio}" not found`);
            }

            portfolio.data.confirmed = true
            await this.portfolioRepository.save(portfolio.data)

            const { student, ...portfolioNotSt } = portfolio.data;

            return {
                student: student.fio,
                portfolio: portfolioNotSt,
            }
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error update portfolio')
        }
    }


    async getPortfolioByField(field: string, value: string): Promise<getPortfolioDTO[]> {
        try {
            const portfolios = await this.portfolioRepository.find({
                where: { [field]: value},
                relations: ['student']
            })

            return portfolios.map(({id, student, ...portfolios}) => ({
                ...portfolios,
                student: student.fio
            }))
        } catch (err) {
            this.logger.error(err);

            if (err instanceof ConflictException || err instanceof NotFoundException) {
                throw err;
            }

            throw new InternalServerErrorException('Error search portfolio')
        }
    }

    async getAllPortfolio(): Promise<getPortfolioDTO[]> {
        try {
            const portfolios = await this.portfolioRepository.find({
                relations: ['student']
            })

            return portfolios.map(({id, student, ...portfolios}) => ({
                ...portfolios,
                student: student.fio
            }))
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error update portfolio')
        }
    }

    async deletePortfolio(namePortfolio: string) {
        try {
            const res = await this.portfolioRepository.delete({portfolioName: namePortfolio})

            if (res.affected === 0) {
                throw new NotFoundException(`Destination with name ${namePortfolio} not found`);
            }

            return { message: 'Portfolio deleted successfully'}
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Error delete portfolio')
        }
    }
}