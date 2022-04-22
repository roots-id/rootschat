import * as decorators from '../decorators'
import { logger } from '../logging'
import PrismModule from '../prism'
import * as store from '../store'
import * as walletSchema from '../schemas/WalletSchema'
//import QRCode from 'qrcode'

import rwLogo from '../assets/LogoOnly1024.png'
import perLogo from '../assets/smallBWPerson.png'
import apLogo from '../assets/ATALAPRISM.png'
//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;
export const personLogo = perLogo;
export const prismLogo = apLogo;

//msg types
export const BLOCKCHAIN_URI_MSG_TYPE = "blockchainUri";
export const CREDENTIAL_JSON_MSG_TYPE = "jsonCredential";
export const DID_JSON_MSG_TYPE = "jsonDid";
export const PENDING_STATUS_MESSAGE = "pendingStatus";
export const PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE = "acceptCredential"
export const PROMPT_PUBLISH_MSG_TYPE = "promptPublish";
export const PRISM_LINK_MSG_TYPE = "prismLink"
export const STATUS_MSG_TYPE = "status";
export const TEXT_MSG_TYPE = "text"

//meaningful literals
export const ACHIEVEMENT_MSG_PREFIX = "You have a new achievement: ";
export const PUBLISHED_TO_PRISM = "published to Prism"

//state literals
export const CRED_ACCEPTED = "credAccepted"
export const CRED_REJECTED = "credRejected"
export const CRED_SENT = "credSent"

const ID_SEPARATOR = "_"

const ROOTS_BOT = "RootsWalletBot1"
const PRISM_BOT = "PrismBot1"
const LIBRARY_BOT = "LibraryBot1"

export const TEST_WALLET_NAME = "testWalletName"
const demo = true;

let currentWal;

const PUBLISHED_PRISM_CHAT_CREDENTIAL = "publishedPrismChatCredential"

const handlers = {};
const allProcessing = [];

export async function loadAll(walName: string,walPass: string) {
    const wallet = await loadWallet(walName, walPass);
    const emptyAlias = "";
    const chats = await loadDecorators(new RegExp(getStorageKey(emptyAlias,decorators.DECORATOR_TYPE_CHAT)+"*"))
    const users = await loadDecorators(new RegExp(getStorageKey(emptyAlias,decorators.DECORATOR_TYPE_USER)+"*"));
    const messages = await loadDecorators(new RegExp(getStorageKey(emptyAlias,decorators.DECORATOR_TYPE_MESSAGE)+"*"));
    return wallet && chats && users && messages;
}

//----------------- User -----------------
async function createUserDecorator(alias: string, name: string, pic: string) {
    try {
        if(getUserDecorator(alias)) {
            logger("roots - user already exists",alias)
            return true;
        } else {
            logger("roots - user did not exist",alias)
            const userDecor = decorators.createUser(alias, name, pic)
            const userDecorJson = JSON.stringify(userDecor)
            logger("generated user",userDecorJson)
            const result = await store.saveDecorator(getStorageKey(alias, decorators.DECORATOR_TYPE_USER), userDecorJson)
            logger("roots - created user",alias,"?",result)
            return result;
        }
    } catch(error) {
        console.error("Failed to create user",alias,error,error.stack)
        return false
    }
}

export function getUserDecorator(userId) {
    logger("roots - Getting user",userId)
    const userDecorJson = store.getDecorator(getStorageKey(userId,decorators.DECORATOR_TYPE_USER));
    logger("roots - Got user json",userDecorJson)
    if(userDecorJson) {
        const userDecor = JSON.parse(userDecorJson)
        logger("roots - user w/keys",Object.keys(userDecor))
        return userDecor
    } else {
        logger("roots - user not found",userId)
        return userDecorJson
    }
}

async function loadUsers() {
    try {
        const aliases = getAllDidAliases(currentWal);
        const result = await store.restoreDecorators(getStorageKeys(aliases,decorators.DECORATOR_TYPE_USER));
        if(result) {
            logger("roots - successfully loaded chat decorators",aliases)
            return true;
        }
        else {
            console.error("roots - Failed to load chat decorators",aliases)
            return false;
        }
    } catch(error) {
        console.error("roots - Failed to load chat decorators",error,error.stack)
        return false;
    }
}

