require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CommonService } from '../util/common.service';
const jwt = require("jsonwebtoken");
const pool = require("../database");
import { message, mapping } from '../message'
import { constant } from '../constants';
import { Middleware } from '../middleware';


@Injectable()
export class TrainingService {

    constructor(
        private httpService: HttpService,
        private commonService: CommonService,
        private middleware: Middleware
    ) { }




    /**
   *  Get Trainings list
   * @param user 
   * @param req 
   * @returns 
   */
    GetTrainingService(req) {   // get training service
        return new Promise(async (resolve, reject) => {
            const token = req.headers['authorization'];
            var middlewareRes = await this.middleware.checkJwtUser(token);
            console.log('middleware', middlewareRes)
            if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                resolve(middlewareRes);
            } else {
                pool.getConnection((err, connection) => {
                    if (err) throw err; // not connected!

                    // Use the connection
                    connection.query('Call get_trainings(?)',[middlewareRes["data"].user_id], async (error, results, fields) => {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) reject(error);
                             console.log('res',results)
                        // Don't use the connection here, it has been returned to the pool.
                        if (results[0].length > 0) {
                            var res = this.commonService.responseService(constant.success, "true", message.training_list, results[0])
                            resolve(res);
                        } else {
                            var res = this.commonService.responseService(constant.badRequest, "false", message.noRecordFound, {})
                            resolve(res)
                        }
                    });
                });
            }

        })

    }
 /**
   *  save user training
   * @param user 
   * @param req 
   * @returns 
   */
  SaveTrainingService(training,req) {   // save training service
    return new Promise(async (resolve, reject) => {
        const token = req.headers['authorization'];
        var middlewareRes = await this.middleware.checkJwtUser(token);
        console.log('middleware', middlewareRes)
        if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
            resolve(middlewareRes);
        } else {
            pool.getConnection((err, connection) => {
                if (err) throw err; // not connected!

                // Use the connection
                connection.query('Call save_user_training(?,?,?)', [middlewareRes["data"].user_id,training.training_id, training.is_taken],async (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (error) reject(error);
                         console.log('res',results)
                    // Don't use the connection here, it has been returned to the pool.
                    if (results) {
                        var res = this.commonService.responseService(constant.success, "true", training.is_taken==true ? message.training_save :message.training_not_taken, {})
                        resolve(res);
                    } else {
                        var res = this.commonService.responseService(constant.badRequest, "false", message.noRecordFound, {})
                        resolve(res)
                    }
                });
            });
        }

    })

}

}