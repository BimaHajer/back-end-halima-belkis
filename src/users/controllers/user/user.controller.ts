/* eslint-disable */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FilterDto } from 'src/filter.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UserService } from 'src/users/services/user/user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiBearerAuth()
  @ApiQuery({ name: 'filter', type: 'object', schema: { $ref: getSchemaPath(FilterDto) } })
  find(@Query('filter') filter?: FilterDto<UserDto>): Promise<[UserDto[], number]> {
    return this.userService.findUsers(filter);
  }

  @Post('/')
  @ApiBearerAuth()
  async createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }
  
  @Patch('/:id')
  @ApiBearerAuth()
  async replaceById(@Param('id') id: number, @Body() userDto: UserDto) {
    return this.userService.replaceById(id, userDto);
  }

  @Get('/:id')
  @ApiBearerAuth()
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('/deleteMultipleUser')
  @ApiBearerAuth()
  removeMultiple(@Body() tab: any) {
    return this.userService.removeMultiple(tab[0], tab[1]);
  }


}