//----------------- Wallet ---------------------
export async function createWallet(walName,mnemonic,walPass) {
    const prismWal = PrismModule.newWal(walName,mnemonic,walPass)
    const result = await updateWallet(walName,walPass,prismWal)
    if(result) {
        logger('Wallet created',store.getWallet(currentWal._id))
        return result;
    } else {
        logger('Could not create wallet',walName,walPass)
        return result;
    }
}

export async function loadWallet(walName: string,walPass: string) {
    logger("roots - loading wallet",walName,"with walPass",walPass);
    const restored = await store.restoreWallet(walPass);
    //retrieving wallet pulls the object into memory here
    const rootsWal = getRootsWallet(walName)
    if(restored && !(!rootsWal || rootsWal == null)) {
        logger("roots - loaded wallet",walName,"with walPass",walPass);
        return true
    } else {
        console.error("could not load wallet with walPass",walPass)
        return false
    }
}

export async function storageStatus() {
    logger("roots - Getting storage status")
    await store.status();
}

export async function hasWallet(walName) {
    if(await store.hasWallet(walName)) {
        logger("roots - Has wallet",store.getWallet(walName));
        return true;
    }
    else{
        logger("roots - Does not have wallet",walName);
        return false;
    }
 }

export function getRootsWallet(walName) {
    if(!currentWal || currentWal == null) {
        logger("roots - rootsWallet not set yet");
        const storedWalJson = store.getWallet(walName);
        if(!storedWalJson || storedWalJson == null) {
            logger("roots - no rootsWallet in storage",storedWalJson);
            return currentWal;
        } else {
            logger("roots - rootsWallet from storage",storedWalJson);
            currentWal = JSON.parse(storedWalJson);
            return currentWal;
        }
    } else {
        logger("roots - getRootsWallet has wallet w/keys",Object.keys(currentWal));
        return currentWal;
    }
}

export async function updateWallet(walName, walPass, walJson) {
    if(await store.saveWallet(walName, walPass, walJson)) {
        currentWal = JSON.parse(walJson)
        logger("roots - updated roots wallet",walJson);
        return true;
    } else {
        console.error("roots - failed to update roots wallet",walJson);
        return false;
    }
}

//------------------ DIDs ----------------
async function createDid(didAlias: string) {
    try {
        if(getDid(didAlias)) {
            logger("roots - Chat/DID already exists",didAlias)
            return true;
        } else {
            logger("roots - DID does not exist, creating",didAlias)
            const walletJson = store.getWallet(currentWal._id)
            logger("roots - requesting chat/did from prism, w/wallet",walletJson)
            const prismWalletJson = PrismModule.newDID(walletJson,didAlias)
            logger("roots - Chat/prismDid added to wallet", prismWalletJson)
            const saveResult = await updateWallet(currentWal._id,currentWal.passphrase,prismWalletJson)
            return saveResult;
        }
    } catch(error) {
        console.error("Failed to create chat DID",error,error.stack)
        return false
    }
}

function getDid(didAlias) {
    logger("roots - getDid by alias",didAlias)
    const dids = currentWal[walletSchema.WALLET_DIDS];
    if(dids) {
        logger("roots - current dids w/keys",Object.keys(dids))
        const findDid = dids.find(did => (did[walletSchema.DID_ALIAS] === didAlias));
        if(findDid) {
            logger("roots -  found did alias",didAlias,"w/keys:",Object.keys(findDid))
            return findDid
        } else {
            logger("roots - Couldn't find DID",didAlias)
            return;
        }
    } else {
        logger("roots - wallet has no DIDs to get.")
        return;
    }

}

