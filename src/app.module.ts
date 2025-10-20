import {Module} from '@nestjs/common';
import {DetailModule} from './modules/detail-page/detail.module';
import {indexModule} from './modules/index-page/index.module';
import {ListModule} from './modules/list-page/list.module';
import {LifeModule} from './modules/life-page/life.module';
import {TrendModule} from './modules/trend/trend.module';
import {CenterModule} from './modules/center-page/center.module';
import {BatchModule} from './modules/batch-share/batch.module';
import {NotFoundModule} from './modules/404-page/404.module';

@Module({
	imports: [
		DetailModule,
        indexModule,
        ListModule,
        LifeModule,
        TrendModule,
        CenterModule,
        BatchModule,
        NotFoundModule,
	]
})
export class AppModule {}
