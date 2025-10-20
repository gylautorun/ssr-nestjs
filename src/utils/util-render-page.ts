import type {Request, Response} from 'express';
import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {render} from 'ssr-core-react';
import {lruCache} from './util-lru-cache';

/**
 * @description csr的缓存不存在数据变动，从服务起的时候生成一次就无需再更改，类似于静态资源
 * 每个csr页面的结果都是一样的，类似于单页面应用打包生成的那个html文件
 */
let csrCache = '';

interface Ctx {
    request: Request;
    response: Response;
    apiService: unknown;
}

export async function renderCsrPage(ctx: Ctx) {
    // csr的代码类似于spa，不会发起fetch请求，不会获取远端数据，所以渲染一次后直接缓存起来
    if (!csrCache) {
        try {
            const htmlStr = await render(ctx, {
                mode: 'csr',
            });
            csrCache = htmlStr;
            return csrCache;
        }
        catch (error) {
            // 错误处理，后续添加500页面，此处错误的概率较小
            console.log(error);
            return '服务器开小差了，请稍后重试~';
        }
    }
    return csrCache;
}

export async function renderSsrPage(ctx: Ctx, pageKey: string) {
    const cache = lruCache.get(pageKey);
    // console.log('ssr render page', pageKey, cache);
    // ssr的缓存在，请直接返回
    if (cache && process.env.NODE_ENV === 'production') {
        return cache;
    }
    else {
        // ssr的缓存不在则进行生成ssr渲染
        try {
            // 字符串
            const htmlStr = await render(ctx, {});
            lruCache.set(pageKey, htmlStr);
            return htmlStr;
        }
        catch (error) {
            // 出现异常
            console.log(error);
            // 如果出现异常，进行兜底，改为csr模式,把csr的加入缓存，供以后csr使用
            if (!csrCache) {
                const csrHtmlStr = await renderCsrPage(ctx);
                csrCache = csrHtmlStr;
                return csrCache;
            } else {
                return csrCache;
            }
        }
    }
}

function transformCtx(ctx: ExecutionContext) {
    const res = ctx.switchToHttp().getResponse<Response>();
    const req = ctx.switchToHttp().getRequest<Request>();
    // 统一设置content-type
    res.setHeader?.('Content-type', 'text/html;charset=utf-8');
    return {
        request: req,
        response: res,
    };
}

interface CsrParam {
    apiService: unknown;
}
/**
 * @description 自定义装饰器
 */
export const CsrPage = createParamDecorator((
    {apiService}: CsrParam,
    ctx: ExecutionContext
) => {
    const transCtx = transformCtx(ctx);
    return renderCsrPage({
        ...transCtx,
        apiService,
    });
});


interface SsrParam {
    apiService: unknown;
    pageKey: string;
}
/**
 * @description 自定义装饰器
 */
export const SsrPage = createParamDecorator((
    {apiService, pageKey}: SsrParam,
    ctx: ExecutionContext
) => {
    const transCtx = transformCtx(ctx);
    return renderSsrPage({
        ...transCtx,
        apiService,
    }, pageKey);
});
