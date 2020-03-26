import { Guid } from "guid-typescript";
import { FileContent } from "./Content";
import { FileID } from "./FileID";

export class Change {
    
    fid: FileID;
    content: FileContent;

    constructor(fid: FileID, content: FileContent){
        this.fid = fid;
        this.content = content;
    }

    toString() : string{
        return this.fid.toString() + " " + this.content.toString();
    }

}
