import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
const jwt = require("jsonwebtoken");
import { config } from '../config';
const pool = require("../database");
import { message, mapping } from '../message'
import { constant } from '../constants';
@Injectable()
export class CommonService {

    constructor(
        private httpService: HttpService,
    ) { }

    async responseService(status, success, message, data, jwt?) {
        var response = {};
        if (jwt) {
            response = {
                "status": status ? status : '',
                "success": success ? success : '',
                "message": message ? message : '',
                "data": data ? data : '',
                "access_token": jwt ? jwt : ''
            }
        } else {
            response = {
                "status": status ? status : '',
                "success": success ? success : '',
                "message": message ? message : '',
                "data": data ? data : ''
            }
        }

        return response
    }


    async sendOtp() {

        let otp = 1234;

        return otp;

    }
    async createJwtToken(paylod) {
        var token = jwt.sign({ paylod }, config.jwt_secret_key, { expiresIn: config.jwt_expiry });
        return token
    }

    async decodeJwtToken(token) {
        try {
            var decodedData = jwt.verify(token, config.jwt_secret_key);
            return decodedData;
        } catch (err) {
            return err
        }

    }

    async checkUserExist(user_id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) throw err; // not connected!

                // Use the connection
                connection.query('Call check_user_exist(?)', [user_id], async (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (error) reject(error);

                    // Don't use the connection here, it has been returned to the pool.
                    console.log('results',results)
                    if (results[0].length > 0) {
                        console.log('mapping', results[0])
                        if (mapping[results[0][0].message]) {
                            var res = this.responseService(constant.success, "true", message[results[0][0].message], {user_id:user_id})
                            resolve(res);
                        } else {
                            var res = this.responseService(constant.badRequest, "false", message[results[0][0].message], {})
                            resolve(res)
                        }
                    } else {
                        var res = this.responseService(constant.badRequest, "false", message.noRecordFound, {})
                        resolve(res)
                    }
                });
            });
        })

    }

}

