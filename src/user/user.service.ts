require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CommonService } from 'src/util/common.service';
const jwt = require("jsonwebtoken");
const pool = require("../database");
import { message, mapping } from '../message'
import { constant } from 'src/constants';
import { Middleware } from 'src/middleware';
import { active_downline } from './user.model';


@Injectable()
export class UserService {

    constructor(
        private httpService: HttpService,
        private commonService: CommonService,
        private middleware: Middleware
    ) { }


    async registerService(user, req) {   //register service
        return new Promise(async (resolve, reject) => {
            const token = req.headers['authorization'];
            var middlewareRes = await this.middleware.checkJwtUser(token);
            console.log('middleware',middlewareRes)
            if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                resolve(middlewareRes);
            } else {
                pool.getConnection((err, connection) => {
                    if (err) throw err; // not connected!

                    // Use the connection
                    connection.query('Call register_user(?,?,?,?,?,?,?,?,?)', [user.email,user.first_name,user.last_name,user.distributor_id,user.root_id,middlewareRes["data"].user_id,user.mobile,user.self_pv,user.upline_name], async (error, results, fields) => {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) reject(error);

                        // Don't use the connection here, it has been returned to the pool.
                        if (results[0].length > 0) {
                            console.log('mapping', results[0])
                            if (mapping[results[0][0].message]) {
                                var res = this.commonService.responseService(constant.success, "true", message[results[0][0].message], {})
                                resolve(res)
                            } else {
                                var res = this.commonService.responseService(constant.badRequest, "false", message[results[0][0].message], {})
                                resolve(res)
                            }
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
     *  login service function
     * @param user 
     * @param req 
     * @returns 
     */
    loginService(user, req) {   //login service
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) throw err; // not connected!

                // Use the connection
                connection.query('Call login(?)', [user.mobile], async (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (error) reject(error);

                    // Don't use the connection here, it has been returned to the pool.
                    if (results[0].length > 0) {
                        console.log('mapping', results[0])
                        if (mapping[results[0][0].message]) {
                            var otp = await this.commonService.sendOtp();
                            this.sendOtp(user.mobile, otp).then((otpRes) => {
                                resolve(otpRes)
                            }, (err) => {
                                reject(err)
                            })
                        } else {
                            var res = this.commonService.responseService(constant.badRequest, "false", message[results[0][0].message], {})
                            resolve(res)
                        }
                    } else {
                        var res = this.commonService.responseService(constant.badRequest, "false", message.noRecordFound, {})
                        resolve(res)
                    }
                });
            });
        })

    }
    /**
     * send otp function
     * @param mobile 
     * @param otp 
     * @returns 
     */
    sendOtp(mobile, otp) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) throw err; // not connected!

                // Use the connection
                connection.query('Call send_otp(?,?)', [mobile, otp], (error, results, fields) => {
                    console.log('dss', error)
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (error) reject(error);
                    console.log(results)
                    // Don't use the connection here, it has been returned to the pool.
                    if (results[0].length > 0) {
                        console.log('mapping', results[0])
                        if (mapping[results[0][0].message]) {
                            var res = this.commonService.responseService(constant.success, "true", message[results[0][0].message], {})
                            resolve(res)
                        } else {
                            var res = this.commonService.responseService(constant.badRequest, "false", message[results[0][0].message], {})
                            resolve(res)
                        }
                    } else {
                        var res = this.commonService.responseService(constant.badRequest, "false", message.noRecordFound, {})
                        resolve(res)
                    }
                });
            });
        })

    }
    /**
     * verify otp service
     * @param user 
     * @param req 
     * @returns 
     */
    verifyOtpService(user, req) {   //verify otp service
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) throw err; // not connected!

                // Use the connection
                connection.query('Call verify_otp(?,?)', [user.mobile, user.otp], async (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release();

                    // Handle error after the release.
                    if (error) reject(error);

                    // Don't use the connection here, it has been returned to the pool.
                    if (results[0].length > 0) {
                        console.log('mapping', results[0])
                        if (mapping[results[0][0].message]) {

                            const paylod = {
                                user_id: results[0][0].user_id,
                                email: results[0][0].email,
                                mobile: user.mobile
                            }
                            var token = await this.commonService.createJwtToken(paylod)
                            var data = {
                                user_id: results[0][0].user_id,
                                access_token: token
                            }
                            var res = this.commonService.responseService(constant.success, "true", message[results[0][0].message], data)
                            resolve(res);
                        } else {
                            var res = this.commonService.responseService(constant.badRequest, "false", message[results[0][0].message], {})
                            resolve(res)
                        }
                    } else {
                        var res = this.commonService.responseService(constant.badRequest, "false", message.noRecordFound, {})
                        resolve(res)
                    }
                });
            });
        })

    }

    /**
   *  Get Profile
   * @param user 
   * @param req 
   * @returns 
   */
    GetProfileService(req) {   //verify otp service
        return new Promise(async (resolve, reject) => {
            const token = req.headers['authorization'];
            var middlewareRes = await this.middleware.checkJwtUser(token);
            console.log('middleware',middlewareRes)
            if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                resolve(middlewareRes);
            } else {
                pool.getConnection((err, connection) => {
                    if (err) throw err; // not connected!

                    // Use the connection
                    connection.query('Call get_profile(?)', [middlewareRes["data"].user_id], async (error, results, fields) => {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) reject(error);

                        // Don't use the connection here, it has been returned to the pool.
                        if (results[0].length > 0) {
                            var res = this.commonService.responseService(constant.success, "true", message.profile_fetch, results[0][0])
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
   *  Get pending downlines
   * @param user 
   * @param req 
   * @returns 
   */
         GetPendingDownlines(req) {   // get pending downlines
            return new Promise(async (resolve, reject) => {
                const token = req.headers['authorization'];
                var middlewareRes = await this.middleware.checkJwtUser(token);
                console.log('middleware',middlewareRes)
                if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                    resolve(middlewareRes);
                } else {
                    pool.getConnection((err, connection) => {
                        if (err) throw err; // not connected!
    
                        // Use the connection
                        connection.query('Call pending_Downline(?)', [middlewareRes["data"].user_id], async (error, results, fields) => {
                            // When done with the connection, release it.
                            connection.release();
    
                            // Handle error after the release.
                            if (error) reject(error);
    
                            // Don't use the connection here, it has been returned to the pool.
                            if (results[0].length > 0) {
                                var res = this.commonService.responseService(constant.success, "true", message.pending_downline_fetch, results[0])
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
   *  Get active downlines
   * @param user 
   * @param req 
   * @returns 
   */
               GetActiveDownlines(body,req) {   // get active downlines
                return new Promise(async (resolve, reject) => {
                    const token = req.headers['authorization'];
                    var middlewareRes = await this.middleware.checkJwtUser(token);
                    console.log('middleware',middlewareRes)
                    if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                        resolve(middlewareRes);
                    } else {
                          let skip = body.page_no * body.page_size
                          let pageSize = body.page_size
                        pool.getConnection((err, connection) => {
                            if (err) throw err; // not connected!
        
                            // Use the connection
                            connection.query('Call get_user_downline_list(?,?,?,?,?,?)', [body.root_id,middlewareRes["data"].user_id, body.level,body.search ? body.search : '', body.page_no ? skip : 0, body.page_size ? pageSize : 10], async (error, results, fields) => {
                                // When done with the connection, release it.
                                connection.release();
        
                                // Handle error after the release.
                                if (error) reject(error);
                                // Don't use the connection here, it has been returned to the pool.
                                if (results[0].length > 0) {
                                    var res = this.commonService.responseService(constant.success, "true", message.active_downline_fetch, results[0])
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
   * delete pending downline
   * @param user 
   * @param req 
   * @returns 
   */
               DeletePendingDownlines(body,req) {   // delete pending downline
                return new Promise(async (resolve, reject) => {
                    const token = req.headers['authorization'];
                    var middlewareRes = await this.middleware.checkJwtUser(token);
                    console.log('middleware',middlewareRes)
                    if ((middlewareRes["message"] == message.unauthorized) || (middlewareRes["message"] == message.you_get_blocked) || (middlewareRes["message"] == message.user_not_exist)) {
                        resolve(middlewareRes);
                    } else {
                        pool.getConnection((err, connection) => {
                            if (err) throw err; // not connected!
        
                            // Use the connection
                            connection.query('Call delete_pending_user(?)', [body.user_id], async (error, results, fields) => {
                                // When done with the connection, release it.
                                connection.release();
        
                                // Handle error after the release.
                                if (error) reject(error);
                                // Don't use the connection here, it has been returned to the pool.
                                console.log('results',results);
                                if (results) {
                                    var res = this.commonService.responseService(constant.success, "true", message.deleted_success, {})
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