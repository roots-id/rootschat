import React, { useContext, useEffect, useState } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import { getMessages, sendMessage, startChatSession } from '/roots';
import Loading from '/components/Loading';
import { AuthContext } from '/navigation/AuthProvider';

export default function ChatScreen({ route }) {
  const { user } = useContext(AuthContext);
  const { channel } = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startChatSessionResult = startChatSession({
      channel: channel,
      onReceivedMessage: (message) => {
        setMessages((currentMessages) =>
            GiftedChat.append(currentMessages, [mapMessage(message)])
        );
      },
    });

    getMessages({
      channel: channel,
    })
    .then((result) => {
      setMessages(result.paginator.items.map(mapMessage));

      setLoading(false);
    });

    return startChatSessionResult.session.end;
  }, [user, channel]);

  async function handleSend(pendingMessages) {
    await sendMessage({
      channel: channel,
      body: pendingMessages[0].text,
    });
  }

  function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#d3d3d3',
              },
            }}
        />
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
      <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={mapUser(user)}
          renderBubble={renderBubble}
      />
  );
}

function mapMessage(message) {
  return {
    _id: message.id,
    text: message.body,
    createdAt: new Date(message.createdTime),
    user: mapUser(message.user),
  };
}

function mapUser(user) {
  return {
    _id: user.id,
    name: user.displayName,
    avatar: user.displayPictureUrl,
  };
}