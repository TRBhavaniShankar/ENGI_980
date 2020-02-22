import fetch from 'node-fetch';

var SessionID = 123;
var FileID = 222;
var CommitID = 555;
var StateID = 111;

var FileStatePair = { fid: FileID, stid: StateID };

var data = { sid : SessionID, need: [FileID],  cid : CommitID, currentState:  [FileStatePair] } ;

 async function GetRequestTest() {
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

GetRequestTest().catch(error => {
    console.log('error!');
    console.error(error);
});