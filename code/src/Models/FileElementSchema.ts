import mongoose from "mongoose";
import { FileContent } from "../DataTypes/Content";

export type fileElementType = mongoose.Document &{
    fileContent: FileContent
}

const fileElementSchema = new mongoose.Schema({
    fileContent: Object
}, {timestamps: true});

const fileElement = mongoose.model("fileElement", fileElementSchema);
export default fileElement;