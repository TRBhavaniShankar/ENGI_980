import { Guid } from "guid-typescript";
import { FileContent } from "./Content";
import { FileID } from "./FileID";

export class Change {
    
    private fid: FileID;
    private content: FileContent;

    constructor(fid: FileID, content: FileContent){
        this.fid = fid;
        this.content = content;
    }

    public getFileID() : FileID{
        return this.fid;
    }

    public getContent() : FileContent{
        return this.content;
    }

    public toString() : string{
        return "File ID : " + this.fid.toString() + " , \n" + "File Content : \n" + this.content.toString() + "\n";
    }

}
