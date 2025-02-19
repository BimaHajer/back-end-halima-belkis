/* eslint-disable */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseFilter } from 'src/filter.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findUsers(filter: any): Promise<[UserDto[], number]> {
    const options = parseFilter(filter);

    const usersObjectsAndCount: any = await this.userRepository.findAndCount(options);
    const userObjects: UserDto[] = [];
    const users = usersObjectsAndCount[0];
    for (const item of users) {
      const { token, saltRounds, password, ...result } = item;
      userObjects.push(result);
    }
    usersObjectsAndCount[0] = userObjects;
    return await usersObjectsAndCount;
  }

  async createUser(createUserDto: UserDto) {
    const bcrypt = require('bcrypt');
    const salt = 10;
    const saltRound = await bcrypt.genSalt(salt);
    const hash = await bcrypt.hash(createUserDto.password, saltRound);
    createUserDto.password = hash
    createUserDto.saltRounds = saltRound
    // createUserDto.createdBy = idUser
    const user = await this.userRepository.create(createUserDto);
    const { token, saltRounds, password, ...result } = await this.userRepository.save(user)
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

  async replaceById(id: any, updateUserDto: UserDto) {
    const user = await this.userRepository.findOne({where: {id: +id}})
    if (!user) {
      throw new NotFoundException(`User #${id} not found !`);
    }
    if (updateUserDto.password) {
      const bcrypt = require('bcrypt');
      const salt = 10;
      const saltRounds = await bcrypt.genSalt(salt);
      const hash = await bcrypt.hash(updateUserDto.password, saltRounds);
      const userDto = updateUserDto;
      userDto.password = hash
      userDto.saltRounds = saltRounds
      updateUserDto = userDto;
    }
    const userPreload:any = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
      // updatedBy: idUser,
    });
    const { token, saltRounds, password, ...result } = await this.userRepository.save(userPreload).catch((e) => {
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
    const user: any = await this.userRepository.findOne({
      where: { id: id }
    });
    const { token, saltRounds, password, ...result } = user;

    return result
  }

  async remove(id: string) {
    return await this.userRepository.delete(id)
  }

  async findOne(email: string): Promise<any> {
    return await this.userRepository.findOne({ where: { email: ILike(email) } });
  }

  async removeMultiple(toDelete: number[], toDisable: number[], idUser?: number) {
    let resultDelete: boolean | null = null
    let resultDisable: boolean | null = null
    if (toDelete.length != 0) {
      if (await this.userRepository.delete(toDelete)) {
        resultDelete = true
      } else
        resultDelete = false
    }
    if (toDisable.length != 0) {
      if (await this.userRepository.update(toDisable, { updatedBy: idUser, updatedAt: new Date(), active: false })) {
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
