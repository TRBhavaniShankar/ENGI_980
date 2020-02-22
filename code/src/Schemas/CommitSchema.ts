import mongoose from "mongoose";

export type userAccModel = mongoose.Document & {
    CommitID: String,
    CommitMessage: String,
    TimeOfCommit: Date,
    CommitOwner: String,
    ParentCommit: String
}

const commitSchema = new mongoose.Schema({
    CommitID: String,
    CommitMessage: String,
    TimeOfCommit: Date,
    CommitOwner: String,
    ParentCommit: String
    }, {timestamps: true});

const commit = mongoose.model("userAcc", commitSchema);
export default commit;