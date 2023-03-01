import { IsString } from "class-validator";

export class UserPreferencesDto {

    @IsString({each: true})
    genre: string[];

    @IsString({each: true})
    artist: string[];

}
