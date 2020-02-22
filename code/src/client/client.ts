import fetch from 'node-fetch';

/*var data = { email: "abc.abc@abc",
             password: "abc",
             confirmPassword: "abc" } ;*/

async function getTest() {
    const response = await fetch('http://localhost:3000/');
  }

// async function postTest() {
//     const response = await fetch('http://localhost:3000/signup', {
//         method: 'POST', 
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
//     const db_json = await response.json();
//     console.log(db_json);
//   }

/*
getTest().catch(error => {
    console.log('error!');
    console.error(error);
  });
  */

 var data = { email: "abc.abc@abc" } ;

 async function postTest() {
  const response = await fetch('http://localhost:3000/login', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  const db_json = await response.json();
  console.log(db_json);
}

postTest().catch(error => {
    console.log('error!');
    console.error(error);
});