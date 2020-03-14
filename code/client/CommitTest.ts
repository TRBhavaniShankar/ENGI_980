import { Cache } from '../Cache/Cache';

var hashTable = new Map<String, String[]>();

var value : String[] = ["aa", "bb"];

hashTable.set("aa", value);
console.log("initial");
console.log(hashTable);

value.push("cc");
hashTable.set("aa", value);
console.log("modified");
console.log(hashTable);

value.push("dd");
hashTable.set("aa", value);
console.log("modified");
console.log(hashTable);