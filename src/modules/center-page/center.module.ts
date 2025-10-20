import {Module} from '@nestjs/common';
import {CenterController} from './center.controller';
import {ApiCenterService} from './center.service';

@Module({
    imports: [

    ],
    controllers: [CenterController],
    providers: [ApiCenterService],
})

export class CenterModule {}
