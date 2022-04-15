import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { IconButton, Title } from 'react-native-paper';

import ChatScreen from '../screens/ChatScreen';
import StartChatScreen from '../screens/StartChatScreen';
import HomeScreen from '../screens/HomeScreen';

const ChatDrawer = createDrawerNavigator();
//const ModalDrawer = createNavigator();

//our colors
//green #1c9963
//yellow #e69138
//purple #5b3a70
//glowingblack #312a1f

export default function HomeDrawer() {
//  return (
//      <ModalDrawer.Navigator presentation="modal" headerShown="false">
//        <ModalDrawer.Screen name="RootsWallet - Chat Prototype" component={ChatComponent} />
//        <ModalDrawer.Screen name="Create Secure Chat" component={StartChatScreen} />
//      </ModalDrawer.Navigator>
//  );
//}
//
//function ChatComponent() {
    return (
        <ChatDrawer.Navigator
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
            getAllChats().then(result => {
                <ChatDrawer.Screen
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
            }
        </ChatDrawer.Navigator>
    );
//<ChatDrawer.Screen
//                    name="Secure Messages:"
//                    component={ChatScreen}
//                />



  //                    options={({ route }) => ({
//                          title: route.params.chat.title,
//                        })}
}