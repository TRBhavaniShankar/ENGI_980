import mongoose from "mongoose";
var extendSchema = require('./mongoose-extend-schema');
import {default as fileElement, fileElementType} from "../Schemas/FileElementSchema";

export type fileType = fileElementType & {
    childFiles: [],
}

const fileSchema = extendSchema(fileElement, {
    childFiles: [],
});

const file = mongoose.model('fileSchema', fileSchema);
export default file;