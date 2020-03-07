export class ResponseDT{

    status: string; 
    message: string;
    className : string;
    object : object;

    constructor(status: string, message: string, className: string, object: object){
        this.status = status;
        this.message = message;
        this.className = className;
        this.object = object
    }

    getResponse(): [string, string, string, object]{

        return [this.status, this.message, this.className, this.object];

    }
}