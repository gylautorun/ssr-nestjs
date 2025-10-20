import {Controller, Get, Query, Header, Res, Req} from '@nestjs/common';
import type {Request as ReqType, Response as ResType} from 'express';
import {ListService} from './list.service';
import { renderSsrPage } from '~/src/utils/util-render-page';

enum RecruitType {
    GRADUATE = 'GRADUATE',
    INTERN = 'INTERN',
    SOCIAL = 'SOCIAL',
}
interface ListQuery {
    recruitType?: RecruitType;

    search?: string;
    projectType?: string;
}
@Controller('/')
export class ListController {
    // 校招、实习生列表页
    @Get('/list')
    @Header(
        'Content-Type', 'text/html; charset=utf-8'
    )
    async handlerList(@Query() query: ListQuery, @Req() req: ReqType, @Res({passthrough: true}) res: ResType) {
        const {recruitType, search, projectType} = query;
        const PAGE_KEY = 'campus-list';
        const key = `${PAGE_KEY}${recruitType ?? ''}${search ?? ''}${projectType ?? ''}`;
        const ssrPage = await renderSsrPage({
            request: req,
            response: res,
            apiService: ListService,
        }, key);
        return ssrPage;
    }


    // 社招页
    @Get('/social-list')
    @Header(
        'Content-Type', 'text/html; charset=utf-8'
    )
    async handlerSocialList(@Query() query: ListQuery, @Req() req: ReqType, @Res({passthrough: true}) res: ResType) {
        const {recruitType, search, projectType} = query;
        const PAGE_KEY = 'social-list';
        const key = `${PAGE_KEY}${recruitType ?? ''}${search ?? ''}${projectType ?? ''}`;
        const ssrPage = await renderSsrPage({
            request: req,
            response: res,
            apiService: ListService,
        }, key);
        return ssrPage;
    }
}
