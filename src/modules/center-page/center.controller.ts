import {Controller, Get} from '@nestjs/common';
import {ApiCenterService} from './center.service';
import { CsrPage } from '~/src/utils/util-render-page';

@Controller('/')
export class CenterController {
    @Get('/center')
    handlerCenter(@CsrPage({apiService: ApiCenterService}) csrPage: string) {
        return csrPage;
    }
    @Get('/a-center')
    handlerACenter(@CsrPage({apiService: ApiCenterService}) csrPage: string) {
        return csrPage;
    }
    @Get('/b-center/:type')
    handlerBCenter(@CsrPage({apiService: ApiCenterService}) csrPage: string) {
        return csrPage;
    }
}
