import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./modules/Users/users.module";
import {PortfolioModule} from "./modules/portfolio/portfolio.module";
import {AuthModule} from "./modules/Auth/auth.module";
import {DepartmentModule} from "./modules/department/department.module";
import {HelperModule} from "./modules/Helper/helper.module";
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "root",
            database: "tdp",
            autoLoadEntities: true,
            synchronize: true,
        }),
        AuthModule,
        DepartmentModule,
        HelperModule,
        PortfolioModule,
        UsersModule,
    ]
})

export class AppModule {}
