import uuid from 'react-native-uuid';
import { addChannel,addMessage,createUserDisplay,DID_ALIAS,getChannels,getDids,
    getMessages,getUserDisplay,getWallet,newChannel,saveWallet,WALLET_DIDS } from '../db'
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
export const PENDING_STATUS_MESSAGE = "pendingStatus";
export const PROMPT_PUBLISH_MSG_TYPE = "promptPublish";
export const STATUS_MSG_TYPE = "status";
export const CREDENTIAL_JSON_MSG_TYPE = "jsonCredential";
export const TEXT_MSG_TYPE = "text"

export const ACHIEVEMENT_MSG_PREFIX = "You have a new achievement: ";

const ID_SEPARATOR = "_"

const ROOTS_BOT = "RootsWalletBot1"
const PRISM_BOT = "PrismBot1"
const BARTENDER_BOT = "BartenderBot1"

const demo = true
export const currentTime = new Date().getTime();

function logObj(prefixMsg,obj) {
    console.log(prefixMsg,obj.toString().substring(1,25),"...")
}

export function createWallet(walletName,mnemonic,passphrase) {
    saveWallet(JSON.parse(PrismModule.newWal(walletName,mnemonic,passphrase)))
    console.log('Wallet created',getWallet())
}

function getWalletJson() {
    const walJson = JSON.stringify(getWallet())
    logObj('Wallet json retrieved',walJson.substring(1,25))
    return walJson
}

//TODO log public DIDs and/or create Pairwise DIDs
export function createChannel (channelName,titlePrefix) {
    console.log("Creating channel",channelName,"w/ titlePrefix",titlePrefix)
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

export function getUser(userId) {
    console.log("Getting user",userId)
    return getUserDisplay(userId);
}


//TODO iterate to verify DID connections if cache is expired
export function getAllChannels () {
    if(getChannels().length == 0 && demo) {
        initializeDemo()
    }

    getChannels().forEach(function (item, index) {
      console.log("getting channels",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: getChannels()}};
        resolve(result);
    });
    return promise1;
}

export function getChannelDisplayName(channel) {
  console.log("getting channel display name " + channel);
  if (channel.type === 'DIRECT') {
    return channel.members.map((member) => member.displayName).join(', ');
  } else {
    return channel.name;
  }
}

export function getAllMessages(channel) {
    console.log("getting messages for channel",channel.id);
    const channelMsgs = getMessages(channel.id)
    channelMsgs.forEach(function (item, index) {
      console.log("channel",channel.title,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: channelMsgs}};
        resolve(result);
    });
    return promise1;
}

function createMessage(idText,bodyText,statusText,timeInMillis,userDisplayJson) {
    return {
        id: idText,
        body: bodyText,
        type: statusText,
        createdTime: timeInMillis,
        user: userDisplayJson,
    }
}

//{
//        channel: channel,
//        body: pendingMessages[0].text,
//      }
export async function sendMessage(channel,msgText,msgType,userDisplay) {
    console.log("user",userDisplay.id,"sending",msgText,"to channel",channel.id);
    let msgNum = getMessages(channel.id).length
    let msgId = createMessageId(channel.id,userDisplay.id,msgNum);
    let msgTime = new Date().getTime() + (msgNum%100)
    let msg = createMessage(msgId, msgText, msgType, msgTime, userDisplay);
    msg = addMessageExtensions(msg);
    addMessage(channel.id,msg);
    return msg
}

function addMessageExtensions(msg) {
    if(msg.type === PROMPT_PUBLISH_MSG_TYPE) {
        msg = addQuickReply(msg)
    }
    return msg
}

function addQuickReply(msg) {
    if(msg.type === PROMPT_PUBLISH_MSG_TYPE) {
        msg["quickReplies"] = {type: 'checkbox',keepIt: true,
            values: [{title: 'Yes',value: PROMPT_PUBLISH_MSG_TYPE,},{title: 'No',value: 'no',}],
        }
    }
    return msg
}

export async function processQuickReply(channel,reply) {
    console.log("Processing Quick Reply w/ channel",channel.id,"w/ reply",reply)
    if(reply && channel) {
        if(reply[0]["value"] === PROMPT_PUBLISH_MSG_TYPE) {
            console.log("Publishing DID",channel.id,"to PRISM")
            //PrismModule.publishDid(getWalletJson, channel.id);
            await getFakePromise(10000)
        } else {
            console.log("reply value was",reply[0]["value"])
        }
    } else {
        console.log("reply",reply,"or channel",channel,"were null")
    }
}

//export function pendingQuickReplyMessage(channel,reply) {
//    console.log("channel",channel,"reply",reply)
//    sendMessage(channel,"Processing....",PENDING_STATUS_MESSAGE,getUserDisplay(ROOTS_BOT))
//}

export function getQuickReplyResultMessage(channel,reply) {
    console.log("getting quick reply result message for channel",channel,"w/ reply",reply)
     const msgId = createMessageId(channel.id,getUserDisplay(PRISM_BOT).id,getMessages(channel.id).length)
     const msg = createMessage(msgId, channel.id+" published",
                   STATUS_MSG_TYPE,new Date().getTime() + (getMessages(channel.id).length%100),getUserDisplay(PRISM_BOT))
     addMessage(channel.id,msg)
     return msg
}

