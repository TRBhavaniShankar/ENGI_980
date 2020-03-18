var a = [1, 2, 3], b = [101, 2, 1, 10]
var c = a.concat(b.filter((item) => a.indexOf(item) < 0))

console.log(c) // c is [1, 2, 3, 101, 10] 





