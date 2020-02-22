import mongoose from "mongoose";

export type fileElementType = mongoose.Document &{
    FileID: String,
    FileType: String,
    FilePermission: Date,
    OwnerID: String,
    GroupID: String,
    GroupList: [],
    FileSize: String,
    LastModifiedTime: Date,
    CreationTime: Date,
    Name: String,
    StateID: Number
}


const fileElementSchema = new mongoose.Schema({
    FileID: String,
    FileType: String,
    FilePermission: Date,
    OwnerID: String,
    GroupID: String,
    GroupList: [],
    FileSize: String,
    LastModifiedTime: Date,
    CreationTime: Date,
    Name: String,
    StateID: Number
});

const fileElement = mongoose.model("fileElement", fileElementSchema);
export default fileElement;