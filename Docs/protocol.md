# The Glyphs protocol

## Types used

Data types

```
    FileStatePair --> fileStatePair{ fid: FileID, stid: StateID }
    Delete --> delete{ fid: FileID }
    Change --> change{ fid: FileID, content: Content }
    Content --> fileContent{ stid : StateID, metaData : MetaData, value: Value }
    Value -->  LeafValue | DirectoryValue 
    LeafValue --> ByteString
    DirectoryValue --> directory{ entries : DirectoryEntry* }
    DirectoryEntry --> directoryEntry{ name : String, fid : FileID }
    Update --> update{ new_cid : CID,  update: Change*, deletes: Delete*, old_cid : CID }
```

Request types

```
   GetRequest -->  get{ sid : SessionID, need: FileID*,  cid : CommitID, currentState:  FileStatePair* }
   CommitRequest --> commit{ sid: SID, updates: Update*, currentState:  FileStatePair* }
```

Response types

```
   Success -->  success
   Failure --> failure{ message : String }
   Files --> update{ new_cid : CID,  update: (Change | FileStatePair)*, deletes: Delete*, old_cid : CID }
```

## High-level description

### `get{ sid : s, need: fids,  cid : cid0, currentState: pairs }`

Fields:

* `s`: The session ID. 
* `fids`: set of File IDs.  The files needed.  These will be files that the client needs but does not have.  This set can be empty, which is useful as it has the effect of polling the server for new updates.  It's a good idea for the client to poll the server occasionally to make sure no updates are missed. Any file IDs mentioned here should exist in  commit `cid0`.
* `cid0`: The latest commit ID this client has received from the server.
* `pairs`: A list of records `fileStatePair{ fid: f, stid: st }` indicating files the client already has.  These files should all exist in commit `cid0`.

Note in commit `cid0`, the state of each file that is mentioned in `pairs` should have a state as given in `pairs`.  (This state information is redundant, in that the server could figure it out, but might not be efficient to do so on the server.)

Response:  ` failure{ message : m }`. This means that the request failed for some reason.

Response: `update{ new_cid : cid1,  update: updates, deletes: deletes, old_cid : cid0 }`

Fields

* `cid1`: The id of the head commit on the server.
* `cid0` : This should be the same as the `cid0` from the request.
* `updates`: A list of `Change` records.  These indicate the content of any files that the client needs that have changed between `cid0` and `cid1`.  These will also include the contents of any other files at commit `cd1` that client needs, but does not have, regardless of whether they have changed.)
* `deletes`: This indicates all the files that the client needs or has that have been deleted between cid0 and cid1.


The meaning of the response is that:

* If `cid1` is not equal to `cid0`, then `cid1` is a newer commit than `cid0`.
* Any file IDs sent in the `currentState ` field of the request that are not mentioned in `updates` or  `deletes` fields of the response, still exist `cid1` and have the same state as they did in commit `cd0`.
* Any file in `deletes` does not exist in `cid1`. (It was deleted between  `cid0` and `cid1`.)
* Each file mentioned `updates` has a state in `cid1` as given in the record.

Note that there may be additional files sent back from the server to fill in any gaps in the clients knowledge. In particular, if `d` is a directory that the client has and `f` is a file that the client has and `d1` is a directory is on the path from `d` to `f` (in commit `cid1`) that the client does not have, then `d1` should also be included in the `updates`.

###  commit{ sid: s, updates: [update{ new_cid : cidx,  update: updates, deletes: deletes, old_cid : cid0 }], currentState: pairs }

Fields:

* `s`: The session ID. 
* `cidx`: a proposed new commit ID.  It should be a new identifier, never used before.
* `updates`: A list of changes to existing files and new files.
* `deletes`: A list of files to be deleted.
* `cid0` : The id of the parent of `cidx`.  This must be a commit that is (or has been) the head commit on the server.
* `pairs `: A list of files that the client has and that do not change between commit `cd0` and `cdx`.

A commit record proposes a commit to the server.

* If the server's head is `cdx`, it can simply reply with "success".  (This can happen in the case of a resend.)
* If the server's head is not `cdx`, but it was in the past, then the server sends back a "files" response to update the client from state `cd0`
* If the server's head is still `cid0` at the time the commit is received, then the server can simply make the updates proposed and replies with a "success" response.
* Otherwise, the server will try to merge the proposed commit with its current head to produce a new head, CD1. It then replies with a "files" response.  (The interpretation of the "files" response is as above.)

Response:  `failure{ message: m }`.  The server could not complete the commit.

Response: `success`.  The server completed the commit and the new head is `cidx`.

Response: `update{ new_cid : cid1,  update: updates, deletes: deletes, old_cid : cid0 }`. The server completed the commit and the new state differs from `cid0` as described.


### Resending a commit request

If there is no timely response to the request, then the client should assume that either the request or the reply was lost.  If should resend the commit request again.

### Augmenting a commit request

If there are more local changes on the client, then the resent commit requests may need to be augmented with these additional changes.  A request augmented once looks like this

```
    commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates, deletes: deletes, old_cid : cidx }, 
                                  update{ new_cid : cidx,  update: updates, deletes: deletes, old_cid : cid0 }], 
                  currentState: pairs }
```

So here the client is proposing that the server update from `cid0` to `cidx` and then to `cidy`.  It does so as follows.

* If `cidx` is the current head, the server can make `cidy` the current head and send back a success reply.  (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
* If `cidx` is not the current head, but was in the past, the server will ignore the second update record. It behaves as if the message was

```
    commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates, deletes: deletes, old_cid : cidx }], 
                  currentState: pairs1 }
```
where `pairs1` is a suitably modified copy of `pairs`.

* If `cidx` was never the current head, then the server needs to combine the two updates to make one update, and behaves as if the request was

```
    commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates1, deletes: deletes1, old_cid : cid0 }], 
                  currentState: pairs }
```

This extends to longer and longer augmented requests.






