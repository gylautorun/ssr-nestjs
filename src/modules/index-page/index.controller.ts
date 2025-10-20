// import {Readable} from 'stream';
import {Controller, Get} from '@nestjs/common';
import {ApiService} from './index.service';
import { SsrPage } from '~/src/utils/util-render-page';


const CACHE_KEY = 'index-page';
@Controller('/')
export class AppController {
	@Get('/')
	handlerIndex(@SsrPage({apiService: ApiService, pageKey: CACHE_KEY}) ssrPage: string) {
		return ssrPage;
	}

	@Get('/campus')
	handlerCampus(@SsrPage({apiService: ApiService, pageKey: CACHE_KEY}) ssrPage: string) {
		return ssrPage;
	}
}
