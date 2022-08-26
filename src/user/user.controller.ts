import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { constant } from 'src/constants';
import { message } from 'src/message';
import { active_downline, delete_downline, Login, Register, verify_otp } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    /**
    * register the user
    * paylod - register object
    */
    @Post('register')
    async Register(@Body() user: Register, @Req() req, @Res() response: Response) {           // user Register function
        try {
            this.userService.registerService(user, req).then((registerService)=> {
              console.log('serr',registerService);
              return response.status(registerService['status']).send({
                  status: registerService['status'],
                  success: registerService['success'],
                  message: registerService['message'],
                  data: registerService['data']
              })
            }).catch((err)=> {
              return response.status(constant.internalServerError).send({
                  status: constant.internalServerError,
                  success: false,
                  message: message.exceptionOccured,
                  data: err
              })
            })
          
           } catch (ex) {
              console.log('ecdc',ex)
              return response.status(constant.internalServerError).send({
                  status: constant.internalServerError,
                  success: false,
                  message: message.exceptionOccured,
                  data: {}
              })
           }
    }

    /**
    * login the user
    * paylod - register object
    */
         @Post('login')
         async Login(@Body() user: Login, @Req() req, @Res() response: Response) {           // user login function
             try {
              this.userService.loginService(user, req).then((loginService)=> {
                console.log('serr',loginService);
                return response.status(loginService['status']).send({
                    status: loginService['status'],
                    success: loginService['success'],
                    message: loginService['message'],
                    data: loginService['data']
                })
              }).catch((err)=> {
                return response.status(constant.internalServerError).send({
                    status: constant.internalServerError,
                    success: false,
                    message: message.exceptionOccured,
                    data: err
                })
              })
            
             } catch (ex) {
                console.log('ecdc',ex)
                return response.status(constant.internalServerError).send({
                    status: constant.internalServerError,
                    success: false,
                    message: message.exceptionOccured,
                    data: {}
                })
             }
         }

           /**
    * verify otp
    * paylod - register object
    */
            @Post('verifyOtp')
            async VerifyOtp(@Body() user: verify_otp, @Req() req, @Res() response: Response) {           // user login function
                try {
                 this.userService.verifyOtpService(user, req).then((verifyOtp)=> {
                   console.log('serr',verifyOtp);
                   return response.status(verifyOtp['status']).send({
                       status: verifyOtp['status'],
                       success: verifyOtp['success'],
                       message: verifyOtp['message'],
                       data: verifyOtp['data']
                   })
                 }).catch((err)=> {
                   return response.status(constant.internalServerError).send({
                       status: constant.internalServerError,
                       success: false,
                       message: message.exceptionOccured,
                       data: err
                   })
                 })
               
                } catch (ex) {
                   console.log('ecdc',ex)
                   return response.status(constant.internalServerError).send({
                       status: constant.internalServerError,
                       success: false,
                       message: message.exceptionOccured,
                       data: {}
                   })
                }
            }

         /**
    *  get profile
    * paylod - get profile object
    */
          @Get('getProfile')
          async GetProfile(@Req() req, @Res() response: Response) {           // user login function
              try {
               this.userService.GetProfileService(req).then((GetProfile)=> {
                 console.log('serr',GetProfile);
                 return response.status(GetProfile['status']).send({
                     status: GetProfile['status'],
                     success: GetProfile['success'],
                     message: GetProfile['message'],
                     data: GetProfile['data']
                 })
               }).catch((err)=> {
                 return response.status(constant.internalServerError).send({
                     status: constant.internalServerError,
                     success: false,
                     message: message.exceptionOccured,
                     data: err
                 })
               })
             
              } catch (ex) {
                 console.log('ecdc',ex)
                 return response.status(constant.internalServerError).send({
                     status: constant.internalServerError,
                     success: false,
                     message: message.exceptionOccured,
                     data: {}
                 })
              }
          }

    /**
    *  get pending downline
    * paylod - get profile object
    */
            @Get('pendingDownlines')
            async GetPendingDownlines(@Req() req, @Res() response: Response) {           // user login function
                try {
                 this.userService.GetPendingDownlines(req).then((pendingDownline)=> {
                   console.log('serr',pendingDownline);
                   return response.status(pendingDownline['status']).send({
                       status: pendingDownline['status'],
                       success: pendingDownline['success'],
                       message: pendingDownline['message'],
                       data: pendingDownline['data']
                   })
                 }).catch((err)=> {
                   return response.status(constant.internalServerError).send({
                       status: constant.internalServerError,
                       success: false,
                       message: message.exceptionOccured,
                       data: err
                   })
                 })
               
                } catch (ex) {
                   console.log('ecdc',ex)
                   return response.status(constant.internalServerError).send({
                       status: constant.internalServerError,
                       success: false,
                       message: message.exceptionOccured,
                       data: {}
                   })
                }
            }

    /**
    *  get pending downline
    * paylod - get profile object
    */
      @Post('downlineList')
      async GetDownlineList(@Body() downline: active_downline, @Req() req, @Res() response: Response) {           // user login function
          try {
           this.userService.GetActiveDownlines(downline,req).then((activeDownline)=> {
             console.log('serr',activeDownline);
             return response.status(activeDownline['status']).send({
                 status: activeDownline['status'],
                 success: activeDownline['success'],
                 message: activeDownline['message'],
                 data: activeDownline['data']
             })
           }).catch((err)=> {
             return response.status(constant.internalServerError).send({
                 status: constant.internalServerError,
                 success: false,
                 message: message.exceptionOccured,
                 data: err
             })
           })
         
          } catch (ex) {
             console.log('ecdc',ex)
             return response.status(constant.internalServerError).send({
                 status: constant.internalServerError,
                 success: false,
                 message: message.exceptionOccured,
                 data: {}
             })
          }
      }

    /**
    * delete pending downline
    * paylod - delete downline object
    */
           @Post('deletePendingDownline')
           async DeletePendingDownline(@Body() downline: delete_downline, @Req() req, @Res() response: Response) {           // user login function
               try {
                this.userService.DeletePendingDownlines(downline,req).then((deleteDownline)=> {
                  console.log('serr',deleteDownline);
                  return response.status(deleteDownline['status']).send({
                      status: deleteDownline['status'],
                      success: deleteDownline['success'],
                      message: deleteDownline['message'],
                      data: deleteDownline['data']
                  })
                }).catch((err)=> {
                  return response.status(constant.internalServerError).send({
                      status: constant.internalServerError,
                      success: false,
                      message: message.exceptionOccured,
                      data: err
                  })
                })
              
               } catch (ex) {
                  console.log('ecdc',ex)
                  return response.status(constant.internalServerError).send({
                      status: constant.internalServerError,
                      success: false,
                      message: message.exceptionOccured,
                      data: {}
                  })
               }
           }
}
