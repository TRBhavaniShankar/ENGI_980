import fetch from 'node-fetch';

var data_loggout = { email: "abc.abc@abc",
             password: "abc",
             sessionID: "afe0290a-1a15-f00a-afeb-377594aa994f"
             } ;

async function loggout() {
    
  const response = await fetch('http://localhost:3000/loggout', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data_loggout),
      });

  const db_json = await response.json();
  console.log(db_json);
}

loggout().catch(error => {console.log('error!'); console.error(error); });