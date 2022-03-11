import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider, List, Title } from 'react-native-paper';

import { getChannelDisplayName, allIssuers } from '../roots';

export default function ChatScreen({ navigation }) {
  const [channels, setChannels] = useState();
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    let isCancelled = false;

    allIssuers().then((result) => {
      if (!isCancelled) {
        setChannels(result);

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

  return (
      <View style={styles.container}>
        <Title>RootsWallet Chat</Title>

        <View style={styles.container}>
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
                      onPress={() => {
                        // TODO navigate to a chat screen.
                      }}
                  />
              )}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
});