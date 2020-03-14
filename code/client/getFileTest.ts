import fetch from 'node-fetch';
import { Guid } from "guid-typescript";
import { GetRequestDT } from '../DataTypes/GetRequest';
import { FileStatePair } from '../DataTypes/FileStatePair';

var SessionID : Guid = Guid.create();
var FileID :  Guid = Guid.create();
var CommitID : Guid = Guid.create();
var StateID : Guid = Guid.create();

var fIDs : [Guid] = [FileID];

var fStatePair : FileStatePair []= [new FileStatePair(FileID,StateID)];

var get : GetRequestDT = new GetRequestDT(SessionID,fIDs,CommitID, fStatePair);

var data = {
  className : "GetRequestDT",
  object: get
}

console.log(data)

 async function GetRequestTest() {
  const response = await fetch('http://localhost:3000/get', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

  const db_json = await response.json();
  console.log(db_json);
}

GetRequestTest().catch(error => {
    console.log('error!');
    console.error(error);
});