//------------------ Chats  --------------
export async function createChat (chatAlias, titlePrefix) {
    logger("roots - Creating chat",chatAlias,"w/ titlePrefix",titlePrefix)
    const chatDidCreated = await createDid(chatAlias)
    logger("roots - chat did created/existed?",chatDidCreated)
    const chatDid = getDid(chatAlias)
    logger("roots - chat did w/keys",Object.keys(chatDid))
    //should be the same as chat alias, eating our own dog food
    const chatDidAlias = chatDid[walletSchema.DID_ALIAS]
    const chatDecorCreated = await createChatDecorator(chatDidAlias, titlePrefix)
    logger("roots - chat decorator created/existed?",chatDecorCreated)
    const chatDecor = getChatDecorator(chatDidAlias)
    logger("roots - chat decorator w/keys",Object.keys(chatDecor))
    //TODO what should the user defaults be?
    const chatUserCreated = await createUserDecorator(chatDidAlias,"You",personLogo)
    logger("roots - chat user created/existed?",chatUserCreated)
    const chatUser = getUserDecorator(chatDidAlias)

    if(chatDidCreated && chatDecorCreated && chatUserCreated) {
        await sendMessage(chatDecor,"Welcome to *"+chatAlias+"*",TEXT_MSG_TYPE,getUserDecorator(ROOTS_BOT))
        await sendMessage(chatDecor,"Would you like to publish this chat to Prism?",
            PROMPT_PUBLISH_MSG_TYPE,getUserDecorator(PRISM_BOT))
        logger("Created chat and added welcome to chat",chatAlias,"with chatDid",chatDidAlias)
        return true;
    } else {
        console.error("Could not create chat",chatAlias);
        return false
    }
}

async function createChatDecorator(chatAlias: string, titlePrefix: string) {
    logger('roots - Creating a new chat decorator',chatAlias)
    if(getChatDecorator(chatAlias)) {
        logger('roots - chat decorator already exists',chatAlias)
        return true
    } else {
        const chatDecor = decorators.createChat(chatAlias, [], titlePrefix)
        const savedChat = await store.saveDecorator(getStorageKey(chatAlias, decorators.DECORATOR_TYPE_CHAT), JSON.stringify(chatDecor))
        if(savedChat) {
            logger('roots - new chat saved',chatAlias)
            return true
        } else {
            logger('roots - could not save new chat',chatAlias)
            return false
        }
    }
}

//TODO iterate to verify DID connections if cache is expired
export async function getAllChats () {
    const allChats = getChatDecorators();
    if(allChats.length == 0 && demo) {
        logger("roots - adding demo to chats")
        await initDemo()
    }
    const result = {paginator: {items: allChats}};
    result.paginator.items.forEach(function (item, index) {
        logger("roots - getting chats",index+".",item.id);
    });
    return result;
}

export function getChatDecorator(chatAlias: string) {
    logger("roots - getting chat decorator",chatAlias)
    const chatJson = store.getDecorator(getStorageKey(chatAlias,decorators.DECORATOR_TYPE_CHAT))
    logger("roots - got chat",chatJson)
    if(chatJson) {
        const chat = JSON.parse(chatJson)
        logger("roots - chat has keys",Object.keys(chat));
        return chat;
    } else {
       logger("roots - could not get chat decorator",chatAlias)
    }
}

function getChatDecorators() {
    logger("roots - getting chat decorators")
    const chatRegex = new RegExp(decorators.DECORATOR_TYPE_CHAT+'*')
    const chatDecorJsonArray = store.getDecorators(chatRegex)
    logger("roots - got chat decorators",String(chatDecorJsonArray))
    const chats = chatDecorJsonArray.map(chatDecorJson => JSON.parse(chatDecorJson))
    return chats;
}

function getAllDidAliases(wallet) {
    const dids = wallet[walletSchema.WALLET_DIDS];
    if(!dids || dids == null || dids.length <= 0) {
        logger("No dids to get")
        return [];
    } else {
        const aliases = dids.map(did => did[walletSchema.DID_ALIAS]);
        logger("got did aliases",String(aliases));
        return aliases;
    }
}

