import fetch from 'node-fetch';
import { LoginDT } from '../DataTypes/LoginDT';
import { mkLogginDT } from '../MakeClasses/CreateClasses';
import { resJSON } from './jsonTypes';
import { ResponseDT } from '../DataTypes/ResponseDT';
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

var login_data = { email: 'abc.abc@abc', password: 'abc'} ;

async function loginTest(login_data: { email: string; password: string; }) : Promise<ResponseDT> {
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


// async function CommitRequestTest(commit_data: { className: string, object: CommitDT| Object; }) {
//   const response = await fetch('http://localhost:3000/commit', {
//       method: 'POST', 
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(commit_data),
//     });

//   const db_json = await response.json();
//   console.log(db_json);
// }


loginTest(login_data)
  .then(function (resp : ResponseDT){
    console.log(resp);
  })
  .catch(

  );