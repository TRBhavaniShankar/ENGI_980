// var aaa = function (){
//     return "hey";
// }

// console.log(aaa());


function isBigEnough(element : any, index : any, array : any) { 
    return (element >= 10); 
 } 
           
 var passed = [12, 5, 8, 130, 44].filter(isBigEnough); 
 console.log("Test Value : " + passed );