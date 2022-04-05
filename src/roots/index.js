import uuid from 'react-native-uuid';
import { addChannel,addMessage,createUserDisplay,DID_ALIAS,DID_URI_LONG_FORM,getChannels,
    getMessages,getUserDisplay,getWallet,logger, newChannel,saveWallet,WALLET_DIDS } from '../db'
import PrismModule from '../prism'

import rwLogo from '../assets/RootsLogoAvatar.png'
import perLogo from '../assets/smallBWPerson.png'
import apLogo from '../assets/ATALAPRISM.png'
//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;
export const personLogo = perLogo;
export const prismLogo = apLogo;

export const BLOCKCHAIN_URI_MSG_TYPE = "blockchainUri";
export const CREDENTIAL_JSON_MSG_TYPE = "jsonCredential";
export const DID_JSON_MSG_TYPE = "jsonDid";
export const PENDING_STATUS_MESSAGE = "pendingStatus";
export const PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE = "acceptCredential"
export const PROMPT_PUBLISH_MSG_TYPE = "promptPublish";
export const PRISM_LINK_MSG_TYPE = "prismLink"
export const STATUS_MSG_TYPE = "status";
export const TEXT_MSG_TYPE = "text"

export const ACHIEVEMENT_MSG_PREFIX = "You have a new achievement: ";

const ID_SEPARATOR = "_"

const ROOTS_BOT = "RootsWalletBot1"
const PRISM_BOT = "PrismBot1"
const BARTENDER_BOT = "BartenderBot1"

const demo = true;
export const currentTime = new Date().getTime();

const PUBLISHED_PRISM_CHANNEL_CREDENTIAL = "publishedPrismChannelCredential"

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

//------------------ Channels (DIDs) --------------
//TODO log public DIDs and/or create Pairwise DIDs
export function createChannel (channelName,titlePrefix) {
    logger("Creating channel",channelName,"w/ titlePrefix",titlePrefix)
    if(!getWallet()) {
        createWallet("testWallet","","testPassphrase");
    }
    saveWallet(JSON.parse(PrismModule.newDID(getWalletJson(),channelName)))
    const newDid = getWallet()[WALLET_DIDS][getWallet()[WALLET_DIDS].length-1];
    createUserDisplay(newDid[DID_ALIAS],"You",personLogo)
    let newCh = newChannel(newDid[DID_ALIAS],titlePrefix)
    sendMessage(newCh,"Welcome to *"+newDid[DID_ALIAS]+"*",TEXT_MSG_TYPE,getUserDisplay(ROOTS_BOT))
    sendMessage(newCh,"Would you like to publish this channel to Prism?",
        PROMPT_PUBLISH_MSG_TYPE,getUserDisplay(PRISM_BOT))
    return newCh
}


//TODO iterate to verify DID connections if cache is expired
export function getAllChannels () {
    if(getChannels().length == 0 && demo) {
        initializeDemo()
    }

    getChannels().forEach(function (item, index) {
      logger("getting channels",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: getChannels()}};
        resolve(result);
    });
    return promise1;
}

export function getChannelDisplayName(channel) {
  logger("getting channel display name " + channel);
  if (channel.type === 'DIRECT') {
    return channel.members.map((member) => member.displayName).join(', ');
  } else {
    return channel.name;
  }
}

function getDid(didAlias) {
    return getWallet()[WALLET_DIDS].filter(did => {
        if(did["alias"] === didAlias) {
            return true;
        } else {
            return false;
        }
    });
}

export async function publishChannel(channel) {
    if(!channel["published"]) {
        logger("Publishing DID",channel.id,"to Prism")
        isProcessing(true)
        const newWalJson = await PrismModule.publishDid(getWalletJson(), channel.id)
        const wallet = JSON.parse(newWalJson)
        channel["published"]=true
        channel["title"]="🔗"+channel.title
        isProcessing(false)
    } else {
        logger(channel.id,"is already published to Prism")
    }
    return channel
}

// ---------------- Messages  ----------------------
function addMessageExtensions(msg) {
    if(msg.type === PROMPT_PUBLISH_MSG_TYPE) {
        msg = addQuickReply(msg)
    }
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

function createMessageId(channelId,user,msgNum) {
    let msgId = "msg"+ID_SEPARATOR+String(user)+ID_SEPARATOR+String(channelId)+ID_SEPARATOR+String(msgNum);
    logger("Generated msg id",msgId);
    return msgId;
}

export function getAllMessages(channel) {
    logger("getting messages for channel",channel.id);
    const channelMsgs = getMessages(channel.id)
    channelMsgs.forEach(function (item, index) {
      logger("channel",channel.title,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: channelMsgs}};
        resolve(result);
    });
    return promise1;
}

function getMessagesSince(channel,msgId) {
    logger("getting messages for channel",channel.id,"since",msgId);
    const channelMsgs = getMessages(channel.id,msgId)
    channelMsgs.forEach(function (item, index) {
      logger("channel",channel.title,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: channelMsgs}};
        resolve(result);
    });
    return promise1;
}


