import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin:function(requestOrigin, callback) {
       
        const whiteList = [process.env.FRONTEND_URL]

        const api = process.argv[2]
        if(api === '--api'){
            whiteList.push(undefined)
        }
        if(whiteList.includes(requestOrigin)){
            callback(null, true);
        }else{
            callback(new Error('errors CORS'));
        }
    },
}