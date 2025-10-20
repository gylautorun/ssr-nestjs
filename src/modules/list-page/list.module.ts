import {Module} from '@nestjs/common';
import {ListController} from './list.controller';
import {ApiController} from './api.controller';
import {ListService} from './list.service';

@Module({
    imports: [],
    controllers: [ListController, ApiController],
    providers: [ListService],
})

export class ListModule {}
