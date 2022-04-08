import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import ChatScreen from '../screens/ChatScreen';
import StartChatScreen from '../screens/StartChatScreen';
import HomeScreen from '../screens/HomeScreen';

import {getChat} from '../roots'

const ChatStack = createStackNavigator();
//const ModalStack = createStackNavigator();

//our colors
//green #1c9963
//yellow #e69138
//purple #5b3a70
//glowingblack #312a1f
//            cardStyleInterpolator: forSlide,

export default function HomeStack() {
  return (
//      <ModalStack.Navigator presentation="modal" headerShown="false">
//        <ModalStack.Screen name="RootsWallet - Chat Prototype" component={ChatComponent} />
//        <ModalStack.Screen name="Create Secure Chat" component={StartChatScreen} />
//      </ModalStack.Navigator>
//  );
//}

//const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
//  const progress = Animated.add(
//    current.progress.interpolate({
//      inputRange: [0, 1],
//      outputRange: [0, 1],
//      extrapolate: 'clamp',
//    }),
//    next
//      ? next.progress.interpolate({
//          inputRange: [0, 1],
//          outputRange: [0, 1],
//          extrapolate: 'clamp',
//        })
//      : 0
//  );

//  return {
//    cardStyle: {
//      transform: [
//        {
//          translateX: Animated.multiply(
//            progress.interpolate({
//              inputRange: [0, 1, 2],
//              outputRange: [
//                screen.width, // Focused, but offscreen in the beginning
//                0, // Fully focused
//                screen.width * -0.3, // Fully unfocused
//              ],
//              extrapolate: 'clamp',
//            }),
//            inverted
//          ),
//        },
//      ],
//    },
//  };
//};
//
//function ChatComponent() {
//  return (
      <ChatStack.Navigator

          screenOptions={{
            headerStyle: {
              backgroundColor: '#150510',
            },
            headerTintColor: '#eeeeee',
            headerTitleStyle: {
              fontSize: 22,
            },
            gestureEnabled: true,
            gestureDirection: "horizontal",
            cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,
            animationEnabled: true,
          }}

      >
        <ChatStack.Group>
            <ChatStack.Screen
                        name="Chats"
                        component={HomeScreen}
                        options={ ({ navigation, route }) => ({
                            headerTitle: (props) => <LogoTitle {...props} title="Secure Chats:"/>,
                            headerRight: () =>
                              <IconButton
                                  icon="plus"
                                  size={28}
                                  color="#e69138"
                                  onPress={() => navigation.navigate('Create Secure Chat')}
                              />,
                        })}

                        //                    () => ({
                    />
            <ChatStack.Screen
                        name="Chat"
                        component={ChatScreen}
                        options={({ route }) => ({
                            headerTitle: (props) => <LogoTitle {...props} title={getChat(route.params.chatId).title}/>
                        })}
                    />
        </ChatStack.Group>
        <ChatStack.Group screenOptions={{ presentation: 'modal' }}>
            <ChatStack.Screen name="Create Secure Chat" component={StartChatScreen} />
        </ChatStack.Group>
      </ChatStack.Navigator>
  );
}

function LogoTitle(...props) {
  return (
    <React.Fragment>
        <View style={{flexDirection:'row',}}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../assets/LogoOnly1024.png')}
        />

            <Text style={{ color: '#ff9138',fontSize: 22,fontWeight: 'normal',textAlignVertical: "center",textAlign: "center", }}>
                {props[0]["title"]}
            </Text>
        </View>
    </React.Fragment>
    //{getChat(route.params.chatId).title}
  );
}

