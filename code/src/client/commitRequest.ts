// import fetch from 'node-fetch';
// import { CommitDT } from '../DataTypes/Commit';
// import { Update } from '../DataTypes/Update';
// import { FileStatePair } from '../DataTypes/FileStatePair';
// import { Change } from '../DataTypes/Change';
// import { Guid } from "guid-typescript";

// var session : String = "ba8613f7-5e16-646a-d5c4-dc13c48ea44f";
// var fid : Guid = Guid.create();
// var newCID : Guid = Guid.create();
// var oldCID : Guid = 
// var stateid : Guid = Guid.create();
// var fileStatePair : FileStatePair = new FileStatePair(fid, stateid);
// var change : Change = new Change(fid, );
// var update: Update = new Update(newCID,[change],[], oldCID);

// var commit : CommitDT = new CommitDT(session,[update],[fileStatePair]);

// var data = {
//     className : "CommitDT",
//     object: commit
// }

// console.log(commit);

//  async function CommitRequestTest() {
//   const response = await fetch('http://localhost:3000/commit', {
//       method: 'POST', 
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//   const db_json = await response.json();
//   console.log(db_json);
// }

// CommitRequestTest().catch(error => {
//     console.log('error!');
//     console.error(error);
// });





import fetch from 'node-fetch';
import { LoginDT } from '../DataTypes/LoginDT';
import { mkLogginDT } from '../MakeClasses/CreateClasses';
import { resJSON } from './jsonTypes';
import { ResponseDT } from '../Response/ResponseDT';
import { Guid } from "guid-typescript";
import { CommitDT } from '../DataTypes/Commit';
import { Update } from '../DataTypes/Update';
import { Change } from '../DataTypes/Change';
import { FileContent } from '../DataTypes/Content';
import { MetaData } from '../DataTypes/MetaData';
import { LeafValue } from '../DataTypes/LeafValue';
import { Delete } from '../DataTypes/Delete';
import { FileStatePair } from '../DataTypes/FileStatePair';

// ------------------------------------------------------------------
// ------------------------------------------------------------------

var commit_data : { className: string, object: CommitDT | Object } = {className : "", object: Object};

var login_data = { email: 'abc.abc@abc', password: 'abc'} ;

async function loginTest() : Promise<resJSON> {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login_data),
      });

   const signInJsonResp : resJSON  = await response.json();
  
   console.log(signInJsonResp);
   return signInJsonResp;
   // var loggin :  LoginDT = new mkLogginDT(signInJsonResp.object).getClassInstance();
   //return new mkLogginDT(signInJsonResp.object).getClassInstance();

    // var fid : Guid = Guid.create();
    // var stateID : Guid = Guid.create();
    // var metaData : MetaData = new MetaData();
    // var val : LeafValue = new LeafValue("abc");

    // //
    // var content : FileContent = new FileContent(stateID,metaData, val);
    // var change : Change = new Change(fid,content);
    // var del : Delete = new Delete(Object);
    // var update: Update = new Update(Guid.create(), [change], [del],loggin.cId);

    // //
    // var fileStatePair : FileStatePair = new FileStatePair(fid, stateID);
    // var commit : CommitDT = new CommitDT(loggin.sID,[update],[fileStatePair]);

    // commit_data = {
    //     className : "CommitDT",
    //     object: commit
    // }
  
  }


async function CommitRequestTest(commit_data: { className: string, object: CommitDT| Object; }) {
  const response = await fetch('http://localhost:3000/commit', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commit_data),
    });

  const db_json = await response.json();
  console.log(db_json);
}


console.log(loginTest().catch(error => { console.log('error!'); console.error(error); }));
  //  CommitRequestTest(commit_data).catch(error => {
  //   console.log('error!'); 
  //   console.error(error);