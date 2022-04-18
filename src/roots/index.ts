import * as store from '../store'
import { logger } from '../logging'
import PrismModule from '../prism'
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
export const currentTime = new Date().getTime();

let currentWal;

const PUBLISHED_PRISM_CHAT_CREDENTIAL = "publishedPrismChatCredential"

const handlers = {};
const allProcessing = [];

//----------------- User -----------------
export function getUser(userId) {
    logger("roots - Getting user",userId)
    return store.getUserDisplay(userId);
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

export async function loadWallet(walName,walPass) {
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
function getDid(didAlias) {
    logger("roots - getDid by alias",didAlias)
    const dids = currentWal[walletSchema.WALLET_DIDS];
    if(dids) {
        logger("roots - current dids",dids)
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
export async function createChat (chatName,titlePrefix) {
    logger("roots - Creating chat",chatName,"w/ titlePrefix",titlePrefix)
    if(!getDid(chatName)) {
        logger("roots - Creating chat did existence check passed")
        const prismWalletJson = PrismModule.newDID(store.getWallet(currentWal._id),chatName)
        logger("roots - Chat w/prismDid wallet", prismWalletJson)
        const saveResult = await updateWallet(currentWal._id,currentWal.passphrase,prismWalletJson)
        if(saveResult) {
            logger("roots - saved wallet, retrieving did for new chat")
            const newDid = getDid(chatName);
            logger("roots - new chat did is",newDid)
            store.createUserDisplay(newDid[walletSchema.DID_ALIAS],"You",personLogo)
            let newCh = store.saveChat(newDid[walletSchema.DID_ALIAS], titlePrefix)
            sendMessage(newCh,"Welcome to *"+newDid[walletSchema.DID_ALIAS]+"*",TEXT_MSG_TYPE,store.getUserDisplay(ROOTS_BOT))
            sendMessage(newCh,"Would you like to publish this chat to Prism?",
                PROMPT_PUBLISH_MSG_TYPE,store.getUserDisplay(PRISM_BOT))
            return newCh
        } else{
            console.error("Could not create chat, saving wallet failed");
        }
    } else {
        console.error("Chat already exists",chatName)
    }
}


//TODO iterate to verify DID connections if cache is expired
export async function getAllChats () {
    if(store.getChats().length == 0 && demo) {
        logger("roots - adding demo to chats")
        await initDemo()
    }
    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: store.getChats()}};
        result.paginator.items.forEach(function (item, index) {
          logger("roots - getting chats",index+".",item.id);
        });
        resolve(result);
    });
    return promise1;
}

export function getChat(chatId) {
    logger("roots - getting chat " + chatId);
    const chats = store.getChats().filter(chat => {if(chat.id === chatId){logger("roots - chat found",chat.id);return true;}})
    if(chats && chats.length>0) {
        return chats[0]
    } else {
        logger("roots - chat not found",chatId)
    }
    return;
}

export function newChat(chatAlias: string, titlePrefix: string) {
    logger('store - Creating a new chat',chatAlias)
    chat[chatAlias] = {
        id: chatAlias,
        published: false,
        title: titlePrefix + didAlias,
        messages: [],
    };
    saveChat(chatJson)
    logger('chat created',chatAlias)
    return chatJson
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
        logger(chat.id,"is already",PUBLISHED_TO_PRISM)
    }
    return chat
}

// ---------------- Messages  ----------------------
function addMessageExtensions(msg) {
    msg = addQuickReply(msg)
    return msg
}

function createMessage(idText,bodyText,statusText,timeInMillis,userDisplayJson,system=false) {
    return {
        id: idText,
        body: bodyText,
        type: statusText,
        createdTime: timeInMillis,
        user: userDisplayJson,
        system: system,
    }
}

function createMessageId(chatId,user,msgNum) {
    let msgId = "msg"+ID_SEPARATOR+String(user)+ID_SEPARATOR+String(chatId)+ID_SEPARATOR+String(msgNum);
    logger("roots - Generated msg id",msgId);
    return msgId;
}

export function getAllMessages(chatId) {
    logger("roots - getting messages for chat",chatId);
    const chatMsgs = store.getMessages(chatId)
    chatMsgs.forEach(function (item, index) {
      logger("roots - chat",chatId,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: chatMsgs}};
        resolve(result);
    });
    return promise1;
}

