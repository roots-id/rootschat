import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, NativeModules, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';
import FormButton from '../components/FormButton';

import { getChannelDisplayName, getAllChannels } from '../roots';
import Loading from '../components/Loading';

const { PrismModule } = NativeModules;

export default function HomeScreen({navigation}) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    let isCancelled = false;
    getAllChannels({ filter: { joined: true } }).then(result => {
      if (!isCancelled) {
        setChannels(result.paginator.items);

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


  return (
    <View style={styles.container}>
    <FormButton
                title="test"
                modeValue="contained"
                onPress={async () => {
                    const response = await PrismModule.test();
                    console.log(response);
                }}
            />
        <SafeAreaView style={styles.container}>
              <FlatList
                  data={channels}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <Divider />}
                  renderItem={({ item }) => (
                      <List.Item
                          title={item.title}
                          titleNumberOfLines={1}
                          titleStyle={styles.listTitle}
                          descriptionStyle={styles.listDescription}
                          descriptionNumberOfLines={1}
                          onPress={() => navigation.navigate('Messages', { channel: item })}
                      />
                  )}
              />
        </SafeAreaView>
    </View>

  );
}

    const styles = StyleSheet.create({
      container: {
        backgroundColor: '#222222',
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
          backgroundColor: '#222222',
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 16,
        },
        title: {
          fontSize: 32,
        },
    });