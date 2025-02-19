import { IsString, IsEmail } from 'class-validator';

export class providerDto {  
  @IsString()
  readonly firstName: string; 

  @IsString()
  readonly lastName: string; 

  @IsEmail() 
  readonly email: string;

}