import { SessionID } from "./SessionID"

export class UserAccount{

    private email: string;
    private password: string;
    private identifier: string;
    private sessionID: SessionID;
    private loginInStatus : Boolean;

    constructor(email: string, password: string, identifier: string, 
        sessionID: SessionID, loginInStatus : Boolean){

        this.email = email;
        this.password = password;
        this.identifier = identifier;
        this.sessionID = sessionID;
        this.loginInStatus = loginInStatus;

    }

    public getEmail() : string{
        return this.email;
    }

    public getPassword() : string{
        return this.password;
    }

    public getIdentifier() : string{
        return this.identifier;
    }

    public getsessionID() : SessionID{
        return this.sessionID;
    }

    public isLoggedIn() : Boolean{
        return this.loginInStatus;
    }

}
