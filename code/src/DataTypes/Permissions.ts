export class Permissions{

    private permissions : string;

    constructor(permissions : string){
        this.permissions = permissions;
    }

    public getPermissionString() : string{
        return this.permissions
    }

}
