import uuid from 'react-native-uuid';
import { addChannel,addMessage,createUserDisplay,DID_ALIAS,getChannels,getDids,
    getMessages,getUserDisplay,getWallet,newChannel,saveWallet,WALLET_DIDS } from '../db'
import PrismModule from '../prism'

import rwLogo from '../assets/LogoOnly1024.png'
import perLogo from '../assets/smallBWPerson.png'
import apLogo from '../assets/ATALAPRISM.jpeg'
//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;
export const personLogo = perLogo;
export const prismLogo = apLogo;

export const BLOCKCHAIN_URI_MSG_TYPE = "blockchainUri";
export const PROMPT_PUBLISH_MSG_TYPE = "promptPublish";
export const STATUS_MSG_TYPE = "status";
export const CREDENTIAL_JSON_MSG_TYPE = "jsonCredential";
export const TEXT_MSG_TYPE = "text"

export const ACHIEVEMENT_MSG_PREFIX = "You have a new achievement: ";

const ID_SEPARATOR = "_"

const ROOTS_BOT = "RootsWalletBot1"
const PRISM_BOT = "PrismBot1"
const BARTENDER_BOT = "BartenderBot1"

let wallet = getWallet();
const demo = true
export const currentTime = new Date().getTime();

export function createWallet(walletName,mnemonic,passphrase) {
    wallet = JSON.parse(PrismModule.newWal(walletName,mnemonic,passphrase))
    saveWallet(wallet);
    console.log('Wallet created',wallet)
}

//TODO log public DIDs and/or create Pairwise DIDs
export function createChannel (channelName,titlePrefix) {
    console.log("Creating channel",channelName,"w/ titlePrefix",titlePrefix)
    wallet = JSON.parse(PrismModule.newDID(JSON.stringify(wallet),channelName))
    const newDid = wallet[WALLET_DIDS][wallet[WALLET_DIDS].length-1];
    createUserDisplay(newDid[DID_ALIAS],"You",personLogo)
    let newCh = newChannel(newDid[DID_ALIAS],titlePrefix)
    sendMessage(newCh,"Welcome to the "+newDid[DID_ALIAS],TEXT_MSG_TYPE+" :)",getUserDisplay(ROOTS_BOT))
    sendMessage(newCh,"DID Created", PROMPT_PUBLISH_MSG_TYPE,getUserDisplay(PRISM_BOT))
    return newCh
}

export function getUser(userId) {
    console.log("Getting user",userId)
    return getUserDisplay(userId);
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

    let achieveCh = createChannel("Achievement Channel","Under Construction - ")
    let bartendCh = createChannel("Bartender Channel","Coming Soon - ")

    initDemoAchievementMsgs(achieveCh)
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

function initDemoAchievementMsgs(channel) {
    sendMessage(channel,ACHIEVEMENT_MSG_PREFIX+"Opened RootsWallet!",
      STATUS_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(channel,ACHIEVEMENT_MSG_PREFIX+"Clicked Example!",
      STATUS_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
    sendMessage(channel,"{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      CREDENTIAL_JSON_MSG_TYPE,
      getUserDisplay(ROOTS_BOT))
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
    await new Promise(r => setTimeout(r, 1000));
    console.log("user",userDisplay,"sending",msgText,"to channel",channel);
    let msgNum = getMessages(channel.id).length
    let msgId = createMessageId(channel.id,userDisplay.id,msgNum);
    let msgTime = new Date().getTime()
    let msg = createMessage(msgId, msgText, msgType, msgTime, userDisplay);
    addMessage(channel.id,msg);
    console.log("message sent",msg);
}

function createMessageId(channelId,user,msgNum) {
    let msgId = "msg"+ID_SEPARATOR+String(user)+ID_SEPARATOR+String(channelId)+ID_SEPARATOR+String(msgNum);
    console.log("Generated msg id",msgId);
    return msgId;
}

//     {
//        channel: channel,
//        onReceivedMessage: (message) => {
//          setMessages((currentMessages) =>
//              GiftedChat.append(currentMessages, [mapMessage(message)])
//          );
//        },
//      }
const sessionInfo={};
const sessionState=[];
export function startChatSession(sessionInfo) {
    console.log("starting session",sessionInfo);
    return {session: {end: "session ended"}}
}