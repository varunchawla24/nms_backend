import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, Matches, IsBoolean } from "class-validator";
import { message } from '../message';

export class SaveTraining {
    @IsNotEmpty()
    @IsBoolean()
    is_taken: string;

    @IsNotEmpty()
    @IsNumberString()
    training_id: string;
}
