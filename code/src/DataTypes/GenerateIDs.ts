import { Guid } from "guid-typescript";

export abstract class GIDs{

    private id : Guid;

    constructor(id: Guid){
        this.id = id;
    }

    public toString() : string{
        return this.id.toString();
    }

    protected compairIDs(Guid1 : Guid, Guid2 : Guid ) : Boolean{
        if(Guid1["value"] == Guid2["value"]){
            return true;
        }
        else{
            return false;
        }
        
    };

    public getGuid() : Guid{
        return this.id;
    }

}