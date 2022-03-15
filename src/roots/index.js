const members1 = [
    {
      displayName: "jim",
    },
]

const channels = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      joined: true,
      members: members1,
      name: "Channel 1",
      title: "First Channel",
      type: "DIRECT",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      joined: true,
      members: [],
      name: "Channel 2",
      title: "Second Channel",
      type: "PUBLIC",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      joined: true,
      name: "Channel 3",
      title: "Third Channel",
      type: "OTHER",
    },
    {
      id: "69704a0f-3da1-471f-bd96-145571da8c61",
      joined: false,
      name: "Channel 4",
      title: "Fourth Channel",
      type: "DIRECT",
    },
];

const users = [
    {
        id: "lance",
        displayName: "MeGrimLance",
        displayPictureUrl:"https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280",
    },
    {
        id: "esteban",
        displayName: "Essbante",
        displayPictureUrl:"https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280",
    },
];

const ch1Messages = [
    {
      id: "message1",
      body: "Can i send you a credential",
      type: "text",
      createdTime: "1",
      user: users[0],
    },
    {
      id: "message2",
      body: "sure!",
      type: "text",
      createdTime: "2",
      user: users[1],
    },
    {
      id: "message3",
      body: "VC1",
      type: "credential",
      createdTime: "3",
      user: users[0],
    },
];

const channelsMessages = []
channelsMessages[channels[0].id] = ch1Messages;

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

export function sendMessage() {

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
