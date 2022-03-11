import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

export default function Splash() {
  return (
      <Stack.Navigator initialRouteName="Chat" headerShown="false">
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
  );
}
