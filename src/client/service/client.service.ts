/* eslint-disable */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseFilter } from 'src/filter.dto';
import { ClientDto } from 'src/client/dto/client.dto';
import { Client } from 'src/client/entities/client.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    // Récupérer les clients avec un filtre
    async findClients(filter: any): Promise<[ClientDto[], number]> {
        const options = parseFilter(filter);
        const clientsObjectsAndCount: any = await this.clientRepository.findAndCount(options);
        return await clientsObjectsAndCount;
    }

    // Trouver des clients en fonction du filtre
    async find(filter: any): Promise<[ClientDto[], number]> {
        const clientsObjectsAndCount: any = await this.clientRepository.findAndCount(filter);
        return await clientsObjectsAndCount;
    }

    // Créer un client
    async createClient(createClientDto: ClientDto) {
        const client = await this.clientRepository.create(createClientDto);
        let result = await this.clientRepository.save(client)
        .catch((e) => {
            if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
                throw new BadRequestException(
                    'Un compte avec cette adresse e-mail existe déjà.'
                );
            }
            return e;
        });
        return result;
    }

    // Mettre à jour un client par son ID
    async replaceById(id: any, updateClientDto: ClientDto) {
        const client = await this.clientRepository.findOne({ where: { id: +id } });
        if (!client) {
            throw new NotFoundException(`Client #${id} non trouvé !`);
        }
        const clientPreload: any = await this.clientRepository.preload({
            id: +id,
            ...updateClientDto,
        });
        let result = await this.clientRepository.save(clientPreload).catch((e) => {
            if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
                throw new BadRequestException(
                    'Un compte avec cette adresse e-mail existe déjà.'
                );
            }
            return e;
        });
        return result;
    }

    // Trouver un client par ID
    async findById(id: number): Promise<any> {
        return await this.clientRepository.findOne({
            where: { id: id }
        });
    }

    // Supprimer un client
    async remove(id: number) {
        return await this.clientRepository.delete(id);
    }

    // Trouver un client par email
    async findOne(email: string): Promise<any> {
        return await this.clientRepository.findOne({ where: { email: ILike(email) } });
    }

    async removeMultiple(toDelete: number[], toDisable: number[], idUser?: number) {
        let resultDelete: boolean | null = null;
        let resultDisable: boolean | null = null;

        if (toDelete.length != 0) {
            if (await this.clientRepository.delete(toDelete)) {
                resultDelete = true;
            } else {
                resultDelete = false;
            }
        }

        if (toDisable.length != 0) {
            if (await this.clientRepository.update(toDisable, { updatedBy: idUser, updatedAt: new Date(), active: false })) {
                resultDisable = true;
            } else {
                resultDisable = false;
            }
        }

        if (((toDelete.length != 0 && resultDelete == true) || (toDelete.length == 0 && resultDelete == null)) &&
            ((toDisable.length != 0 && resultDisable == true) || (toDisable.length == 0 && resultDisable == null))) {
            return true;
        } else {
            return false;
        }
    }
}
