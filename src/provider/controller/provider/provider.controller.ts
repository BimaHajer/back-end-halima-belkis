import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilterDto } from 'src/filter.dto';
import { providerDto } from 'src/provider/dto/provider.dto';
import { ProviderService } from 'src/provider/service/provider/provider.service';


@Controller('providers')
@ApiTags('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}
  @Get('/')
  @ApiBearerAuth()
  @ApiQuery({ name: 'filter', type: 'object', schema: { $ref: getSchemaPath(FilterDto) } })
  find(@Query('filter') filter?: FilterDto<providerDto>): Promise<[providerDto[], number]> {
    return this.providerService.findProviders(filter);
  }
  @Post('/')
  @ApiBearerAuth()
  async createProvider(@Body() providerDto: providerDto) {
    return this.providerService.createProvider(providerDto);
  }
  @Patch('/:id')
  @ApiBearerAuth()
  async replaceById(@Param('id') id: number, @Body() providerDto: providerDto) {
    return this.providerService.replaceById(id, providerDto);
  }
  @Get('/:id')
  @ApiBearerAuth()
  findById(@Param('id') id: number) {
    return this.providerService.findById(id);
  }
  @Delete('/:id')
  @ApiBearerAuth()
  remove(@Param('id') id: number) {
    return this.providerService.remove(id);
  }
  @Post('/deleteMultipleProvider')
  @ApiBearerAuth()
  removeMultiple(@Body() tab: any) {
    return this.providerService.removeMultiple(tab[0], tab[1]);
  }
}
