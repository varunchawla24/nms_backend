import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CommonService } from '../util/common.service';
require('dotenv').config();
const jwt = require("jsonwebtoken");

@Injectable()
export class TokenAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): any | Promise<boolean> | Observable<any> {
        console.log("idhar aya",context['args'][0].headers)
        if (context['args'][0].url != '/api/v1/user/login' && context['args'][0].url != '/api/v1/user/verifyOtp') {
            var token = context['args'][0].headers["authorization"];
            console.log('token', token)
            if (token) {
                return true
            } else {
                return false
            }

        } else {
            return true
        }
    }

}

