import React, { useState } from 'react';
import { NativeModules, StyleSheet, Text, View } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

import { createChannel } from '../roots';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

const { PrismModule } = NativeModules;

export default function CreateChannelScreen({ navigation }) {
  const [channelName, setChannelName] = useState('');
  const [problemDisabled, setProblemDisabled] = useState(true)

  function handleButtonPress() {
    if (channelName.length > 0) {
      let channel = createChannel(channelName,"User Created - ")
      if(channel) {
          console.log("Created channel",channel)
          setProblemDisabled(true)
          navigation.navigate('Secure Channels:')
      } else {
          console.log("Could not create channel")
          setProblemDisabled(false)
      }
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
              labelName="Enter Channel Name"
              value={channelName}
              onChangeText={(text) => setChannelName(text)}
              clearButtonMode="while-editing"
          />
          <Text disable={problemDisabled} style={displayProblem(problemDisabled)}>Could not create channel</Text>
          <FormButton
              title="Create"
              modeValue="contained"
              labelStyle={styles.buttonLabel}
              onPress={() => handleButtonPress()}
              disabled={channelName.length <= 0}
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
    buttonLabel: {
      fontSize: 22,
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
    none: {
        display: 'none'
    },
    problem: {
        color: 'red',
    },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#dddddd',
  },
});

  function displayProblem(problemDisabled) {
    if(problemDisabled){
        return styles.none
    }
    else{
        return styles.problem
    }
  }