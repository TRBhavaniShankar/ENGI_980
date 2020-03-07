import mongoose from "mongoose";
import { CommitDT } from "../DataTypes/Commit";

export type CommitType = mongoose.Document & {
    commit: CommitDT
}

const commitSchema = new mongoose.Schema({
    commit: Object
}, {timestamps: true});

const commit = mongoose.model("commitSchema", commitSchema);
export default commit;