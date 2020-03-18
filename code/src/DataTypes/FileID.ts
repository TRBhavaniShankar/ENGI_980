import { Guid } from "guid-typescript";
import { GIDs } from "./GenerateIDs";

export class FileID extends GIDs{

    private FID : Guid

    constructor(FID :Guid){
        super(FID);
        this.FID = FID;
    }
    /**
     * This function takes in a File ID and compairs with FIle ID of the present Object
     * @param compID : The File which has to be copaired with the other FIle ID
     */
    isEqual(compID : FileID) : Boolean{
        return this.compairIDs(compID.getGuid(), this.FID);
    }

}