export class Permissions{

    private permissions : string;

    constructor(permissions : string){
        this.permissions = permissions;
    }

    getPermissionString() : string{
        return this.permissions
    }

}