function createMessageId(channelId,user,msgNum) {
    let msgId = "msg"+ID_SEPARATOR+String(user)+ID_SEPARATOR+String(channelId)+ID_SEPARATOR+String(msgNum);
    console.log("Generated msg id",msgId);
    return msgId;
}

const sessionInfo={};
const sessionState=[];
export function startChatSession(sessionInfo) {
    console.log("starting session",sessionInfo);
    return {session: {end: "session ended"}}
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

    sendMessage(channel,"https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=1f4f19f2016c4468777da24a5656b9b009550a601192960e22f1233af4e8b3ef",
                  BLOCKCHAIN_URI_MSG_TYPE,
                  getUserDisplay(PRISM_BOT))
    sendMessage(channel,JSON.stringify({alias: "holder_did",
                      didIdx: 0,
                      uriCanonical: "did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d",
                      uriLongForm: "did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d:Cj8KPRI7CgdtYXN0ZXIwEAFKLgoJc2VjcDI1NmsxEiEDA7B2nZ_CvcIdkU2ovzBEovGzjwZECMUeHUeNo5_0Jug",
                      operationHash: "",
                      keyPairs: [
                          {
                              keyId: "master0",
                              didIdx: 0,
                              keyType: 0,
                              keyIdx: 0,
                              privateKey: "9c2a64d860cb86ce0af23787fccd2ad12a73d5e758c706d8567de49dec2ec029",
                              publicKey: "0403b0769d9fc2bdc21d914da8bf3044a2f1b38f064408c51e1d478da39ff426e884c34858bcfa2afbd3cc4e4b1a8d3fc848b74f92360e91729aaf8d77d8207963",
                              revoked: false
                          }
                      ]
                  }),
                 "jsonDid",
                  getUserDisplay(PRISM_BOT))
    sendMessage(channel,"https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
                  BLOCKCHAIN_URI_MSG_TYPE,
                  getUserDisplay(PRISM_BOT))
    sendMessage(channel,"Credential issued",
                  STATUS_MSG_TYPE,
                  getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"Valid credential",
                  STATUS_MSG_TYPE,
                  getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"Credential exported",
                  STATUS_MSG_TYPE,
                  getUserDisplay(ROOTS_BOT))
    sendMessage(channel,JSON.stringify({
                       encodedSignedCredential: "eyJpZCI6ImRpZDpwcmlzbTozYWU4YmFkYzAzMWEzZjU2YjlmYzZiNWEwMmVhNDczNWJmY2RmM2I5ODFkODc4NjBkNWMxNjkzYzBkODA2OGJiIiwia2V5SWQiOiJpc3N1aW5nMCIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7Im5hbWUiOiJBbGljZSIsImRlZ3JlZSI6IkNvbXB1dGVyIFNjaWVuY2UiLCJkYXRlIjoiMjAyMi0wMy0xMCAxNzoxNjo1OCIsImlkIjoiZGlkOnByaXNtOjY1NGE0YTkxMTNlNzYyNTA4N2ZkMGQzMTQzZmNhYzA1YmEzNDAxM2M1NWUxYmUxMmRhYWRkMmQ1MjEwYWRjNGQ6Q2o4S1BSSTdDZ2R0WVhOMFpYSXdFQUZLTGdvSmMyVmpjREkxTm1zeEVpRURBN0IyblpfQ3ZjSWRrVTJvdnpCRW92R3pqd1pFQ01VZUhVZU5vNV8wSnVnIn19.MEUCIQC8WiVfl6nH-DIBdK9SN0SzqYNN49WnuECk77V8-vUIQwIgHLZUkCRivnv7NiIurd2YR5MWjUUIbbKHDJovnbexeNI",
                       proof: {
                           "hash": "bbb3fee220db35c2fc717ca61e0e55e2f670cfb238ff0484ea768dd1aaf23522",
                           "index": 0,
                           "siblings": [
                           ]
                       }
                    }),
                    CREDENTIAL_JSON_MSG_TYPE,
                    getUserDisplay(PRISM_BOT))
    sendMessage(channel,"Credential imported",
                STATUS_MSG_TYPE,
                getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"Valid credential.",
                  STATUS_MSG_TYPE,
                  getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
                 BLOCKCHAIN_URI_MSG_TYPE,
                 getUserDisplay(PRISM_BOT))
    sendMessage(channel,"Credential revoked",
                  STATUS_MSG_TYPE,
                  getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"Invalid credential.",
                STATUS_MSG_TYPE,
                getUserDisplay(ROOTS_BOT))
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

export async function getFakePromiseAsync(timeoutMillis) {
    console.log("using fake promise async");
    await getFakePromise(timeoutMillis)
}

export function getFakePromise(timeoutMillis) {
    console.log("using fake promise");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved!');
      }, timeoutMillis);
    });
}