import {DirectoryEntry} from './DirectoryEntry';
import { fileState } from './Value';

export class DirectoryValues implements fileState{

    entries: DirectoryEntry[] = [];

    constructor(entry : DirectoryEntry){
        this.entries.push(entry);
    }

}