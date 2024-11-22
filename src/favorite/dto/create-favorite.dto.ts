import {  IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateFavoriteDto {
    @IsString()
    @MinLength(1)
    name: string;
    @IsNumber()    
    longitude: number;
    @IsNumber() 
    latitude: number;
    @IsString()
    @MinLength(1)
    @IsOptional()
    description: string;
    @IsString()
    @MinLength(1)
    address: string;
    
}
