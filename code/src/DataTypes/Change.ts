import { FileID } from './FileID';
import { Content } from './Content';

export class Change {
    
    fid: FileID;
    content: Content;

    constructor(fid: FileID, content: Content){
        this.fid = fid;
        this.content = content;
    }

}