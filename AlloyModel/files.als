module files

sig Name { }

sig FileID { }

sig FileContent { }

abstract sig FileState {
    id : one FileID
}

sig DirectoryState extends FileState {
   map : Name -> one FileState
}

sig DataFileState extends FileState {
   content : one FileContent
}

fact onlyDirectoriesAreRoots {
    all f : DataFileState | some d : DirectoryState, name : Name | name.(d.map) = f
}

fact noDirectedCycles {
    no ( ^{d : DirectoryState, f :  FileState | some n : Name | n.(d.map) = f } & iden )
}

fact uniqeIDs {
    -- No two file states have the same id
    all x : FileState |
        all y : FileState |
            x not= y => x.id not= y.id
}

pred isRoot( f : DirectoryState ) {
	all d : DirectoryState, n : Name | n.(d.map) not= f
}

run isRoot for 7