async function loadChats() {
    try {
        const aliases = getAllDidAliases(currentWal);
        const result = await store.restoreDecorators(getStorageKeys(aliases,decorators.DECORATOR_TYPE_CHAT));
        if(result) {
            logger("roots - successfully loaded chat decorators",aliases)
            return true;
        }
        else {
            console.error("roots - Failed to load chat decorators",aliases)
            return false;
        }
    } catch(error) {
        console.error("roots - Failed to load chat decorators",error,error.stack)
        return false;
    }
}

export async function publishChat(chat) {
    if(!chat["published"]) {
        logger("roots - Publishing DID",chat.id,"to Prism")
        isProcessing(true)
        const newWalJson = await PrismModule.publishDid(store.getWallet(currentWal._id), chat.id)
        const result = await updateWallet(currentWal._id,currentWal.passphrase,newWalJson)
        if(result) {
            chat["published"]=true
            chat["title"]=chat.title+"🔗"
        }
        isProcessing(false)
    } else {
        logger("roots - ",chat.id,"is already",PUBLISHED_TO_PRISM)
    }
    return chat
}

// ---------------- Messages  ----------------------

// export async function addMessage(chatAlias: string, message) {
//     const msgJson = JSON.stringify(message)
//     logger("roots - Adding msg to chat",chatAlias,"msg:",msgJson)
// //     const chatJson = store.getDecorator(message.id,decorators.DECORATOR_TYPE_MESSAGE)
// //     const chat = JSON.parse(chatJson)
// //     //TODO expensive to search messages that are just JSON strings
// //     const foundJson = chat[decorators.CHAT_MESSAGES].find(msg => (JSON.parse(msg).id == message.id));
// //     if(foundJson) {
// //         console.error("Can't add message with the same id\n\tfound:",foundJson,"\n\twanted to add",msgJson)
// //         return false;
//     try {
//         chat[decorators.CHAT_MESSAGES].push(msgJson)
//         return await
//     }
// }

function addMessageExtensions(msg) {
    msg = addQuickReply(msg)
    return msg
}

function createMessageId(chatAlias: string,userId: string,msgNum: number) {
    let msgId = getStorageKey(chatAlias,decorators.DECORATOR_TYPE_MESSAGE)+ID_SEPARATOR+userId+ID_SEPARATOR+String(msgNum);
    logger("roots - Generated msg id",msgId);
    return msgId;
}

export function getMessages(chatAlias: string, startFromMsgId?: string) {
    const chMsgs = getMessageDecorators(chatAlias)
    logger("roots - Getting chat",chatAlias,chMsgs.length,"messages")
    chMsgs.forEach(msg => logger("roots - got message w/keys",Object.msg))
    if(!startFromMsgId) {
        return chMsgs;
    } else {
        logger("roots - Getting chat messages since",startFromMsgId)
        i = -1
        const findMsg = chMsgs.find(
            (msg) =>
            {
                i++;
                if(msg.id == startFromMsgId) return msg;
            }
        )
        const slicedMsgs = chMsgs.slice(i+1,chMsgs.length)
        if(!slicedMsgs || slicedMsgs.length <= 0) {
            console.error("roots - start message",startFromMsgId,"not found for chat",chatAlias)
            return []
        } else {
            logger("roots - Getting chat",chatAlias,"starting from",i+1,"to",slicedMsgs.length)
            return slicedMsgs
        }
    }
}

export function getMessageDecorators(chatAlias: string) {
    logger("roots - getting message decorators for chat",chatAlias)
    const msgRegex = new RegExp(getStorageKey(chatAlias,decorators.DECORATOR_TYPE_MESSAGE)+'*')
    const msgDecorJsonArray = store.getDecorators(msgRegex)
    logger("roots - got msg decorators",msgDecorJsonArray.length)
    const chatMsgs = msgDecorJsonArray.map(
        (msgDecorJson) => {
            logger("parsing msg json",msgDecorJson)
            return JSON.parse(msgDecorJson);
        }
    )
    chatMsgs.sort((a,b) => (a.createdTime < b.createdTime))
    return chatMsgs;
}

