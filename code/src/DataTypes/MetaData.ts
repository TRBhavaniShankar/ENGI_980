import { Permissions } from "./Permissions";

export class MetaData{

    public Users : string[] = [];
    private UserPermissionsDir : Map<string, Permissions> = new Map<string, Permissions>();;
    
    putUserPermission(User : string, Permission : Permissions){
        this.Users.push(User);
        this.UserPermissionsDir.set(User,Permission);
    }

    getUserPermissions(user : string) : Permissions | undefined  {
        
        if(this.UserPermissionsDir.has(user)){
            return this.UserPermissionsDir.get(user);
        }
        else{
            return undefined;
        }
    } 

}