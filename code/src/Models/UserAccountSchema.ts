import mongoose from "mongoose";
import { SessionID } from "../DataTypes/SessionID";
import { CID } from "../DataTypes/CID";

export type userAccType = mongoose.Document & {
    email: String,
    password: String,
    identifier: {type: String, unique: true},
    sessionID: String,
    isLoggedIn : Boolean,
    CommitID: String
}

const userAccountSchema = new mongoose.Schema({
        email: String,
        password: String,
        identifier: {type: String, unique: true},
        sessionID: String,
        isLoggedIn : Boolean,
        CommitID: String
    }, {timestamps: true});

const UserAccount = mongoose.model("UserAccount", userAccountSchema);
export default UserAccount;