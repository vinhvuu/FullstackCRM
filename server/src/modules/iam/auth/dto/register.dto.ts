import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'Password must contain at least one uppercase letter and one number' })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, { message: 'Invalid phone format' })
  phone?: string;
}