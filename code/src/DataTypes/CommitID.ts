import { Guid } from "guid-typescript";
import { GIDs } from "./GenerateIDs";

export class CommitID extends GIDs{

    private CID : Guid

    constructor(CID :Guid){
        super(CID);
        this.CID = CID;
    }

    /**
     * This function takes in a CommitID and compairs with CommitID of the present Object
     * @param compID : The CommitID which has to be copaired with the other FIle ID
     */
    isEqual(compID : CommitID) : Boolean{
        return this.compairIDs(compID.getGuid(), this.CID);
    }

}