async function loadDecorators(regex: RegExp) {
    try {
        const result = store.restoreByRegex(regex)
        if(result) {
            logger("roots - successfully loaded decorator w/regex",regex)
            return true;
        }
        else {
            console.error("roots - Failed to load decorators w/regex",regex)
            return false;
        }
    } catch(error) {
        console.error("roots - Failed to load decorators w/regex",regex,error,error.stack)
        return false;
    }
}

export async function sendMessages(chat,msgs,msgType,userDisplay) {
    msgs.map(async (msg) => await sendMessage(chat,msg.text,msgType,userDisplay))
}

export async function sendMessage(chat,msgText,msgType,userDisplay,system=false) {
    const msgTime = Date.now()
    logger("roots - user",userDisplay.id,"sending",msgText,"to chat",chat.id);
    const msgId = createMessageId(chat.id,userDisplay.id,msgTime);
    let msg = decorators.createMessage(msgId, msgText, msgType, msgTime, userDisplay.id, system);
    msg = addMessageExtensions(msg);
    try {
        const result = await store.saveDecorator(msg.id,JSON.stringify(msg))
        if(handlers["onReceivedMessage"]) {
            handlers["onReceivedMessage"](msg)
        }
        return msg
    } catch(error) {
        console.error("Could not save message for user",userDisplay.id,"w/msg",msgText,"to chat",chat.id,error,error.stack)
        return;
    }
}

function addQuickReply(msg) {
    if(msg.type === PROMPT_PUBLISH_MSG_TYPE) {
        msg["quickReplies"] = {type: 'checkbox',keepIt: true,
            values: [{title: 'Yes',value: PROMPT_PUBLISH_MSG_TYPE,}],
        }
    }
    if(msg.type === PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE) {
        msg["quickReplies"] = {type: 'checkbox',keepIt: true,
            values: [{title: 'Yes',value: PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE+CRED_ACCEPTED,},{title: 'No Thx!',value: PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE+CRED_REJECTED}],
        }
    }
    return msg
}

export async function processQuickReply(chat,reply) {
    logger("roots - Processing Quick Reply w/ chat",chat.id,"w/ reply",reply)
    const msgs = []
    if(reply && chat) {
        const value = reply[0]["value"];
        if(value === PROMPT_PUBLISH_MSG_TYPE) {
            const pubChat = await publishChat(chat);
            await sendMessage(pubChat,pubChat.id+" "+PUBLISHED_TO_PRISM+"\nhttps://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
                    TEXT_MSG_TYPE,getUserDecorator(PRISM_BOT))
            const sentDid = await sendMessage(chat,JSON.stringify(getDid(chat.id)),DID_JSON_MSG_TYPE,getUserDecorator(PRISM_BOT),true);
            if(demo && sentDid) {
                sendMessage(chat,
                    "You published your chat to Prism!",
                    STATUS_MSG_TYPE,getUserDecorator(ROOTS_BOT))
                await createDemoCredential(chat)
            }
        } else if(value.startsWith(PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE)) {
            const credAlias = getCredentialAlias(chat.id)
            const status = store.getCredRequests()[credAlias]
            if(!status) {
                logger("roots - Could not find your credential request for",credAlias)
            } else {
                if(value.endsWith(CRED_ACCEPTED)) {
                    store.getCredRequests()[credAlias]=CRED_ACCEPTED
                    logger("roots - Credential accepted",credAlias)
                    await createDemoCredential(chat)
                } else if (value.endsWith(CRED_REJECTED)) {
                    store.getCredRequests()[credAlias]=CRED_REJECTED
                    logger("roots - Credential rejected",credAlias)
                } else {
                    logger("roots - Unknown credential prompt reply",value)
                }
            }
        }
         else {
            logger("roots - reply value not recognized, was",reply[0]["value"])
        }
    } else {
        logger("roots - reply",reply,"or chat",chat,"were undefined")
    }
}

// ------------------ Credentials ----------

