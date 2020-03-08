import mongoose from "mongoose";
import { Guid } from "guid-typescript";

export type userAccType = mongoose.Document & {
    email: String,
    password: String,
    identifier: {type: String, unique: true},
    sessionID: Guid,
    isLoggedIn : Boolean,
    CommitID: Guid
}

const userAccountSchema = new mongoose.Schema({
        email: String,
        password: String,
        identifier: {type: String, unique: true},
        sessionID: Number,
        isLoggedIn : Boolean,
        CommitID: Number
    }, {timestamps: true});

const UserAccount = mongoose.model("UserAccount", userAccountSchema);
export default UserAccount;