import * as AsyncStore from './AsyncStore'
import * as CachedStore from './CachedStore'
//TODO move this into AsyncStore so they can work together?
import * as SecureStore from 'expo-secure-store';
import { logger } from '../logging'

//indexed by chat name
//const messages = {}
const userDisplays: {
    id: string,
    displayName: string,
    displayPictureUrl: string} = {};
const quickReplyResults = {}
const credRequests = {}

export async function status() {
    logger("store - Prompting for status messages")
    await AsyncStore.status();
    CachedStore.status();
}

export function getWallet(walName: string) {
    const walJson = CachedStore.getWallet(walName);
    if (!walJson || walJson == null) {
        logger('store - no cached wallet found')
        return;
    } else {
        logger('store - cached wallet found',walJson)
        return walJson;
    }
}

export async function hasWallet(walName: string) {
    if(!CachedStore.hasWallet(walName)) {
        const hasWallet = await AsyncStore.hasWallet(walName)
        if(hasWallet) {
            logger("store - Has wallet in store",walName);
            return true;
        } else {
            logger("store - Does not have wallet",walName);
            return false;
        }
    }
    else{
        logger("store - Has wallet in cache",getWalletJson());
        return true;
    }
}

export async function restoreWallet(passphrase: string) {
    try {
        //TODO use keychain for secrets, etc.
        const walName = await SecureStore.getItemAsync(passphrase);
        logger("restoring",walName,"w/passphrase",passphrase)
        if(!walName || walName == null) {
            logger("store - cannot restore wallet w/passphrase", passphrase)
            return false;
        }else {
            const walJson = await AsyncStore.getWallet(walName)
            if(walJson) {
                logger("store - putting restored wallet in cache",walName,":",walJson)
                CachedStore.storeWallet(walName,walJson)
                return true;
            } else {
                logger("store - No wallet found for walName", walName)
                return false;
            }
        }
    } catch (error) {
        logger("store - getting wallet from secure store failed",error)
        return false
    }
}

export async function saveWallet(walName: string, walPass: string, walJson: string) {
    logger("store - Saving wallet",walName,":",walJson)
    if(walJson && walJson.length > 0) {
        try {
            logger("store - Saving wallet to storage",walName,":",walJson)
            //TODO use keychain to encrypt values
            const result = await storeWallet(walName,walPass,walJson)
            if(result) {
                logger("store - successfully saved wallet",walName,":",result)
                return true;
            } else {
                logger("store - failed to save wallet", walName,":",result)
                return false;
            }
        } catch(error) {
            logger("store - could not save wallet",walName,":",walJson,error)
            return false;
        }
    } else {
        logger("store - Could not save wallet",walName,":",walJson)
        return false;
    }
}

async function storeWallet(walName: string, walPass: string, walJson: string) {
    const errMsgs = [];
    errMsgs.push("store - can't store wallet "+walName);
    errMsgs.push("wallet "+walJson);
    if(walJson) {
        try {
            logger('store - secure storing wallet',walName,"w/ pass",walPass)
            await SecureStore.setItemAsync(walPass,walName);
            if(await AsyncStore.storeWallet(walName,walJson)) {
                CachedStore.storeWallet(walName,walJson)
                logger('store - secure stored wallet')
                return true
            } else {
                logger('store - could not store in async store')
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
    logger("store - Created User Display w/ alias",userAlias," = ",JSON.stringify(userDisplays[userAlias]))
}

export function getUserDisplay(userAlias: string) {
    logger("store - Getting user display",userAlias," = ",JSON.stringify(userDisplays[userAlias]),"....")
    return userDisplays[userAlias]
}

export function getChats() {
    return chats
}

function saveChat(chatAlias: string, titlePrefix: string) {
    if(!chats.includes(chatAlias)) {
        chats.push(chatJson)
        logger("store - Chat",chatJson.id,"added.")
    } else {
        logger("store - Chat",chatJson.id,"already exists.  Not adding")
    }
}

export function getMessages(chatId: string, startFromMsgId: string) {
    if(!messages[chatId]) {
        messages[chatId]=[]
    }

    let chMsgs = messages[chatId]
    logger("store - Getting chat",chatId,chMsgs.length,"messages")

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
    logger("store - Adding",JSON.stringify(message),".... to chat",chatId)
    messages[chatId].push(message)
}

export function getQuickReplyResult(replyId: string) {
    logger("store - Getting quick reply result for id",replyId,"=",quickReplyResults[replyId])
    return quickReplyResults[replyId]
}

export function addQuickReplyResult(replyId: string,result: string) {
    logger("store - Adding quick reply result",replyId,"=",result)
    quickReplyResults[replyId]=result
}

export function getCredRequests() {
    return credRequests
}