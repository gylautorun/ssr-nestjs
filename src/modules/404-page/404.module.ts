import { Module } from '@nestjs/common';
import { NotFoundController } from './404.controller';
import { Api404Service } from './404.service';

@Module({
  imports: [],
  controllers: [NotFoundController],
  providers: [Api404Service],
})
export class NotFoundModule {}
