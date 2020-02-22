import mongoose from "mongoose";

export type userAccModel = mongoose.Document & {
    email: String,
    UserID: String,
    Password: String,
    AccountCreationDate: Date,
    LastLoginTime: String
}

const userAccountSchema = new mongoose.Schema({
        email: String,
        Password: String,
        identifier: {type: String, unique: true}
    }, {timestamps: true});

const UserAccount = mongoose.model("UserAccount", userAccountSchema);
export default UserAccount;