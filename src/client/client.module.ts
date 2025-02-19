/* eslint-disable */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './service/client.service';
import { ClientController } from './controller/client.controller';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, TypeOrmModule.forFeature([Client])],
})
export class ClientModule {}
