import { Guid } from "guid-typescript";
import { FileContent } from "./Content";

export class Change {
    
    fid: Guid;
    content: FileContent;

    constructor(fid: Guid, content: FileContent){
        this.fid = fid;
        this.content = content;
    }

    toString() : string{
        return "";
    }

}