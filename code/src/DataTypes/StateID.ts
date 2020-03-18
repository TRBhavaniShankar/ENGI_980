import { Guid } from "guid-typescript";
import { GIDs } from "./GenerateIDs";

export class StateID extends GIDs{

    private StateID : Guid

    constructor(StateID :Guid){
        super(StateID);
        this.StateID = StateID;
    }

    /**
     * This function takes in a StateID and compairs with StateID of the present Object
     * @param compID : The StateID which has to be copaired with the other FIle ID
     */
    isEqual(compID : StateID) : Boolean{
        return this.compairIDs(compID.getGuid(), this.StateID);
    }

}