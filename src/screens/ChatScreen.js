import React, { useContext, useEffect, useState } from 'react';
import { Bubble, ChatInput, Composer, GiftedChat, InputToolbar, Message, SendButton } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, NativeModules, StyleSheet, Text, View } from 'react-native';
//import { Video, VideoPlayer } from 'react-native-video'
//import { useInterval } from 'usehooks-ts'
//import { BarCodeScanner } from 'expo-barcode-scanner';
//import emojiUtils from 'emoji-utils';

import { BLOCKCHAIN_URI_MSG_TYPE, createDemoCredential, CREDENTIAL_JSON_MSG_TYPE, getAllMessages,
    getChat, getFakePromise,
    getFakePromiseAsync, getQuickReplyResultMessage, getUser, isDemo, isProcessing,
    processQuickReply,
    PROMPT_PUBLISH_MSG_TYPE, PUBLISHED_TO_PRISM, sendMessage, sendMessages, startChatSession,
    STATUS_MSG_TYPE, TEXT_MSG_TYPE } from '../roots';
import Loading from '../components/Loading';
import SlackMessage from '../components/SlackMessage';

const { PrismModule } = NativeModules;

export default function ChatScreen({ route }) {
    console.log("route params",route.params)
//  const [ user, setUser ] = useState(user);
    const chat = getChat(route.params.chatId);
//    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [madeCredential, setMadeCredential] = useState(false)
    const [messages, setMessages] = useState([]);
    const [processing, setProcessing] = useState(false)
//    const [scanned, setScanned] = useState(false);
    const [showSystem, setShowSystem] = useState(false)

    useEffect(() => {
        const chatSession = startChatSession({
            chat: chat,
            onReceivedMessage: (message) => {
                setMessages((currentMessages) =>
                    GiftedChat.append(currentMessages, [mapMessage(message)])
                );
            },
            onReceivedKeystrokes: (keystrokes) => {
             // handle received typing keystrokes
            },
            onTypingStarted: (user) => {
                //handle typing
            },
            onTypingStopped: (user) => {
             // handle user stops typing
            },
            onParticipantEnteredChat: (user) => {
             // handle user who just entered the chat
            },
            onParticipantLeftChat: (user) => {
             // handle user who just left the chat
            },
            onParticipantPresenceChanged: (user) => {
             // handle user who became online, offline, do not disturb, invisible
            },
            onMessageRead: (message, receipt) => {
             // handle read receipt for message
            },
            onMessageUpdated: (message) => {
             // handle message changes
            },
            onChatUpdated: (chat) => {
             // handle chat changes
            },
            onProcessing: (processing) => {
                setProcessing(processing)
            },
        });
        if (chatSession.succeeded) {
            const session = chatSession.session; // Handle session
        }
        if (chatSession.failed) {
            const error = chatSession.error; // Handle error
        }
        getAllMessages(chat.id)
        .then((result) => {
            setMessages(result.paginator.items.map(mapMessage));
            setLoading(false);
        });
        return chatSession.end;
    }, [chat]);

    useEffect(() => {
        //console.log("Front-end messages updated")
    }, [messages]);

    useEffect(() => {
        console.log("Checked Processing")
    }, [processing]);

    useEffect(() => {
            console.log("Show system")
            getAllMessages(chat.id)
                    .then((result) => {
                        setMessages(result.paginator.items.map(mapMessage));
                        setLoading(false);
                    });
    }, [showSystem]);

//    useEffect(() => {
//        (async () => {
//          const { status } = await BarCodeScanner.requestPermissionsAsync();
//          setHasPermission(status === 'granted');
//        })();
//    }, []);
//      const handleBarCodeScanned = ({ type, data }) => {
//        setScanned(true);
//        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
//      };
//
//      if (hasPermission === null) {
//        return <Text>Requesting for camera permission</Text>;
//      }
//      if (hasPermission === false) {
//        return <Text>No access to camera</Text>;
//      }
//      <BarCodeScanner
//          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//          style={StyleSheet.absoluteFillObject}
//        />
//        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}

//    if(isDemo) {
//        // polling to generate credential
//        useInterval(async () => {
//            console.log("Polling to create credentials");
//            setMadeCredential(createDemoCredential(chat,madeCredential))
//            if(madeCredential) {
//                let pendingMsgs = []
//                if(messages.length > 0) {
//                    pendingMsgs = getMessagesSince(chat,messages[messages.length-1]["id"]).resolve()
//                } else {
//                    pendingMsgs = getAllMessages(chat).resolve()
//                }
//                await setMessages((prevMessages) =>
//                    GiftedChat.append(prevMessages,pendingMsgs.map((pendingMsg) => mapMessage(pendingMsg))));
//                setMessages(messages.concat[pendingMsgs)
//            }
//        }, madeCredential ? null : 5000,);
//    }

    async function handleSend(pendingMsgs) {
        const result = await sendMessages(chat, pendingMsgs, TEXT_MSG_TYPE, getUser(chat.id));
//        await setMessages((prevMessages) => GiftedChat.append(prevMessages, pendingMsgs));
    }

    //getFakePromiseAsync(10000);
//processQuickReply(chat,reply)
    async function handleQuickReply(reply) {
        const result = await processQuickReply(chat,reply)
        console.log("Quick Reply processing complete",result)
//        await setMessages((prevMessages) =>
//                GiftedChat.append(prevMessages,resultMessages.map((resultMessage) => mapMessage(resultMessage))));
    }

//#fad58b
  function renderBubble(props) {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                  left: {
                    backgroundColor: '#251520',
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
//            textProps={{
//                            style: {
//                              color: props.position === 'left' ? '#fff' : '#000',
//                            },
//                        }}
        />
    );
  }

    function getSource(message) {
        if (message && message.currentMessage) {
          return message.currentMessage.audio ? message.currentMessage.audio : message.currentMessage.video ? message.currentMessage.video : null;
        }
        return null;
    }

//    function renderVideo(message) {
//      const source = getSource(message);
//      if (source) {
//        return (
//          <View style={styles.videoContainer} key={message.currentMessage._id}>
//            {Platform.OS === 'ios' ? <Video
//              style={styles.videoElement}
//              shouldPlay
//              height={156}
//              width={242}
//              muted={true}
//              source={{ uri: source }}
//              allowsExternalPlayback={false}></Video> : <VideoPlayer
//              style={styles.videoElement}
//              source={{ uri: source }}
//            />}
//          </View>
//        );
//      }
//      return <></>;
//    };

    function renderInputToolbar(props) {
      return (
          <InputToolbar
              {...props}
                  containerStyle={{
                    backgroundColor: "#302025",
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
//                  {
//                    pattern: /#(\w+)/,
//                    style: styles.url,
//                    onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
//                  },
  return (
    <View style={{ backgroundColor: "#251520", flex: 1, display: "flex",}}>
      <GiftedChat
          isTyping={processing}
          messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
          onQuickReply={reply => handleQuickReply(reply)}
          onSend={messages => handleSend(messages)}
          parsePatterns={(linkStyle) => [
                  {
                      pattern: /published to Prism/,
                      style: styles.prism,
                      onPress: (tag) => setShowSystem(!showSystem),
                  },
                  //{type: 'url', style: styles.url, onPress: onUrlPress},
                ]}

          renderInputToolbar={props => renderInputToolbar(props)}
          renderAllAvatars={true}
          renderAvatarOnTop={true}
          renderBubble={renderBubble}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          user={mapUser(getUser(chat.id))}
      />
    </View>
  );
  //      {
    //        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
    //      }

  //,      ...(message.type === BLOCKCHAIN_URI_MSG_TYPE) && {system: true}
  //<Text onPress={() => { alert('hello')}} style={{ fontStyle:'italic',color: 'red' }}>{}</Text>
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
      if(message["system"]) {
        mappedMsg["system"] = (message.system)
        if(!showSystem) {
            mappedMsg["text"] = "more details available"
        }
      }
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
    prism: {
      color: 'red',
    },
    url: {
      color: 'red',
      textDecorationLine: 'underline',
    },
    email: {
      textDecorationLine: 'underline',
    },

    text: {
      color: 'blue',
      fontSize: 15,
    },

    phone: {
      color: 'blue',
      textDecorationLine: 'underline',
    },

    name: {
      color: 'red',
    },

    username: {
      color: 'green',
      fontWeight: 'bold',
    },

    magicNumber: {
      fontSize: 42,
      color: 'pink',
    },

    hashTag: {
      fontStyle: 'italic',
    },
});