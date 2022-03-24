import React, { useState } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

import { createChannel } from '../roots';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

const { PrismModule } = NativeModules;

export default function CreateChannelScreen({ navigation }) {
  const [channelName, setChannelName] = useState('');

  function handleButtonPress() {
    if (channelName.length > 0) {
      PrismModule.newDID(channelName)
      navigation.navigate('Examples')
    }
  }

  return (
      <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
          <IconButton
              icon="close-circle"
              size={36}
              color="#5b3a70"
              onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Title style={styles.title}>Create a new channel</Title>
          <FormInput
              labelName="Example"
              value={channelName}
              onChangeText={(text) => setChannelName(text)}
              clearButtonMode="while-editing"
          />
          <FormButton
              title="Create"
              modeValue="contained"
              labelStyle={styles.buttonLabel}
              onPress={() => handleButtonPress()}
              disabled={channelName.length === 0}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#222222',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#dddddd',
  },
  buttonLabel: {
    fontSize: 22,
  },
});