export async function sendMessages(channel,msgs,msgType,userDisplay) {
    await Promise.all(msgs.map(msg => sendMessage(channel,msg.text,msgType,userDisplay)))
}

export async function sendMessage(channel,msgText,msgType,userDisplay,system=false) {
    logger("user",userDisplay.id,"sending",msgText,"to channel",channel.id);
    let msgNum = getMessages(channel.id).length
    let msgId = createMessageId(channel.id,userDisplay.id,msgNum);
    let msgTime = new Date().getTime() + (msgNum%100)
    let msg = createMessage(msgId, msgText, msgType, msgTime, userDisplay,system);
    msg = addMessageExtensions(msg);
    addMessage(channel.id,msg);
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
            values: [{title: 'Yes',value: PROMPT_ACCEPT_CREDENTIAL_MSG_TYPE,}],
        }
    }
    return msg
}

export async function processQuickReply(channel,reply) {
    logger("Processing Quick Reply w/ channel",channel.id,"w/ reply",reply)
    const msgs = []
    if(reply && channel) {
        if(reply[0]["value"] === PROMPT_PUBLISH_MSG_TYPE) {
            const pubChan = await publishChannel(channel);
            await sendMessage(pubChan,pubChan.id+" published to Prism.",
                    TEXT_MSG_TYPE,getUserDisplay(PRISM_BOT))
            await sendMessage(channel,JSON.stringify(getDid(channel.id)),DID_JSON_MSG_TYPE,getUserDisplay(PRISM_BOT),true);
            await sendMessage(channel,
                "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
                BLOCKCHAIN_URI_MSG_TYPE,
                getUserDisplay(PRISM_BOT),true);
            if(demo) {
                createDemoCredential(channel)
            }
        } else {
            logger("reply value was",reply[0]["value"])
        }
    } else {
        logger("reply",reply,"or channel",channel,"were undefined")
    }
}

// ------------------ Credentials ----------

async function createCredential(channel,cred) {
    const credJson = JSON.stringify(cred)
    logger("Sending credJson", credJson)
    isProcessing(true)
    const newWalJson = await PrismModule.issueCred(getWalletJson(), channel.id, credJson);
    saveWallet(JSON.parse(newWalJson))

    await sendMessage(channel,"You have been issued a new credential!",
          STATUS_MSG_TYPE,
          getUserDisplay(ROOTS_BOT))
    await sendMessage(channel,JSON.stringify(getCredential(cred.alias)),
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

function getCredentialAlias(channelId) {
    return channelId + PUBLISHED_PRISM_CHANNEL_CREDENTIAL
}

// ----------------- Polling ------------



// ------------------ Session ---------------
const sessionInfo={};
const sessionState=[];
export function startChatSession(sessionInfo) {
    logger("starting session w/channel",sessionInfo["channel"]);
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
                  BARTENDER_BOT,
                  "Bartender",
                  personLogo)
}

function initializeDemo() {
    initDemoUserDisplays()
    initDemoIntro()
    initDemoAchievements()
    initDemoBartender()
}

function initDemoIntro() {
    const channel = createChannel("Introduction Channel","Under Construction - ")
//    sendMessage(channel,
//        "system message",
//        STATUS_MSG_TYPE,
//        getUserDisplay(PRISM_BOT),true);
}

export function createDemoCredential(channel) {
    const credMsgs = []
    const credAlias = getCredentialAlias(channel.id)
    if(channel["published"] && !getCredential(credAlias)) {
        const didLong = getWallet()[WALLET_DIDS][getWallet()[WALLET_DIDS].length-1][DID_URI_LONG_FORM]
        logger("Creating demo credential for channel",channel.id,"w/long form did",didLong)
        const cred = {
            alias: credAlias,
            issuingDidAlias: channel.id,
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
        createCredential(channel,cred)
        sendMessage(channel,
            "For publishing your channel to Prism, we are issuing you a congratulatory credential :)",
            STATUS_MSG_TYPE,getUserDisplay(ROOTS_BOT))
//        sendMessage(channel,"Valid credential",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
//
//
//        sendMessage(channel,"Credential imported",
//                    STATUS_MSG_TYPE,
//                    getUserDisplay(ROOTS_BOT))
//        sendMessage(channel,"Valid credential.",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
    //    sendMessage(channel,"https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
    //                 BLOCKCHAIN_URI_MSG_TYPE,
    //                 getUserDisplay(PRISM_BOT))
//        sendMessage(channel,"Credential revoked",
//                      STATUS_MSG_TYPE,
//                      getUserDisplay(ROOTS_BOT))
//        sendMessage(channel,"Invalid credential.",
//                    STATUS_MSG_TYPE,
//                    getUserDisplay(ROOTS_BOT))
        return true;
    }
    return false;
}

function initDemoAchievements() {
    const achieveCh = createChannel("Achievement Channel","Under Construction - ")

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

function initDemoBartender() {
    const bartendCh = createChannel("Bartender Channel","Coming Soon - ")
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