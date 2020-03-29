import {DirectoryEntry} from './DirectoryEntry';
import { FileState } from './Value';

export class DirectoryValues implements FileState{
    
    private entries: DirectoryEntry[] = [];

    public push(entry : DirectoryEntry){
        this.entries.push(entry);
    }

    public concatnate(entries: DirectoryEntry[]){
        this.entries.concat(entries);
    }

    public toString(): string {
        
        var ent : string = "\n  Files inside this Directory :";

        if (this.entries.length != 0) {
            ent += "\n   " + this.entries[0].toString();

            for (let i = 1; i < this.entries.length; i++) {
                const element = this.entries[i].toString();
    
                ent += ",\n   " + element;
            }
            ent += "\n";
        }else{
            ent += "\n   No files in this Directory ";
        }
       

        return ent;
    }

    public getValue(): DirectoryEntry[] {
        return this.entries; 
    }
}