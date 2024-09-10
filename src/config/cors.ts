import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin:function(requestOrigin, callback) {
        const whiteList = [process.env.FRONTEND_URL]
        if(whiteList.includes(requestOrigin)){
            callback(null, true);
        }else{
            callback(new Error('errors CORS'));
        }
    },
}