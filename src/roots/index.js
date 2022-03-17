import rwLogo from '../assets/LogoOnly1024.png'
import personLogo from '../assets/smallBWPerson.png'

const members1 = [
    {
      displayName: "jim",
    },
]

const channels = [
    {
      id: "1",
      joined: true,
      members: members1,
      name: "Channel 1",
      title: "Achievements Example",
      type: "DIRECT",
    },
    {
      id: "2",
      joined: true,
      members: [],
      name: "Channel 2",
      title: "Bartender Example",
      type: "PUBLIC",
    },
    {
      id: "3",
      joined: true,
      name: "Channel 3",
      title: "Reputation Example",
      type: "OTHER",
    },
    {
      id: "4",
      joined: false,
      name: "Channel 4",
      title: "Revoked Credential Example",
      type: "DIRECT",
    },
];

//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;

const users = [
    {
        id: "RootsWalletBot1",
        displayName: "RootsWallet",
        displayPictureUrl: rwLogo,
    },
    {
        id: "TestUser1",
        displayName: "TestUser",
        displayPictureUrl: personLogo,
    },
];

export function getFakeUser() {
    return users[1];
}

export function getRootsWalletUser() {
    return users[0];
}

const achievementMsgs = [
    {
      id: "message1",
      body: "Achievement: Opened RootsWallet!",
      type: "text",
      createdTime: "1",
      user: users[0],
    },
    {
      id: "message2",
      body: "{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      type: "jsonCredential",
      createdTime: "2",
      user: users[0],
    },
    {
      id: "message3",
      body: "Achievement: Clicked Example",
      type: "text",
      createdTime: "3",
      user: users[0],
    },
    {
      id: "message4",
      body: "{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      type: "jsonCredential",
      createdTime: "4",
      user: users[0],
    },
];

const channelsMessages = []
channelsMessages[channels[0].id] = achievementMsgs;

//TODO log public DIDs and/or create Pairwise DIDs
export function createChannel (channel) {
    const promise1 = new Promise((resolve, reject) => {
        channels.push(channel)
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

//{
//        channel: channel,
//        body: pendingMessages[0].text,
//      }
export function sendMessage(newMessage) {
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
