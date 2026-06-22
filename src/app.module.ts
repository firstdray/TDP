import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./modules/Users/users.module";
import {PortfolioModule} from "./modules/portfolio/portfolio.module";
import {AuthModule} from "./modules/Auth/auth.module";
import {DepartmentModule} from "./modules/department/department.module";
import {HelperModule} from "./modules/Helper/helper.module";
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST') || 'postgres',
                port: configService.get<number>('DB_PORT') || 5432,
                username: configService.get<string>('DB_USERNAME') || 'postgres',
                password: configService.get<string>('DB_PASSWORD') || 'root',
                database: configService.get<string>('DB_DATABASE') || 'tdp',
                autoLoadEntities: true,
                synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || true,
                logging: configService.get<boolean>('DB_LOGGING') || true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        DepartmentModule,
        HelperModule,
        PortfolioModule,
        UsersModule,
    ]
})

export class AppModule {}
