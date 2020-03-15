import fetch from 'node-fetch';
import { LoginDT } from '../src/DataTypes/LoginDT';
import { mkLogginDT, mkResponseDT } from '../src/MakeClasses/CreateClasses';
import { resJSON } from '../src/client/jsonTypes';
import { ResponseDT } from '../src/DataTypes/ResponseDT';
import { Guid } from "guid-typescript";
import { CommitDT } from '../src/DataTypes/Commit';
import { Update } from '../src/DataTypes/Update';
import { Change } from '../src/DataTypes/Change';
import { FileContent } from '../src/DataTypes/Content';
import { MetaData } from '../src/DataTypes/MetaData';
import { LeafValue } from '../src/DataTypes/LeafValue';
import { Delete } from '../src/DataTypes/Delete';
import { FileStatePair } from '../src/DataTypes/FileStatePair';

// ------------------------------------------------------------------
// ------------------------------------------------------------------

var login_data = { email: 'abc.abc@abc', password: 'abc'} ;

async function loginTest(login_data: { email: string; password: string; }) : Promise<ResponseDT<any>> {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login_data),
      });
  
  //  console.log(signInJsonResp);
   return await response.json();
  }


async function CommitRequestTest(commit_data: {email: string, className: string, object: CommitDT| Object; }) :  Promise<ResponseDT<any>>{
  const response = await fetch('http://localhost:3000/commit', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commit_data),
    });

  return await response.json();
}


loginTest(login_data)
  .then(function (resp){
    
    console.log(resp);

    if (resp.status == 200 || resp.status == 201){
    
    var respns : ResponseDT<LoginDT> = new mkResponseDT<LoginDT>(resp).getClassInstance();
    console.log(respns);
    var login : LoginDT = new mkLogginDT(resp.object).getClassInstance();

    var fid : Guid = Guid.create();
    var stateID : Guid = Guid.create();
    var metaData : MetaData = new MetaData();
    var val : LeafValue = new LeafValue("abc");

    //
    var content : FileContent = new FileContent(stateID,metaData, val);
    var change : Change = new Change(fid,content);
    var del : Delete = new Delete(Object);
    var update: Update[] = [new Update(Guid.create(), [change], [del],login.cId)];

    //
    var fileStatePair : FileStatePair[] = [new FileStatePair(fid, stateID)];
    var commit : CommitDT = new CommitDT(login.sID,update,fileStatePair);

    var commit_data = {
        email: 'abc.abc@abc',
        className : "CommitDT",
        object: commit
    }

    console.log(commit_data);

    CommitRequestTest(commit_data)
    .then(function (resp){
      console.log(resp);
    }
    )
    .catch(

    );
    }

  })
  .catch(function (err : Error){
    console.log(err);
  }
  );