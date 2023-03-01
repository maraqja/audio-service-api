import { IsString } from "class-validator";

export class CreateArtistDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsString({each: true})
    genre: string[];

}