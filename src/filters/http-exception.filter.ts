import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
    LoggerService,
} from '@nestjs/common';
import {Response, Request} from 'express';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        /**
         * 只处理404的情况，其他错误使用nest默认
         */
        if (status === HttpStatus.NOT_FOUND) {
            response.redirect(`${process.env.PREFIX ?? ''}/404`);
        } else {
            this.logger.error(`错误状态码：${status}`);
            this.logger.error(`错误url：${request?.url}`);
            this.logger.error(exception);
            console.log(`错误状态码：${status}`);
            console.log(`错误url：${request?.url}`);
            console.log(exception);
            response.status(400).json({
                statusCode: 400,
                timestamp: new Date().toISOString(),
                message: '请求异常，请稍后重试~',
            });
            // throw exception;
        }
    }
}
