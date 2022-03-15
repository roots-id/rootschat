import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { getChannelDisplayName, getAllChannels } from '../roots';
import Loading from '../components/Loading';

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

    return () => {
      isCancelled = true;
    };
  }, [isFocused, loading]);

  if (loading) {
    return <Loading />;
  }

//    const renderItem = ({ item }) => (
//      <Item title={item.title} />
//    );
//    const DATA = [
//      {
//        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//        title: 'First Item',
//      },
//      {
//        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//        title: 'Second Item',
//      },
//      {
//        id: '58694a0f-3da1-471f-bd96-145571e29d72',
//        title: 'Third Item',
//      },
//    ];

//    const DATA1 = getAllChannels();
//    const Item = ({ title }) => (
//      <View style={styles.item}>
//        <Text style={styles.title}>{title}</Text>
//      </View>
//    );

//            <SafeAreaView style={styles.container}>
//                    <FlatList
//                      data={DATA}
//                      renderItem={renderItem}
//                      keyExtractor={item => item.id}
//                    />
//              </SafeAreaView>
//<Text style={styles.title}>rock</Text>
  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.container}>
              <FlatList
                  data={channels}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <Divider />}
                  renderItem={({ item }) => (
                                              <List.Item
                                                  title={item.name}
                                                  description={item.type}
                                                  titleNumberOfLines={1}
                                                  titleStyle={styles.listTitle}
                                                  descriptionStyle={styles.listDescription}
                                                  descriptionNumberOfLines={1}
                                                  onPress={() => navigation.navigate('Chat', { channel: item })}
                                              />
                                          )}
              />
        </SafeAreaView>
    </View>

  );
}

    const styles = StyleSheet.create({
      container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
      },
      listTitle: {
        fontSize: 22,
      },
      listDescription: {
        fontSize: 16,
      },
      item: {
          backgroundColor: '#f9c2ff',
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 16,
        },
        title: {
          fontSize: 32,
        },
    });