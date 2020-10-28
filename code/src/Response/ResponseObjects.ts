export interface IResponse{

}

export class Success implements IResponse{

    getMessage(): string{
        return "Successful";
    }


}

export class Failure implements IResponse{

    message : string;

    constructor(message : string){
        this.message = message;
    }

    getMessage(): string{
        return "The request was not processed due to : " + this.message;
    }

}