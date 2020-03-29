import { CommitDT } from "../DataTypes/Commit";
import { Cache } from "../Cache/Cache";
import { FileStatePair } from "../DataTypes/FileStatePair";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";
import { Change } from "../DataTypes/Change";
import { CommitID } from "../DataTypes/CommitID";
import { SessionID } from "../DataTypes/SessionID";
import { createDirectoryValueAndFileStatePair } from "../MakeClasses/CreateClasses";
import { UserAccount } from "../DataTypes/UserAccount";


export function initServerOperations() : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>]{

    // User is admin
    var user : string = "admin";

    // Initial session ID
    const sessionID : SessionID = new SessionID(Guid.create());

    // Initialte the caches
    var CommitCache : Cache<CommitID, CommitDT> = new Cache<CommitID, CommitDT>();
    var listOfCommits : CommitID[] = [];
    var userCache : Cache<String, UserAccount> = new Cache<String, UserAccount>();

    // Root commit id  
    var initCommitID : CommitID = new CommitID(Guid.create());
    var rootCommitID : CommitID = new CommitID(Guid.create());

    // Create new directory
    var changeAndFileStatePair : [Change, FileStatePair] = createDirectoryValueAndFileStatePair(user,"rwx",[]);
    var rootChanges : Change[] = [changeAndFileStatePair[0]];
    var rootFileStatePair : FileStatePair = changeAndFileStatePair[1];

    // Update object for root commit
    var rootUpdate : Update = new Update(rootCommitID, rootChanges, [], initCommitID);
    var rootCommit : CommitDT = new CommitDT(sessionID , [rootUpdate] , [rootFileStatePair]);

    // Initial commit for the root
    CommitCache.put(rootCommitID, rootCommit);
    listOfCommits.push(rootCommitID);

    // Initially user cache will consists of admin details
    userCache.put(user, new UserAccount(user,"admin123","1",sessionID,false));

    return [CommitCache , listOfCommits , userCache];

}
