import uuid from 'react-native-uuid';
import { addChat,addMessage,createUserDisplay,DID_ALIAS,DID_URI_LONG_FORM,getChats,
    getCredRequests,
    getMessages,getUserDisplay,getWallet,logger, newChat,saveWallet,WALLET_DIDS } from '../db'
import PrismModule from '../prism'

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

//meaniful literals
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

const demo = true;
export const currentTime = new Date().getTime();

const PUBLISHED_PRISM_CHAT_CREDENTIAL = "publishedPrismChatCredential"

const handlers = {};
const allProcessing = [];

//----------------- User -----------------
export function getUser(userId) {
    logger("Getting user",userId)
    return getUserDisplay(userId);
}

//----------------- Wallet ---------------------
export function createWallet(walletName,mnemonic,passphrase) {
    saveWallet(JSON.parse(PrismModule.newWal(walletName,mnemonic,passphrase)))
    logger('Wallet created',getWalletJson())
}

function getWalletJson() {
    const walJson = JSON.stringify(getWallet())
    return walJson
}

//------------------ Chats (DIDs) --------------
//TODO log public DIDs and/or create Pairwise DIDs
export function createChat (chatName,titlePrefix) {
    if(!getWallet()) {
        createWallet("testWallet","","testPassphrase");
    }
    if(!getDid(chatName)) {
        logger("Creating chat",chatName,"w/ titlePrefix",titlePrefix)
        saveWallet(JSON.parse(PrismModule.newDID(getWalletJson(),chatName)))
        const newDid = getDid(chatName);
        createUserDisplay(newDid[DID_ALIAS],"You",personLogo)
        let newCh = newChat(newDid[DID_ALIAS],titlePrefix)
        sendMessage(newCh,"Welcome to *"+newDid[DID_ALIAS]+"*",TEXT_MSG_TYPE,getUserDisplay(ROOTS_BOT))
        sendMessage(newCh,"Would you like to publish this chat to Prism?",
            PROMPT_PUBLISH_MSG_TYPE,getUserDisplay(PRISM_BOT))
        return newCh
    } else {
        logger("Chat already exists",chatName)
    }
}


//TODO iterate to verify DID connections if cache is expired
export function getAllChats () {
    if(getChats().length == 0 && demo) {
        initializeDemo()
    }

    getChats().forEach(function (item, index) {
      logger("getting chats",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: getChats()}};
        resolve(result);
    });
    return promise1;
}

export function getChat(chatId) {
    logger("getting chat " + chatId);
    const chats = getChats().filter(chat => {if(chat.id === chatId){logger("chat found",chat.id);return true;}})
    if(chats && chats.length>0) {
        return chats[0]
    } else {
        logger("chat not found",chatId)
    }
    return;
}

function getDid(didAlias) {
    if(getWallet()[WALLET_DIDS]) {
        const dids = getWallet()[WALLET_DIDS].filter(did => {
            if(did["alias"] === didAlias) {
                return true;
            } else {
                return false;
            }
        });
        if(dids.length > 0) {
            return dids[0]
        } else {
            logger("Couldn't find DID",didAlias)
        }
    } else {
        logger("Couldn't find DID, wallet has no DIDs.")
    }
    return;
}

export async function publishChat(chat) {
    if(!chat["published"]) {
        logger("Publishing DID",chat.id,"to Prism")
        isProcessing(true)
        const newWalJson = await PrismModule.publishDid(getWalletJson(), chat.id)
        const wallet = JSON.parse(newWalJson)
        chat["published"]=true
        chat["title"]=chat.title+"🔗"
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
    logger("Generated msg id",msgId);
    return msgId;
}

export function getAllMessages(chatId) {
    logger("getting messages for chat",chatId);
    const chatMsgs = getMessages(chatId)
    chatMsgs.forEach(function (item, index) {
      logger("chat",chatId,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: chatMsgs}};
        resolve(result);
    });
    return promise1;
}

