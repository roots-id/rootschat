

export function getAllChannels () {
    const promise1 = new Promise((resolve, reject) => {
        //TODO iterate over VC and DID issuers and cache them
          let items = [
            {
              id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
              title: "First Channel",
              joined: true,
              type: "DIRECT",
            },
            {
              id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
              title: "Second Channel",
              joined: true,
              type: "OTHER",
            },
            {
              id: "58694a0f-3da1-471f-bd96-145571e29d72",
              title: "Third Channel",
              joined: true,
            },
          ];
          let result = {paginator: items};
        resolve(result);
    });
    return promise1;
}

export function getChannelDisplayName(channel) {
  if (channel.type === 'DIRECT') {
    return channel.members.map((member) => member.displayName).join(', ');
  } else {
    return channel.name;
  }
}
