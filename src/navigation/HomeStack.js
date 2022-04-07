import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { IconButton, Title } from 'react-native-paper';

import ChatScreen from '../screens/ChatScreen';
import StartChatScreen from '../screens/StartChatScreen';
import HomeScreen from '../screens/HomeScreen';

const ChatStack = createStackNavigator();
const ModalStack = createStackNavigator();

//our colors
//green #1c9963
//yellow #e69138
//purple #5b3a70
//glowingblack #312a1f

export default function HomeStack() {
  return (
      <ModalStack.Navigator presentation="modal" headerShown="false">
        <ModalStack.Screen name="RootsWallet - Chat Prototype" component={ChatComponent} />
        <ModalStack.Screen name="Create Secure Chat" component={StartChatScreen} />
      </ModalStack.Navigator>
  );
}

function ChatComponent() {
  return (
      <ChatStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#20190e',
            },
            headerTintColor: '#eeeeee',
            headerTitleStyle: {
              fontSize: 22,
            },
          }}
      >
        <ChatStack.Screen
                    name="Secure Chats:"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                      headerRight: () => (
                          <IconButton
                              icon="plus"
                              size={28}
                              color="#e69138"
                              onPress={() => navigation.navigate('Create Secure Chat')}
                          />
                      ),
                    })}
                />
        <ChatStack.Screen
                    name="Secure Messages:"
                    component={ChatScreen}
                    options={({ route }) => ({
                      title: route.params.chat.title,
                    })}
                />
      </ChatStack.Navigator>
  );
}