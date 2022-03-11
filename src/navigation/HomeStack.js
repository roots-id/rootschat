import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from '../screens/HomeScreen';

const ChatStack = createStackNavigator();
const ModalStack = createStackNavigator();

export default function HomeStack() {
  return (
      <ModalStack.Navigator presentation="modal" headerShown="false">
        <ModalStack.Screen name="ChatApp" component={ChatComponent} />
      </ModalStack.Navigator>
  );
}

function ChatComponent() {
  return (
      <ChatStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#5b3a70',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 22,
            },
          }}
      >
        <ChatStack.Screen name="Home" component={HomeScreen} />
      </ChatStack.Navigator>
  );
}