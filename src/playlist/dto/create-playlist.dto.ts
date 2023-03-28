import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

import { PlaylistSource } from "../schemas/playlist.schema";

export class CreatePlaylistDto {
    
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsEnum(PlaylistSource)
    source: PlaylistSource; // поле, определяющее источник создания плейлиста

    @IsString({each: true})
    tracks: string[];

    @IsString()
    @IsOptional()
    owner?: string; // необязательное поле, определяющее владельца плейлиста, если source = user

}
