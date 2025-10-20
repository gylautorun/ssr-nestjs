import { Controller, Get } from '@nestjs/common';
import { Api404Service } from './404.service';
import { CsrPage } from '~/src/utils/util-render-page';

@Controller('/')
export class NotFoundController {
  constructor(private readonly appService: Api404Service) {}
  
  @Get('/404')
  handler(@CsrPage({apiService: Api404Service}) csrPage: string) {
    return csrPage;
  }
}
