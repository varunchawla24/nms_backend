import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { constant } from 'src/constants';
import { message } from 'src/message';
import { SaveTraining } from './training.model';
import { TrainingService } from './training.service';

@Controller('training')
export class TrainingController {

    constructor(private trainingService: TrainingService){}

           /**
    *  get training list
    * paylod - get profile object
    */
            @Get('getTrainingList')
            async GetProfile(@Req() req, @Res() response: Response) {           // user login function
                try {
                 this.trainingService.GetTrainingService(req).then((TrainingList)=> {
                   console.log('serr',TrainingList);
                   return response.status(TrainingList['status']).send({
                       status: TrainingList['status'],
                       success: TrainingList['success'],
                       message: TrainingList['message'],
                       data: TrainingList['data']
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
    *  save user training
    * paylod - save training object
    */
                     @Post('saveUserTraining')
                     async SaveUserTraining(@Body() training: SaveTraining,@Req() req, @Res() response: Response) {           // user login function
                         try {
                          this.trainingService.SaveTrainingService(training,req).then((TrainingRes)=> {
                            console.log('serr',TrainingRes);
                            return response.status(TrainingRes['status']).send({
                                status: TrainingRes['status'],
                                success: TrainingRes['success'],
                                message: TrainingRes['message'],
                                data: TrainingRes['data']
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
