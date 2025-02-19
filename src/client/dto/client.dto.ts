/* eslint-disable */
import { IsString, IsEmail } from 'class-validator';

export class ClientDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly zipCode: string;
}
