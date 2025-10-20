import { Controller, Get } from '@nestjs/common'
import { ApiService } from './index.service'
import { IndexData } from '~/typings/data'

@Controller('/api')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Get('/index')
	async getIndexData(): Promise<IndexData> {
		return await this.apiService.index()
	}
}