function getMessagesSince(chatId,msgId) {
    logger("getting messages for chat",chatId,"since",msgId);
    const chatMsgs = getMessages(chatId,msgId)
    chatMsgs.forEach(function (item, index) {
      logger("chat",chatId,"has message",index+".",item.id);
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
    logger("user",userDisplay.id,"sending",msgText,"to chat",chat.id);
    let msgNum = getMessages(chat.id).length
    let msgId = createMessageId(chat.id,userDisplay.id,msgNum);
    let msgTime = new Date().getTime() + (msgNum%100)
    let msg = createMessage(msgId, msgText, msgType, msgTime, userDisplay,system);
    msg = addMessageExtensions(msg);
    addMessage(chat.id,msg);
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
    logger("Processing Quick Reply w/ chat",chat.id,"w/ reply",reply)
    const msgs = []
    if(reply && chat) {
        const value = reply[0]["value"];
        if(value === PROMPT_PUBLISH_MSG_TYPE) {
            const pubChat = await publishChat(chat);
            await sendMessage(pubChat,pubChat.id+" "+PUBLISHED_TO_PRISM+"\nhttps://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
                    TEXT_MSG_TYPE,getUserDisplay(PRISM_BOT))
            const sentDid = await sendMessage(chat,JSON.stringify(getDid(chat.id)),DID_JSON_MSG_TYPE,getUserDisplay(PRISM_BOT),true);
//            await sendMessage(chat,
//                ,
//                BLOCKCHAIN_URI_MSG_TYPE,
//                getUserDisplay(PRISM_BOT),true);
            if(demo && sentDid) {
                sendMessage(chat,
                    "You published your chat to Prism!",
                    STATUS_MSG_TYPE,getUserDisplay(ROOTS_BOT))
                createDemoCredential(chat)
            }
        } else if(value.startsWith(PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE)) {
            const credAlias = getCredentialAlias(chat.id)
            const status = getCredRequests()[credAlias]
            if(!status) {
                logger("Could not find your credential request for",credAlias)
            } else {
                if(value.endsWith(CRED_ACCEPTED)) {
                    getCredRequests()[credAlias]=CRED_ACCEPTED
                    logger("Credential accepted",credAlias)
                } else if (value.endsWith(CRED_REJECTED)) {
                    getCredRequests()[credAlias]=CRED_REJECTED
                    logger("Credential rejected",credAlias)
                } else {
                    logger("Unknown credential prompt reply",value)
                }
                createDemoCredential(chat)
            }
        }
         else {
            logger("reply value not recognized, was",reply[0]["value"])
        }
    } else {
        logger("reply",reply,"or chat",chat,"were undefined")
    }
}

// ------------------ Credentials ----------

async function createCredential(chat,cred) {
    const credJson = JSON.stringify(cred)
    logger("Sending credJson", credJson)
    isProcessing(true)
    const newWalJson = await PrismModule.issueCred(getWalletJson(), chat.id, credJson);
    saveWallet(JSON.parse(newWalJson))

    await sendMessage(chat,"Your new credential has been " + PUBLISHED_TO_PRISM+"\nhttps://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
          STATUS_MSG_TYPE,
          getUserDisplay(ROOTS_BOT))
    await sendMessage(chat,JSON.stringify(getCredential(cred.alias)),
        CREDENTIAL_JSON_MSG_TYPE,
        getUserDisplay(PRISM_BOT),true)

    isProcessing(false)
}

function getCredential(credAlias) {
    logger("Getting credential",credAlias)

    if(getWallet()["issuedCredentials"]) {
        creds = getWallet()["issuedCredentials"].filter(cred => {
            if(cred["alias"] === credAlias) {
                logger("Found alias",cred["alias"])
                return true
            }
            else {
                logger("Alias",cred["alias"],"is not",credAlias)
                return false
            }
        })
        if(creds && creds.length > 0) {
            return creds[0]
        }
    } else {
        logger("No issued credentials")
    }
    return;
}

function getCredentialAlias(chatId) {
    return chatId + PUBLISHED_PRISM_CHAT_CREDENTIAL
}

// ----------------- Polling ------------



// ------------------ Session ---------------
const sessionInfo={};
const sessionState=[];
export function startChatSession(sessionInfo) {
    logger("starting session w/chat",sessionInfo["chat"].title);
    if(sessionInfo["onReceivedMessage"]) {
        logger("setting onReceivedMessage")
        handlers["onReceivedMessage"] = sessionInfo["onReceivedMessage"]
    }
    if(sessionInfo["onTypingStarted"]){
        logger("setting onTypingStarted")
        handlers["onTypingStarted"] = sessionInfo["onTypingStarted"]
    }
    if(sessionInfo["onProcessing"]) {
        logger("setting onProcessing")
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
    logger("using fake promise async");
    await getFakePromise(timeoutMillis)
}

export function getFakePromise(timeoutMillis) {
    logger("using fake promise");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved!');
      }, timeoutMillis);
    });
}

function initDemoUserDisplays() {
    createUserDisplay(ROOTS_BOT,
                  "RootsWallet",
                  rootsLogo)
    createUserDisplay(PRISM_BOT,
                  "Atala Prism",
                  prismLogo)
    createUserDisplay(
                  LIBRARY_BOT,
                  "Library",
                  personLogo)
}

function initializeDemo() {
    initDemoUserDisplays()
    initDemoIntro()
    initDemoAchievements()
    initDemoLibrary()
    initDemoResume()
}

function initDemoIntro() {
    const chat = createChat("Introduction Chat","Under Construction - ")
//    sendMessage(chat,
//        "system message",
//        STATUS_MSG_TYPE,
//        getUserDisplay(PRISM_BOT),true);
}

export function createDemoCredential(chat) {
    const credMsgs = []
    const credAlias = getCredentialAlias(chat.id)
    if(chat["published"] && !getCredential(credAlias)) {
        if(!getCredRequests()[credAlias]) {
            getCredRequests()[credAlias]=CRED_SENT;
            sendMessage(chat,
                "To celebrate your publishing achievement, can we send you a verifiable credential?",
                PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE,getUserDisplay(ROOTS_BOT))
        } else if (getCredRequests()[credAlias] === CRED_REJECTED) {
            sendMessage(chat,
                "No problem! Your identity wallet is under your control.",
                STATUS_MSG_TYPE,getUserDisplay(ROOTS_BOT))
        } else if (getCredRequests()[credAlias] === CRED_ACCEPTED) {
            const didLong = getWallet()[WALLET_DIDS][getWallet()[WALLET_DIDS].length-1][DID_URI_LONG_FORM]
            logger("Creating demo credential for chat",chat.id,"w/long form did",didLong)
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
            createCredential(chat,cred)
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

function initDemoAchievements() {
    const achieveCh = createChat("Achievement Chat","Under Construction - ")

    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Opened RootsWallet!",
      STATUS_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,ACHIEVEMENT_MSG_PREFIX+"Clicked Example!",
      STATUS_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(achieveCh,"{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
}

function initDemoLibrary() {
    const libraryCh = createChat("Library Chat","Coming Soon - ")
}

function initDemoResume() {
    const resumeCh = createChat("Resume/CV Chat","Coming Soon - ")
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