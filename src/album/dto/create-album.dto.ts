import { IsString } from "class-validator";

export class CreateAlbumDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsString()
    release_date: string;

    @IsString({each: true})
    genre: string[];

    @IsString({each: true})
    artists: string[]; // сюда передаем идентификаторы артистов


}