function getMessagesSince(chatId,msgId) {
    logger("roots - getting messages for chat",chatId,"since",msgId);
    const chatMsgs = store.getMessages(chatId,msgId)
    chatMsgs.forEach(function (item, index) {
      logger("roots - chat",chatId,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: chatMsgs}};
        resolve(result);
    });
    return promise1;
}


export async function sendMessages(chat,msgs,msgType,userDisplay) {
    await Promise.all(msgs.map(msg => sendMessage(chat,msg.text,msgType,userDisplay)))
}

export async function sendMessage(chat,msgText,msgType,userDisplay,system=false) {
    logger("roots - user",userDisplay.id,"sending",msgText,"to chat",chat.id);
    let msgNum = store.getMessages(chat.id).length
    let msgId = createMessageId(chat.id,userDisplay.id,msgNum);
    let msgTime = new Date().getTime() + (msgNum%100)
    let msg = createMessage(msgId, msgText, msgType, msgTime, userDisplay,system);
    msg = addMessageExtensions(msg);
    store.addMessage(chat.id,msg);
    if(handlers["onReceivedMessage"]) {
        handlers["onReceivedMessage"](msg)
    }
    return msg
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
                    TEXT_MSG_TYPE,store.getUserDisplay(PRISM_BOT))
            const sentDid = await sendMessage(chat,JSON.stringify(getDid(chat.id)),DID_JSON_MSG_TYPE,store.getUserDisplay(PRISM_BOT),true);
//            await sendMessage(chat,
//                ,
//                BLOCKCHAIN_URI_MSG_TYPE,
//                getUserDisplay(PRISM_BOT),true);
            if(demo && sentDid) {
                sendMessage(chat,
                    "You published your chat to Prism!",
                    STATUS_MSG_TYPE,store.getUserDisplay(ROOTS_BOT))
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
              store.getUserDisplay(ROOTS_BOT))
        //const code = await QRCode.toDataURL()
        await sendMessage(chat,JSON.stringify(getCredential(cred.alias)),
            CREDENTIAL_JSON_MSG_TYPE,
            store.getUserDisplay(PRISM_BOT),true)

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

function getCredentialAlias(chatId) {
    return chatId + PUBLISHED_PRISM_CHAT_CREDENTIAL
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

export function isDemo() {
    return demo
}

export async function getFakePromiseAsync(timeoutMillis) {
    logger("roots - using fake promise async");
    await getFakePromise(timeoutMillis)
}

export function getFakePromise(timeoutMillis) {
    logger("roots - using fake promise");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved!');
      }, timeoutMillis);
    });
}

function initDemoUserDisplays() {
    store.createUserDisplay(ROOTS_BOT,
                  "RootsWallet",
                  rootsLogo)
    store.createUserDisplay(PRISM_BOT,
                  "Atala Prism",
                  prismLogo)
    store.createUserDisplay(
                  LIBRARY_BOT,
                  "Library",
                  personLogo)
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

async function initDemoIntro() {
    logger("roots - Init demo intro");
    const chat = await createChat("Introduction Chat","Under Construction - ")
//    sendMessage(chat,
//        "system message",
//        STATUS_MSG_TYPE,
//        getUserDisplay(PRISM_BOT),true);
}

export async function createDemoCredential(chat) {
    const credMsgs = []
    const credAlias = getCredentialAlias(chat.id)
    if(chat["published"] && !getCredential(credAlias)) {
        if(!store.getCredRequests()[credAlias]) {
            store.getCredRequests()[credAlias]=CRED_SENT;
            sendMessage(chat,
                "To celebrate your publishing achievement, can we send you a verifiable credential?",
                PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE,store.getUserDisplay(ROOTS_BOT))
        } else if (store.getCredRequests()[credAlias] === CRED_REJECTED) {
            sendMessage(chat,
                "No problem! Your identity wallet is under your control.",
                STATUS_MSG_TYPE,store.getUserDisplay(ROOTS_BOT))
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

async function initDemoAchievements() {
    const achieveCh = await createChat("Achievement Chat","Under Construction - ")

    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Opened RootsWallet!",
      STATUS_MSG_TYPE,
      store.getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      CREDENTIAL_JSON_MSG_TYPE,
      store.getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Clicked Example!",
      STATUS_MSG_TYPE,
      store.getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      CREDENTIAL_JSON_MSG_TYPE,
      store.getUserDisplay(ROOTS_BOT))
}

async function initDemoLibrary() {
    const libraryCh = await createChat("Library Chat","Coming Soon - ")
}

async function initDemoResume() {
    const resumeCh = await createChat("Resume/CV Chat","Coming Soon - ")
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