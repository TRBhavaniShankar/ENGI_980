import { LoginDT } from "../DataTypes/LoginDT";
import { resp } from "../DataTypes/responsesInterface";
import { Update } from "../DataTypes/Update";

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