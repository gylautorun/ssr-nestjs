import {createLogger, format, transports} from 'winston';

// NODE_ENV是判断是开发还是部署，__CLIENT_ENV__是判断测试还是生产，这里测试环境也需要日志
const isProd = process.env.NODE_ENV === 'production';
export const logger = createLogger({
    transports: isProd ? [
        new transports.File({
            filename: '/home/work/logs/http.log',
            level: 'verbose',
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.align(),
                format.printf(info =>
                    `[${info.level}] [${info.timestamp as string}] ${info.message as string}`),
                format.padLevels()
            ),
        }),
    ] : [],
    rejectionHandlers: isProd ? [
        new transports.File({filename: '/home/work/logs/rejections.log'}),
    ] : [],
});
