import fetch from 'node-fetch';
import { CommitDT } from '../DataTypes/Commit';
import { Update } from '../DataTypes/Update';
import { SessionID } from '../DataTypes/SessionID';
import { FileStatePair } from '../DataTypes/FileStatePair';
import { FileID } from '../DataTypes/FileID';
import { StateID } from '../DataTypes/StateID';
import { CID } from '../DataTypes/CID';
import { Change } from '../DataTypes/Change';

var session : String = "ba8613f7-5e16-646a-d5c4-dc13c48ea44f";
var fid : String = new FileID().generateFileID();
var newCID : String = new CID().generateCID();
var oldCID : String = "bcae802d-90c2-7488-6b5b-ecac9504e54c";
var stateid : String = new StateID().generateStateID();
var fileStatePair : FileStatePair = new FileStatePair(fid, stateid);
var change : Change = new Change(fid, "abcdefg");
var update: Update = new Update(newCID,[change],[],oldCID);

var commit : CommitDT = new CommitDT(session,[update],[fileStatePair]);

var data = {
    className : "CommitDT",
    object: commit
}

console.log(commit);

 async function CommitRequestTest() {
  const response = await fetch('http://localhost:3000/commit', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

  const db_json = await response.json();
  console.log(db_json);
}

CommitRequestTest().catch(error => {
    console.log('error!');
    console.error(error);
});