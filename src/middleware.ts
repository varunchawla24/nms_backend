import { Injectable } from "@nestjs/common";
import { CommonService } from "./util/common.service";
import { constant } from "./constants";
import { message } from "./message";
@Injectable()
export class Middleware {
    constructor(private commonService: CommonService){

    }
    async checkJwtUser(token){
        try {
            var user_data:any = await this.commonService.decodeJwtToken(token);
            console.log('userr',user_data)
             if(user_data["paylod"].user_id) {
                var check_user_exist = await this.commonService.checkUserExist(user_data["paylod"].user_id);
                return check_user_exist
             } else{
               return this.commonService.responseService(constant.unauthorised,false,message.unauthorized,{})
             }
        } catch(ex){
            return this.commonService.responseService(constant.unauthorised,false,message.unauthorized,{})
        }
     
   }
 
}