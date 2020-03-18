import {DirectoryEntry} from './DirectoryEntry';
import { fileState } from './Value';

export class DirectoryValues implements fileState{

    entries: DirectoryEntry[] = [];

    push(entry : DirectoryEntry){
        this.entries.push(entry);
    }

}