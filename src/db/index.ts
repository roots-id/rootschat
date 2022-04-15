import * as AsyncStore from './AsyncStore'
import * as CachedStore from './CachedStore'
//TODO move this into AsyncStore so they can work together?
import * as SecureStore from 'expo-secure-store';
import { logger } from '../logging'

const chats = []
//indexed by chat name
const messages = {}
const userDisplays: {
    id: string,
    displayName: string,
    displayPictureUrl: string} = {};
const quickReplyResults = {}
const credRequests = {}

export async function status() {
    logger("db - Prompting for status messages")
    await AsyncStore.status();
    CachedStore.status();
}

export function getWallet(walName) {
    const walJson = CachedStore.getWallet(walName);
    if (!walJson || walJson == null) {
        logger('db - no cached wallet found')
        return;
    } else {
        logger('db - cached wallet found',walJson)
        return walJson;
    }
}

export async function hasWallet(walName) {
    if(!cachedStore.hasWallet(walName)) {
        if(await AsyncStore.hasWallet(walName)) {
            logger("db - Has wallet in db",walName);
            return true;
        } else {
            logger("Does not have wallet",walName);
            return false;
        }
    }
    else{
        logger("Has wallet in cache",getWalletJson());
        return true;
    }
}

export async function restoreWallet(passphrase) {
    try {
        //TODO use keychain for secrets, etc.
        const walName = await SecureStore.getItemAsync(passphrase);
        if(walName && walName !== null) {
            const walJson = await AsyncStore.getWallet(walName)
            if(walJson) {
                CachedStore.storeWallet(walJson)
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
            if(await AsyncStore.storeWallet(wal._id,walJson)) {
                CachedStore.storeWallet(wal._id,walJson)
                logger('db - secure stored wallet')
                return true
            } else {
                logger('db - could not store in async store')
                return false
            }
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

export function createUserDisplay(userAlias: string, userName: string, userPicUrl: string) {
    userDisplays[userAlias] = {
        id: userAlias,
        displayName: userName,
        displayPictureUrl: userPicUrl,
    }
    logger("Created User Display w/ alias",userAlias," = ",JSON.stringify(userDisplays[userAlias]))
}

export function getUserDisplay(userAlias: string) {
    logger("Getting user display",userAlias," = ",JSON.stringify(userDisplays[userAlias]),"....")
    return userDisplays[userAlias]
}

export function newChat(didAlias: string, titlePrefix: string) {
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

export function getChats() {
    return chats
}

function addChat(chatJson: string) {
    if(!chats.includes(chatJson.id)) {
        chats.push(chatJson)
        logger("Chat",chatJson.id,"added.")
    } else {
        logger("Chat",chatJson.id,"already exists.  Not adding")
    }
}

export function getMessages(chatId: string, startFromMsgId: string) {
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

export function addMessage(chatId: string, message: string) {
    logger("Adding",JSON.stringify(message),".... to chat",chatId)
    messages[chatId].push(message)
}

export function getQuickReplyResult(replyId: string) {
    logger("Getting quick reply result for id",replyId,"=",quickReplyResults[replyId])
    return quickReplyResults[replyId]
}

export function addQuickReplyResult(replyId: string,result: string) {
    logger("Adding quick reply result",replyId,"=",result)
    quickReplyResults[replyId]=result
}

export function getCredRequests() {
    return credRequests
}