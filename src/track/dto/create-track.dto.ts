import { IsNumber, IsString } from "class-validator";

export class CreateTrackDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    duration: string;

    @IsString()
    file: string;

    @IsString({each: true})
    genre: string[];

    @IsString()
    album: string;

    @IsString()
    key: string;

    @IsNumber()
    bpm: number;

    
}
