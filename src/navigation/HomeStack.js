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

export default function HomeStack() {
  return (
      <ModalStack.Navigator presentation="modal" headerShown="false">
        <ModalStack.Screen name="RootsWallet - Chat Prototype" component={ChatComponent} />
        <ModalStack.Screen name="Create Example" component={CreateChannelScreen} />
      </ModalStack.Navigator>
  );
}

function ChatComponent() {
  return (
      <ChatStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#e69138',
            },
            headerTintColor: '#eeeeee',
            headerTitleStyle: {
              fontSize: 22,
            },
          }}
      >
        <ChatStack.Screen
                    name="Examples"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                      headerRight: () => (
                          <IconButton
                              icon="plus"
                              size={28}
                              color="#eeeeee"
                              onPress={() => navigation.navigate('Create Example')}
                          />
                      ),
                    })}
                />
        <ChatStack.Screen
                    name="Messages"
                    component={ChatScreen}
                    options={({ route }) => ({
                      title: route.params.channel.name,
                    })}
                />
      </ChatStack.Navigator>
  );
}