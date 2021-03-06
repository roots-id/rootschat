import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, NativeModules, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';
import FormButton from '../components/FormButton';

import { getAllChats } from '../roots';
import Loading from '../components/Loading';

export default function HomeScreen({navigation}) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();

    useEffect(async () => {
        let isCancelled = false;
        try {
            const chatList = await getAllChats();
            if(chatList) {
                setChats(chatList.paginator.items);
                setLoading(false);
            }
        } catch(error) {
            console.log("HomeScreen - Could not getAllChats")
        }
    }, [isFocused,loading]);

    if (loading) {
        return <Loading />;
    } else {

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                  <FlatList
                      data={chats}
                      keyExtractor={(item) => item.id.toString()}
                      ItemSeparatorComponent={() => <Divider />}
                      renderItem={({ item }) => (
                          <List.Item
                              title={item.title}
                              titleNumberOfLines={1}
                              titleStyle={styles.listTitle}
                              descriptionStyle={styles.listDescription}
                              descriptionNumberOfLines={1}
                              onPress={() => navigation.navigate('Chat', { chatId: item.id })}
                          />
                      )}
                  />
            </SafeAreaView>
        </View>
    );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#251520',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    color: '#dddddd',
  },
  listDescription: {
    fontSize: 16,
    color: '#dddddd',
  },
  item: {
      backgroundColor: '#20190e',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
});