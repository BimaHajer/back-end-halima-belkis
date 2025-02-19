import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseFilter } from 'src/filter.dto';
import { providerDto } from 'src/provider/dto/provider.dto';
import { provider } from 'src/provider/entities/provider.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(provider)
    private readonly providerRepository: Repository<provider>,
  ) {}
  
  async findProviders(filter: any): Promise<[providerDto[], number]> {
    const options = parseFilter(filter);
    const providersObjectsAndCount: any = await this.providerRepository.findAndCount(options);
    return await providersObjectsAndCount;
  }

  async find(filter: any): Promise<[[providerDto], number]> {
    const providersObjectsAndCount: any =
    await this.providerRepository.findAndCount(filter);
    return await providersObjectsAndCount;
  }
                
  async createProvider(createProviderDto: providerDto) {
    const provider= await this.providerRepository.create(createProviderDto);
    let result = await this.providerRepository.save(provider)
    .catch((e) => {
    if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
      throw new BadRequestException(
      ' Le compte avec cette adresse e-mail existe déjà.'
     );
     }
     return e
    })
    return result
 }
                
  async replaceById(id: any, updateProviderDto: providerDto) {
    const provider = await this.providerRepository.findOne({where: {id: +id}})
    if (!provider) {
      throw new NotFoundException(`provider #${id} not found !`);
    }
    const providerPreload:any = await this.providerRepository.preload({
      id: +id,
      ...updateProviderDto,
      // updatedBy: idProvider,
    });
    let result = await this.providerRepository.save(providerPreload).catch((e) => {
      if (/(email)[\s\S]+(already exists)/.test(e.detail)) {
        throw new BadRequestException(
          ' Le compte avec cette adresse e-mail existe déjà.'
        );
      }
      return e
    })
    return result
  }
                
  async findById(id: number): Promise<any> {
    return await this.providerRepository.findOne({
      where: { id: id }
    });
  }
                
  async remove(id: number) {
    return await this.providerRepository.delete(id)
  }
        
  async findOne(email: string): Promise<any> {
    return await this.providerRepository.findOne({ where: { email: ILike(email) } });
  }

  async removeMultiple(toDelete: number[], toDisable: number[], idProvider?: number) {
    let resultDelete: boolean | null = null
    let resultDisable: boolean | null = null
    if (toDelete.length != 0) {
      if (await this.providerRepository.delete(toDelete)) {
        resultDelete = true
      } else
      resultDelete = false
    }
    if (toDisable.length != 0) {
      if (await this.providerRepository.update(toDisable, { updatedBy: idProvider, updatedAt: new Date(), active: false })) {
        resultDisable = true
      } else
        resultDisable = false
      }
      if (((toDelete.length != 0 && resultDelete == true) || (toDelete.length == 0 && resultDelete == null)) &&
        ((toDisable.length != 0 && resultDisable == true) || (toDisable.length == 0 && resultDisable == null))) {
          return true
        } else
      return false
  }
}
