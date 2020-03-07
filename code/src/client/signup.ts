import fetch from 'node-fetch';

var data = { email: "abc.abc@abc",
             identifier: "1111",
             password: "abc",
             confirmPassword: "abc" } ;

async function getTest() {
    const response = await fetch('http://localhost:3000/');
  }

async function signup() {
    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    const db_json = await response.json();
    console.log(db_json);
  }


signup().catch(error => {console.log('error!'); console.error(error); });