import {Module} from "@nestjs/common";
import {HelperService} from "./helper.service";
import {EntityPipe} from "./pipe/entity.pipe";

@Module({
    providers: [HelperService, EntityPipe],
    exports: [HelperService, EntityPipe],
})
export class HelperModule {}