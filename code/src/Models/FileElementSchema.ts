import mongoose from "mongoose";
import { FileStatePair } from "../DataTypes/FileStatePair";
import { CID } from "../DataTypes/CID";
import { fileState } from "../DataTypes/Value";
import { StateID } from "../DataTypes/StateID";
import { MetaData } from "../DataTypes/MetaData";
import { LeafValue } from "../DataTypes/LeafValue";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { FileContent } from "../DataTypes/Content";

export type fileElementType = mongoose.Document &{
    fileContent: FileContent
}

const fileElementSchema = new mongoose.Schema({
    fileContent: Object
}, {timestamps: true});

const fileElement = mongoose.model("fileElement", fileElementSchema);
export default fileElement;