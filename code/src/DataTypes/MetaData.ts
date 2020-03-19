import { Permissions } from "./Permissions";

export class MetaData{

    Users : string[] = [];
    Permissions : Map<string, Permissions> = new Map<string, Permissions>();;
    
    constructor(User : string, Permission : Permissions){
        this.Users.push(User);
        this.Permissions.set(User,Permission);
    }


}