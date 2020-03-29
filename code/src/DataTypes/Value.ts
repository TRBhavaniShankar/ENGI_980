import { DirectoryEntry } from "./DirectoryEntry";

export interface FileState {
    
    toString() : string;
    getValue() : DirectoryEntry[] | string;
}