async function createCredential(chat,cred) {
    const credJson = JSON.stringify(cred)
    logger("roots - Sending credJson", credJson)
    isProcessing(true)
    const newWalJson = await PrismModule.issueCred(store.getWallet(currentWal._id), chat.id, credJson);
    const savedWal = await updateWallet(currentWal._id,currentWal.passphrase,newWalJson)
    if(savedWal) {
        await sendMessage(chat,"Your new credential has been " + PUBLISHED_TO_PRISM+"\nhttps://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
              STATUS_MSG_TYPE,
              getUserDecorator(ROOTS_BOT))
        //const code = await QRCode.toDataURL()
        await sendMessage(chat,JSON.stringify(getCredential(cred.alias)),
            CREDENTIAL_JSON_MSG_TYPE,
            getUserDecorator(PRISM_BOT),true)

    }
    isProcessing(false)
}

function getCredential(credAlias) {
    logger("roots - Getting credential",credAlias)

    if(currentWal["issuedCredentials"]) {
        creds = currentWal["issuedCredentials"].filter(cred => {
            if(cred["alias"] === credAlias) {
                logger("roots - Found alias",cred["alias"])
                return true
            }
            else {
                logger("roots - Alias",cred["alias"],"is not",credAlias)
                return false
            }
        })
        if(creds && creds.length > 0) {
            return creds[0]
        }
    } else {
        logger("roots - No issued credentials")
    }
    return;
}

function getCredentialAlias(chatAlias) {
    return chatAlias + PUBLISHED_PRISM_CHAT_CREDENTIAL
}

function getStorageKey(alias: string,type: string) {
    return type+ID_SEPARATOR+alias
}

function getStorageKeys(aliases: string[], type: string) {
    return aliases.map(alias => getStorageKey(alias,type))
}

// ------------------ Session ---------------
const sessionInfo={};
const sessionState=[];
export function startChatSession(sessionInfo) {
    logger("roots - starting session w/chat",sessionInfo["chat"].title);
    if(sessionInfo["onReceivedMessage"]) {
        logger("roots - setting onReceivedMessage")
        handlers["onReceivedMessage"] = sessionInfo["onReceivedMessage"]
    }
    if(sessionInfo["onTypingStarted"]){
        logger("roots - setting onTypingStarted")
        handlers["onTypingStarted"] = sessionInfo["onTypingStarted"]
    }
    if(sessionInfo["onProcessing"]) {
        logger("roots - setting onProcessing")
        handlers["onProcessing"] = sessionInfo["onProcessing"]
    }

    const status = {
        succeeded: "session succeeded",
        end: "session ended",
    }

    return status;
}

//----------- Events -------------

export function isProcessing(processing=false) {
    if(processing){
        allProcessing.push(processing)
    } else if(allProcessing.length > 0) {
        allProcessing.pop()
    }
    console.log("Signaling processing of",(allProcessing.length > 0))
    handlers["onProcessing"](allProcessing.length > 0)
    return allProcessing.length > 0
}

//----------- DEMO Stuff --------------------

