import React, { useContext, useEffect, useState } from 'react';
import { Bubble, ChatInput, Composer, GiftedChat, InputToolbar, Message, SendButton } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, NativeModules, StyleSheet, View } from 'react-native';
import { Video, VideoPlayer } from 'react-native-video'

import { BLOCKCHAIN_URI_MSG_TYPE, CREDENTIAL_JSON_MSG_TYPE, getAllMessages, getFakePromise,
    getFakePromiseAsync, getQuickReplyResultMessage, getUser, processQuickReply,
    PROMPT_PUBLISH_MSG_TYPE, sendMessage, startChatSession, STATUS_MSG_TYPE, TEXT_MSG_TYPE } from '../roots';
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
    getAllMessages(channel)
    .then((result) => {
      setMessages(result.paginator.items.map(mapMessage));
      setLoading(false);
    });
//    return startChatSessionResult.session.end;
  }, [channel]);

//    //body: PrismModule.createDID(pendingMessages[0].text),
    async function handleSend(pendingMessages) {
        await sendMessage(channel, pendingMessages[0].text, TEXT_MSG_TYPE, getUser(channel.id));
        await setMessages((prevMessages) => GiftedChat.append(prevMessages, pendingMessages));
    }

    //getFakePromiseAsync(10000);
//processQuickReply(channel,reply)
    async function handleQuickReply(reply) {
        await processQuickReply(channel,reply)
        await setMessages((prevMessages) =>
                GiftedChat.append(prevMessages,mapMessage(getQuickReplyResultMessage(channel,reply))));
    }

//#fad58b
  function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                  left: {
                    backgroundColor: '#222222',
                  },
                }}
            textProps={{
                style: {
                  color: props.position === 'left' ? '#fff' : '#000',
                },
            }}
            textStyle={{
                left: {
                  color: '#fff',
                },
                right: {
                  color: '#000',
                },
            }}
        />
    );
  }

    function getSource(message) {
        if (message && message.currentMessage) {
          return message.currentMessage.audio ? message.currentMessage.audio : message.currentMessage.video ? message.currentMessage.video : null;
        }
        return null;
    }

    function renderVideo(message) {
      const source = getSource(message);
      if (source) {
        return (
          <View style={styles.videoContainer} key={message.currentMessage._id}>
            {Platform.OS === 'ios' ? <Video
              style={styles.videoElement}
              shouldPlay
              height={156}
              width={242}
              muted={true}
              source={{ uri: source }}
              allowsExternalPlayback={false}></Video> : <VideoPlayer
              style={styles.videoElement}
              source={{ uri: source }}
            />}
          </View>
        );
      }
      return <></>;
    };

    function renderInputToolbar(props) {
      return (
          <InputToolbar
              {...props}
                  containerStyle={{
                    backgroundColor: "#333333",
                    borderTopColor: "#dddddd",
                    borderTopWidth: 1,
                    padding: 1,
                  }}
                  textInputStyle={{ color: "white"}}
          />
      );
    }

//  function renderSystemMessage(props) {
//    const {
//      currentMessage: { text: currText },
//    } = props
//
//    let messageTextStyle
//
//    // Make "pure emoji" messages much bigger than plain text.
//    if (currText && emojiUtils.isPureEmojiString(currText)) {
//      messageTextStyle = {
//        fontSize: 28,
//        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
//        lineHeight: Platform.OS === 'android' ? 34 : 30,
//      }
//    }

//#4fcc96
//    return (
//            <Bubble
//                {...props}
//                wrapperStyle={{
//                  left: {
//                    backgroundColor: '#4fcc96',
//                    color: '#222222',
//                    fontWeight: 'bold',
//                  },
//                }}
//                textStyle={{ color: "white"}}
//            />
//        );
//  }

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

//renderSystemMessage={renderSystemMessage}
//renderMessageVideo={renderVideo}
//{
//                                  type: "url",
//                                  style: styles.bigBlue,
//                                  onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
//                                }
  return (
    <View style={{ backgroundColor: "#222222", flex: 1, display: "flex",}}>
      <GiftedChat
          messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
          onQuickReply={reply => handleQuickReply(reply)}
          onSend={messages => handleSend(messages)}
          parsePatterns={(linkStyle) => [
                  {
                    pattern: /#(\w+)/,
                    style: linkStyle,
                    onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
                  },
                ]}
          renderBubble={props => renderBubble(props)}
          renderInputToolbar={props => renderInputToolbar(props)}
          renderAllAvatars={true}
          renderAvatarOnTop={true}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          user={mapUser(getUser(channel.id))}
      />
      {
        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
      }
    </View>
  );
}

//,      ...(message.type === BLOCKCHAIN_URI_MSG_TYPE) && {system: true}
function mapMessage(message) {
  //console.log("Map message for gifted",message);
  mappedMsg={}
  mappedMsg["_id"] = message.id
  mappedMsg["text"] = message.body
  mappedMsg["createdAt"] = new Date(message.createdTime)
  mappedMsg["user"] = mapUser(message.user)
  if(message["quickReplies"]) {
      mappedMsg["quickReplies"] = message["quickReplies"]
  }
  mappedMsg["type"] = message.type
    //image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
    // You can also add a video prop:
    //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    // Mark the message as sent, using one tick
    //sent: true,
    // Mark the message as received, using two tick
    //received: true,
    // Mark the message as pending with a clock loader
    //pending: true,
    // Any additional custom parameters are passed through
  return mappedMsg;
}

function mapUser(user) {
  //console.log("Map User for gifted",user);
  return {
    _id: user.id,
    name: user.displayName,
    avatar: user.displayPictureUrl,
  };
}

const styles = StyleSheet.create({
  videoContainer: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});