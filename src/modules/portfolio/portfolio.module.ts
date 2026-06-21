import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PortfolioEntity} from "./entity/portfolio.entity";
import {HelperModule} from "../Helper/helper.module";
import {PortfolioService} from "./portfolio.service";
import {PortfolioController} from "./portfolio.controller";

const entities = [PortfolioEntity]

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        HelperModule,
    ],
    providers: [PortfolioService],
    controllers: [PortfolioController],
})

export class PortfolioModule {}