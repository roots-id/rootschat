import uuid from 'react-native-uuid';
import generateDID from '../prism'
import { channels,channelsMessages,getDids,wallet } from '../db'
import { NativeModules } from 'react-native'

const PrismModule = NativeModules
const ID_SEPARATOR = "_"

//TODO log public DIDs and/or create Pairwise DIDs
export function createChannel (channelName) {
    const promise1 = new Promise((resolve, reject) => {
        let channelJson = {
            id: PrismModule.newDID(channelName,false),
            joined: true,
            title: channelName,
            type: "DIRECT",
        };
        channels.push(channelJson)
        resolve(channels);
    });
    return promise1;
}

//TODO iterate to verify DID connections if cache is expired
export function getAllChannels () {
    channels.forEach(function (item, index) {
      console.log("getting channels",index+".",item.name);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: channels}};
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

export function getMessages(selectedChannel) {
    console.log("getting messages for channel",selectedChannel.channel.id);
    const channelMsgs = channelsMessages[selectedChannel.channel.id];
    channelMsgs.forEach(function (item, index) {
      console.log("channel",selectedChannel.channel.name,"has message",index+".",item.id);
    });

    const promise1 = new Promise((resolve, reject) => {
        let result = {paginator: {items: channelMsgs}};
        resolve(result);
    });
    return promise1;
}

function createMessage(idText,bodyText,statusText,timeInMillis,userJson) {
    return {
        id: idText,
        body: bodyText,
        type: statusText,
        createdTime: timeInMillis,
        user: userJson,
    }
}

//{
//        channel: channel,
//        body: pendingMessages[0].text,
//      }
export async function sendMessage(channel,messageText,userDisplay) {
//TODO add sender to message
    console.log(userDisplay.id,"sending",messageText,"to channel",channel);
    let msgNum = channelsMessages[channel.id].length
    let msgId = createMessageId(channel.id,userDisplay.id,msgNum);
    let msgType = 'sentText'
    let msgTime = new Date().getTime()
    let msg = createMessage(msgId, messageText, msgType, msgTime, userDisplay);
    channelsMessages[channel.id].push(msg);
    console.log("message sent",msg);
}

function createMessageId(channelId,user,msgNum) {
    console.log("Generating msg id from",user,channelId,msgNum);
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