export async function createDemoCredential(chat) {
    const credMsgs = []
    const credAlias = getCredentialAlias(chat.id)
    if(chat["published"] && !getCredential(credAlias)) {
        if(!store.getCredRequests()[credAlias]) {
            store.getCredRequests()[credAlias]=CRED_SENT;
            sendMessage(chat,
                "To celebrate your publishing achievement, can we send you a verifiable credential?",
                PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE,getUserDecorator(ROOTS_BOT))
        } else if (store.getCredRequests()[credAlias] === CRED_REJECTED) {
            sendMessage(chat,
                "No problem! Your identity wallet is under your control.",
                STATUS_MSG_TYPE,getUserDecorator(ROOTS_BOT))
        } else if (store.getCredRequests()[credAlias] === CRED_ACCEPTED) {
            const didLong = currentWal[walletSchema.WALLET_DIDS][currentWal[walletSchema.WALLET_DIDS].length-1][walletSchema.DID_URI_LONG_FORM]
            logger("roots - Creating demo credential for chat",chat.id,"w/long form did",didLong)
            const cred = {
                alias: credAlias,
                issuingDidAlias: chat.id,
                claim: {
                    content: "{\"name\": \"RootsWallet\",\"degree\": \"law\",\"date\": \"2022-04-04 09:10:04\"}",
                    subjectDid: didLong,
                },
                verifiedCredential: {
                    encodedSignedCredential: "",
                    proof: {
                        hash: "",
                        index: -1,
                        siblings: [],
                    },
                },
                batchId: "",
                credentialHash: "",
                operationHash: "",
                revoked: false,
            }
            await createCredential(chat,cred)
        }
//        sendMessage(chat,"Valid credential",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
//
//
//        sendMessage(chat,"Credential imported",
//                    STATUS_MSG_TYPE,
//                    getUserDisplay(ROOTS_BOT))
//        sendMessage(chat,"Valid credential.",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
    //    sendMessage(chat,"https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
    //                 BLOCKCHAIN_URI_MSG_TYPE,
    //                 getUserDisplay(PRISM_BOT))
//        sendMessage(chat,"Credential revoked",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
//        sendMessage(chat,"Invalid credential.",
//                    STATUS_MSG_TYPE,
//                    getUserDisplay(ROOTS_BOT))
        return true;
    }
    return false;
}

async function initDemo() {
    const users = await initDemoUserDisplays()
    const intro = await initDemoIntro()
//    const achievements = await initDemoAchievements()
//    const library = await initDemoLibrary()
//    const resume = await initDemoResume()
    const result = (users && intro)
    return result;
}

async function initDemoAchievements() {
    const achieveCh = await createChat("Achievement Chat","Under Construction - ")

    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Opened RootsWallet!",
      STATUS_MSG_TYPE,
      getUserDecorator(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDecorator(ROOTS_BOT))
    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Clicked Example!",
      STATUS_MSG_TYPE,
      getUserDecorator(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDecorator(ROOTS_BOT))
}

async function initDemoIntro() {
    logger("roots - Init demo intro");
    const chat = await createChat("Introduction Chat","Under Construction - ")
}

async function initDemoLibrary() {
    const libraryCh = await createChat("Library Chat","Coming Soon - ")
}

async function initDemoResume() {
    const resumeCh = await createChat("Resume/CV Chat","Coming Soon - ")
}

async function initDemoUserDisplays() {
    await createUserDecorator(ROOTS_BOT,
                  "RootsWallet",
                  rootsLogo)
    await createUserDecorator(PRISM_BOT,
                  "Atala Prism",
                  prismLogo)
    await createUserDecorator(
                  LIBRARY_BOT,
                  "Library",
                  personLogo)
}

export function isDemo() {
    return demo
}

export const walCliCommands=[
" ./wal.sh new-wallet holder_wallet -m poet,account,require,learn,misery,monitor,medal,great,blossom,steak,rain,crisp",
"./wal.sh new-did holder_wallet holder_did",
"./wal.sh new-did issuer_wallet issuer_did -i",
"./wal.sh publish-did issuer_wallet issuer_did",
"./wal.sh show-did holder_wallet holder_did",
"./wal.sh issue-cred issuer_wallet issuer_did did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d:Cj8KPRI7CgdtYXN0ZXIwEAFKLgoJc2VjcDI1NmsxEiEDA7B2nZ_CvcIdkU2ovzBEovGzjwZECMUeHUeNo5_0Jug credential_a",
"./wal.sh verify-cred issuer_wallet issued credential_a",
"./wal.sh export-cred issuer_wallet credential_a credential_a.json",
"cat credential_a.json",
"./wal.sh import-cred holder_wallet credential_a credential_a.json",
"./wal.sh verify-cred holder_wallet imported credential_a",
"./wal.sh revoke-cred issuer_wallet credential_a",
"./wal.sh verify-cred issuer_wallet issued credential_a",
]

//export var walCommandsMsgs =  walCliMsgs.reduce(function(result, message, index) {
//  result.push(message);
//  result[index]["command"]=walCliCommands[index];
//  result[index]["id"]="walCli"+index
//  return result;
//}, []);