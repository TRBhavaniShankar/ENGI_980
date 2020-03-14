import { LoginDT } from "./LoginDT";
import { resp } from "./responsesInterface";
import { Update } from "./Update";

export class ResponseDT<Obj>{

    status: Number; 
    message: string;
    className : string;
    object : Obj

    constructor(status: Number, message: string, className: string, object: Obj){
        this.status = status;
        this.message = message;
        this.className = className;
        this.object = object
    }
}