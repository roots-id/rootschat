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

export function getMessages() {

}

export function sendMessage() {

}

export function startChatSession() {

}
