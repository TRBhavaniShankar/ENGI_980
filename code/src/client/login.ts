import fetch from 'node-fetch';

var login_data = { email: 'abc.abc@abc', password: 'abc'} ;

async function loginTest() {
 const response = await fetch('http://localhost:3000/login', {
     method: 'POST', 
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(login_data),
   });
 const db_json = await response.json();
 console.log(db_json);
}

loginTest().catch(error => { console.log('error!'); console.error(error); });