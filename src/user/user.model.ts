import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, Matches, IsBoolean, IsOptional, IsEmpty } from "class-validator";
import { message } from '../message';

export class Login {
    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: message.invalidMobile })
    mobile: string;
}


export class Register {
    @IsNotEmpty()
    @Matches(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/, { message: message.invalidEmail })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: message.invalidFirstName })
    first_name: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: message.invalidLastName })
    last_name: string;

    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{8}$/, { message: message.invalidDistributorId })
    distributor_id: string;

    @IsNotEmpty()
    @IsNumberString()
    self_pv: string;

    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: message.invalidMobile })
    mobile: string;

    @IsNotEmpty()
    @IsNumberString()
    root_id: string

    @IsNotEmpty()
    @IsNumberString()
    parent_id: string


    @IsNotEmpty()
    @IsString()
    upline_name: string
}

export class send_otp {
    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: message.invalidMobile })
    mobile: string;
}


export class verify_otp {
    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: message.invalidMobile })
    mobile: string;

    @IsNotEmpty()
    @IsNumberString()
    otp: string;
}


export class active_downline {
    @IsNotEmpty()
    @IsNumberString()
    root_id: string;

    @IsNotEmpty()
    @IsNumberString()
    level: string;

    @IsOptional()
    @IsString()
    search: string

    @IsOptional()
    @IsNumberString()
    page_no: string

    @IsOptional()
    @IsNumberString()
    page_size: string
}

export class delete_downline {
    @IsNotEmpty()
    @IsNumberString()
    user_id: string;
}