import {DirectoryEntry} from './DirectoryEntry';
import { Value } from './Value';

export class DirectoryValues implements Value{

    entries: DirectoryEntry[] = [];

    constructor(entry : DirectoryEntry){
        this.entries.push(entry);
    }

}