import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, NativeModules, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';
import FormButton from '../components/FormButton';

import { getChatDisplayName, getAllChats } from '../roots';
import Loading from '../components/Loading';

const PrismModule = NativeModules

export default function HomeScreen({navigation}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    let isCancelled = false;
    getAllChats().then(result => {
      if (!isCancelled) {
        setChats(result.paginator.items);

        if (loading) {
          setLoading(false);
        }
      }
    });
//    console.log("Prism module",PrismModule.test())
    return () => {
      isCancelled = true;
    };
  }, [isFocused, loading]);

  if (loading) {
    return <Loading />;
  }

//    <FormButton
//                title="test node connection"
//                modeValue="contained"
//                onPress={PrismModule.testNode()}
//            />
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
                          onPress={() => navigation.navigate('Secure Messages:', { chat: item })}
                      />
                  )}
              />
        </SafeAreaView>
    </View>

  );
}

    const styles = StyleSheet.create({
      container: {
        backgroundColor: '#20190e',
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