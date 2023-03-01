import { IsNumber, IsString } from "class-validator";
import { Album } from "src/album/schemas/album.schema";

export class CreateTrackDto {

    @IsString()
    name: string;

    @IsString()
    duration: string;

    @IsString()
    file: string;

    @IsString({each: true})
    genre: string[];

    @IsString({each: true})
    album: Album;

    @IsString()
    key: string;

    @IsNumber()
    bpm: number;

    
}
