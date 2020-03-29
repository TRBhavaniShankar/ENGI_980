export class Cache<U, T>{

    private hashTable : Map<U, T> = new Map<U, T>();
    private maxEntry : number = 200;

    public get(key: U) : T | undefined  {

        const hasKey : boolean = this.hashTable.has(key);
        let entry : T | undefined ;

        if(hasKey){
            entry = this.hashTable.get(key);
        }

        return entry;
    }

    public put(key: U, value: T) {

        if (this.hashTable.size >= this.maxEntry) {
            
            // Maximum size reached, put the data into database


        }
    
        this.hashTable.set(key, value);
      }

    public delete(key: U) {
    
        this.hashTable.delete(key);

      }

}