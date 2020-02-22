import mongoose from "mongoose";
var extendSchema = require('./mongoose-extend-schema');
import {default as fileElement, fileElementType} from "../Schemas/FileElementSchema";

export type fileType = fileElementType & {
    fileContent: String,
    fileSize: Number
}

const fileSchema = extendSchema(fileElement, {
    fileContent: String,
    fileSize: Number
});

const file = mongoose.model('fileSchema', fileSchema);
export default file;