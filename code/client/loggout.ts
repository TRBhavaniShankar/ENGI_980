import fetch from 'node-fetch';

var data_loggout = { email: "abc.abc@abc",
             password: "abc",
             } ;

async function loggout(data_loggout: { email: string; password: string; }) {
    
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

loggout(data_loggout).catch(error => {console.log('error!'); console.error(error); });