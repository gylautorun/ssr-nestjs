import {join} from 'path';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
// import {rateLimit} from 'express-rate-limit';
import {NestExpressApplication} from '@nestjs/platform-express';
import {initialSSRDevProxy, loadConfig, getCwd} from 'ssr-server-utils';
import {enableStaticRendering} from 'mobx-react';
import {HttpExceptionFilter} from './filters/http-exception.filter';
import {AppModule} from './app.module';
import {normalizePath} from './utils/util-normalize-path';
import {logger} from './utils/util-logs';

enableStaticRendering(true);


async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule); // 创建实例

    // helmet防web漏洞
    app.use(helmet({
        // 关于csp的配置参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
            directives: {
                defaultSrc: ['\'self\'', '*.xxx.com', '*.yyy.com'],
                styleSrc: ['\'self\'', '*.xxx.com', '\'unsafe-inline\'', 'http:'],
                scriptSrc: ['\'self\'', '*.xxx.com', '\'unsafe-inline\'', 'http:'],
                // 添加data协议，部分图片会被转成base64
                imgSrc: ['\'self\'', '*.xxx.com', '*.yyy.com', 'data:'],
                // 关闭自动升级https，在本地需要http，在测试或生产环境本身是https,也无需升级
                upgradeInsecureRequests: null,
            },
        } : false,
        // 关闭跨域资源策略
        crossOriginResourcePolicy: {
            policy: 'cross-origin',
        },
        // 关闭coep
        crossOriginEmbedderPolicy: false,
        // referer的限制需要关闭，后端会校验referer
        referrerPolicy: false,
    }));
    // 暂时不对应用做请求速率限制
    // app.use(rateLimit({
    //     windowMs: 15 * 60 * 1000,
    //     max: 100,
    //     message: 'sss',
    // }));
    app.setGlobalPrefix(normalizePath(process.env.PREFIX));
    if (process.env.__CLIENT_ENV__ !== 'production') {
        await initialSSRDevProxy(app, {
            express: true,
        });
    }
    app.useGlobalFilters(new HttpExceptionFilter(logger));

    app.useStaticAssets(join(getCwd(), './build'))
	app.useStaticAssets(join(getCwd(), './public'), {
        prefix: process.env.PREFIX, // 静态资源前缀
    })
	app.useStaticAssets(join(getCwd(), './build/client'))
	// app.useStaticAssets(join(getCwd(), './public'))

    const {serverPort} = loadConfig();
    await app.listen(serverPort); // 启动服务, 监听端口
    console.log(`server running on ${serverPort}`);
}

bootstrap().catch(err => {
    console.log(err);
    process.exit(1);
});