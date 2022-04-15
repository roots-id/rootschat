export const DID_ALIAS = "alias";
export const DID_URI_LONG_FORM = "uriLongForm"
export const WALLET_DIDS = "dids";

//const chats = []
//indexed by chat name
const messages = {}
const userDisplays = {}
const quickReplyResults = {}
const credRequests = {}

let wallet;

export function logger(...args) {
    //TODO divide long args and give samples
    if(args.length > 0) {
        console.log("roots -",...args.map(arg => String(arg).substring(0,150),"..."));
    }
}

export async function dbStatus() {
    logger("db - Prompting for db status messages")
    AsyncWallet.status();
}

export function getWallet() {
    logger("db - Got wallet from cache",JSON.stringify(wallet))
    return wallet;
}

export async function hasDbWallet(walName) {
    const walJson = await AsyncWallet.getWallet(walName)
    if (!walJson || walJson == null) {
        logger('db - No wallet found')
        return false;
    } else {
        logger('db - Wallet found',walJson)
        return true;
    }
}

export async function restoreWallet(passphrase) {
    try {
        //TODO use keychain for secrets, etc.
        const walName = await SecureStore.getItemAsync(passphrase);
        if(walName && walName !== null) {
            const walJson = await AsyncWallet.getWallet(walName)
            if(walJson) {
                wallet = JSON.parse(walJson)
                return true;
            } else {
                logger("db - No wallet found for walName", walName)
            }
        }else {
            logger("db - No wallet found for passphrase", passphrase)
        }
    } catch (error) {
        logger("db - getting wallet from secure store failed",error)
        return false
    }

    return false
}

export async function saveWallet(walJson) {
    logger("db - Saving wallet",walJson)
    if(walJson && walJson.length > 0) {
        try {
            logger("db - Saving wallet to storage",walJson)
            //TODO use keychain to encrypt values
            const wal = JSON.parse(walJson);
            result = await storeWallet(wal,walJson)
            if(result) {
                logger("db - successfully saved wallet",result)
                wallet = wal;
                return true;
            } else {
                logger("db - failed to save wallet", result)
                return false;
            }
        } catch(error) {
            logger("db - could not save wallet",walJson)
        }
        logger("db - Saved Wallet", result)
    } else {
        logger("db - Could not save wallet",walJson)
        return false;
    }
}

async function storeWallet(wal,walJson) {
    const errMsgs = [];
    errMsgs.push("db - can't store wallet "+wal._id);
    errMsgs.push("wallet "+walJson);
    if(walJson) {
        try {
            logger('db - secure storing wallet')
            await SecureStore.setItemAsync(wal.passphrase,wal._id);
            await AsyncWallet.storeWallet(wal._id,walJson)
            logger('db - secure stored wallet')
            return true
        } catch(error) {
            errMsgs.push(error.message)
            logger(...errMsgs)
            return false;
        }
    } else {
        logger(...errMsgs)
        return false;
    }
}

export function createUserDisplay(userAlias, userName, userPicUrl) {
    userDisplays[userAlias] = {
        id: userAlias,
        displayName: userName,
        displayPictureUrl: userPicUrl,
    }
    logger("Created User Display w/ alias",userAlias," = ",JSON.stringify(userDisplays[userAlias]))
}

export function getUserDisplay(userAlias) {
    logger("Getting user display",userAlias," = ",JSON.stringify(userDisplays[userAlias]),"....")
    return userDisplays[userAlias]
}

export function newChat(didAlias, titlePrefix) {
    logger('Creating a new chat',didAlias)
    let chatJson = {
        id: didAlias,
        published: false,
        title: titlePrefix + didAlias,
        type: "DIRECT",
    };
    addChat(chatJson)
    logger(didAlias,'chat created.')
    return chatJson
}

export function getChats(wallet) {
    return chats
}

export function addChat(chatJson) {
    if(!chats.includes(chatJson.id)) {
        chats.push(chatJson)
        logger("Chat",chatJson.id,"added.")
    } else {
        logger("Chat",chatJson.id,"already exists.  Not adding")
    }
}

export function getMessages(chatId, startFromMsgId) {
    if(!messages[chatId]) {
        messages[chatId]=[]
    }

    let chMsgs = messages[chatId]
    logger("Getting chat",chatId,chMsgs.length,"messages")

    if(startFromMsgId) {
        for(i = 0; i < chMsgs.length; i++) {
            if(chMsgs[i]["id"] === startFromMsgId) {
                if(i < chMsgs.length-1) {
                    return chMsgs.slice(i+1,chMsgs.length)
                } else {
                    return []
                }
            }
        }
    }

    return chMsgs;
}

export function addMessage(chatId, message) {
    logger("Adding",JSON.stringify(message),".... to chat",chatId)
    messages[chatId].push(message)
}

export function getQuickReplyResult(replyId) {
    logger("Getting quick reply result for id",replyId,"=",quickReplyResults[replyId])
    return quickReplyResults[replyId]
}

export function addQuickReplyResult(replyId,result) {
    logger("Adding quick reply result",replyId,"=",result)
    quickReplyResults[replyId]=result
}

export function getCredRequests() {
    return credRequests
}