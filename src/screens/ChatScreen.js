import React, { useContext, useEffect, useState } from 'react';
import { Bubble, ChatInput, Composer, GiftedChat, InputToolbar, Message, SendButton } from 'react-native-gifted-chat';
import { NativeModules, View } from 'react-native';

import { getMessages, sendMessage, startChatSession } from '../roots';
import { BLOCKCHAIN_URI_MSG_TYPE, userDisplay } from '../db'
import Loading from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';

const { PrismModule } = NativeModules;

import emojiUtils from 'emoji-utils';
import SlackMessage from '../components/SlackMessage';

export default function ChatScreen({ route }) {
  //useContext(AuthContext)
//  {id: "esteban",
//                      displayName: "Essbante",
//                      displayPictureUrl:"https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280",
//                      }
//  const [ user, setUser ] = useState(user);
  const { channel } = route.params;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

//    const startChatSessionResult = startChatSession({
//      channel: channel,
//      onReceivedMessage: (message) => {
//        setMessages((currentMessages) =>
//            GiftedChat.append(currentMessages, [mapMessage(message)])
//        );
//      },
//    });
    getMessages({
      channel: channel,
    })
    .then((result) => {
      setMessages(result.paginator.items.map(mapMessage));

      setLoading(false);
    });
//    return startChatSessionResult.session.end;
  }, [channel]);

//    //body: PrismModule.createDID(pendingMessages[0].text),
  async function handleSend(pendingMessages) {
    await sendMessage(channel, pendingMessages[0].text,userDisplay);
    setMessages((prevMessages) => GiftedChat.append(prevMessages, pendingMessages));
  }

  const onSend = (newMessages = []) => {

  };

  function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: '#fad58b',
                color: '#222222',
              },
            }}
        />
    );
  }

    function renderInputToolbar(props) {
      return (
          <InputToolbar
              {...props}
                  containerStyle={{
                    backgroundColor: "#222222",
                    borderTopColor: "#dddddd",
                    borderTopWidth: 1,
                    padding: 1,
                  }}
                  textInputStyle={{ color: "white"}}
          />
      );
    }

  function renderSystemMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      }
    }

    return (
            <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: '#4fcc96',
                    color: '#222222',
                  },
                }}
            />
        );
  }

//  function renderMessageImage(props) {
//    console.log("Rendering message image",props);
//    return (
//      <MessageImage
//        {...props}
//        style={styles.image}
//        source={require('../assets/LogoOnly1024.png')}
//      />
//    )
//  }

  if (loading) {
    return <Loading />;
  }


  return (
    <View style={{ backgroundColor: "#222222", flex: 1, display: "flex",}}>
      <GiftedChat
          messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
          onSend={handleSend}
          renderBubble={renderBubble}
          renderSystemMessage={renderSystemMessage}
          renderInputToolbar={renderInputToolbar}
          renderAllAvatars={true}
          renderAvatarOnTop={true}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          user={mapUser(userDisplay)}
      />
    </View>
  );
}

function mapMessage(message) {
  //console.log("Map message for gifted",message);
  return {
    _id: message.id,
    text: message.body,
    createdAt: new Date(message.createdTime),
    user: mapUser(message.user),
    ...(message.type === BLOCKCHAIN_URI_MSG_TYPE) && {system: true},
  };
}

function mapUser(user) {
  //console.log("Map User for gifted",user);
  return {
    _id: user.id,
    name: user.displayName,
    avatar: user.displayPictureUrl,
  };
}