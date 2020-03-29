import { Permissions } from "./Permissions";

export class MetaData{

    public Users : string[] = [];
    private UserPermissionsDir : Map<string, Permissions> = new Map<string, Permissions>();;
    
    public putUserPermission(User : string, Permission : Permissions){
        this.Users.push(User);
        this.UserPermissionsDir.set(User,Permission);
    }

    public getUserPermissions(user : string) : Permissions | undefined  {
        
        if(this.UserPermissionsDir.has(user)){
            return this.UserPermissionsDir.get(user);
        }
        else{
            return undefined;
        }
    } 

    public toString() : string {
        
        var resString : string = "\n";
        
        for (let i = 0; i < this.Users.length; i++) {
            const element = this.Users[i];
            
            var userPerm : Permissions = <Permissions> this.UserPermissionsDir.get(element);

            resString += "  User : " + element + ", Permission : "+ userPerm.getPermissionString() + "\n";
        }

        return resString;
    }
}