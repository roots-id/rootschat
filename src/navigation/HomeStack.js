import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { IconButton, Title } from 'react-native-paper';

import ChatScreen from '../screens/ChatScreen';
import CreateChannelScreen from '../screens/CreateChannelScreen';
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
        <ModalStack.Screen name="Create Secure Channel" component={CreateChannelScreen} />
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
                    name="Secure Channels:"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                      headerRight: () => (
                          <IconButton
                              icon="plus"
                              size={28}
                              color="#e69138"
                              onPress={() => navigation.navigate('Create Secure Channel')}
                          />
                      ),
                    })}
                />
        <ChatStack.Screen
                    name="Secure Messages:"
                    component={ChatScreen}
                    options={({ route }) => ({
                      title: route.params.channel.title,
                    })}
                />
      </ChatStack.Navigator>
  );
}