import {Controller, Get, Header, Param, Req, Res} from '@nestjs/common';
// import type {Request as ReqType, Response as ResType} from 'express';
import type { Request, Response } from 'express';
import { ApiDetailService } from './detail.service'
import { renderSsrPage } from '~/src/utils/util-render-page';

interface DetailParams {
    type: string;
    id: number;
}

@Controller('/')
export class DetailController {
	constructor(private readonly apiDeatilservice: ApiDetailService) {}

	@Get('/detail/:id')
	@Header(
		'Content-Type', 'text/html; charset=utf-8'
	)
	async handlerDetail(@Param() params: DetailParams, @Req() req: Request, @Res() res: Response) {
		const {type, id} = params;
        const PAGE_KEY = 'detail';
        const key = `${PAGE_KEY}${type ?? ''}${id ?? ''}`;
		const ssrPage = await renderSsrPage({
			request: req,
			response: res,
			apiService: ApiDetailService,
		}, key);
		return ssrPage;
	}
}
