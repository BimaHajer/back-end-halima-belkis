/* eslint-disable */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilterDto } from 'src/filter.dto';
import { ClientDto } from 'src/client/dto/client.dto';
import { ClientService } from 'src/client/service/client.service';

@Controller('clients')
@ApiTags('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    // Récupérer les clients avec filtres
    @Get('/')
    @ApiBearerAuth()
    @ApiQuery({ name: 'filter', type: 'object', schema: { $ref: getSchemaPath(FilterDto) } })
    find(@Query('filter') filter?: FilterDto<ClientDto>): Promise<[ClientDto[], number]> {
        return this.clientService.findClients(filter);
    }

    // Créer un nouveau client
    @Post('/')
    @ApiBearerAuth()
    async createClient(@Body() clientDto: ClientDto) {
        return this.clientService.createClient(clientDto);
    }

    // Mettre à jour un client par ID
    @Patch('/:id')
    @ApiBearerAuth()
    async replaceById(@Param('id') id: number, @Body() clientDto: ClientDto) {
        return this.clientService.replaceById(id, clientDto);
    }

    @Get('/:id')
    @ApiBearerAuth()
    findById(@Param('id') id: number) {
        return this.clientService.findById(id);
    }

    @Delete('/:id')
    @ApiBearerAuth()
    remove(@Param('id') id: number) {
        return this.clientService.remove(id);
    }

    @Post('/deleteMultipleClients')
    @ApiBearerAuth()
    removeMultiple(@Body() tab: any) {
        return this.clientService.removeMultiple(tab[0], tab[1]);
    }
}
