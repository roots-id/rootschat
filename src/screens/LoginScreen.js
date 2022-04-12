import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Title } from 'react-native-paper';

import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';

import AuthContext from '../context/AuthenticationContext';

import { loadWallet } from '../roots'

//async function save(key, value) {
//  await SecureStore.setItemAsync(key, value);
//}
//
//async function getValueFor(key) {
//  let result = await SecureStore.getItemAsync(key);
//  if (result) {
//    alert("🔐 Here's your value 🔐 \n" + result);
//  } else {
//    alert('No values stored under that key.');
//  }
//}

//export default function LoginScreen() {
//  const [key, onChangeKey] = React.useState('Your key here');
//  const [value, onChangeValue] = React.useState('Your value here');
//
//  return (
//    <View style={styles.container}>
//      <Text style={styles.paragraph}>Save an item, and grab it later!</Text>
//      {Add some TextInput components... }
//      <Button
//        title="Save this key/value pair"
//        onPress={() => {
//          save(key, value);
//          onChangeKey('Your key here');
//          onChangeValue('Your value here');
//        }}
//      />
//
//      <Text style={styles.paragraph}>🔐 Enter your key 🔐</Text>
//      <TextInput
//        style={styles.textInput}
//        onSubmitEditing={event => {
//          getValueFor(event.nativeEvent.text);
//        }}
//        placeholder="Enter the key for the value you want to get"
//      />
//    </View>
//  );
//}
//
//const styles = StyleSheet.create({ ... });

export default function LoginScreen({ navigation }) {
  const [password, setPassword] = useState('');
  console.log("LoginScreen - Has wallet, Logging in with password")

  const { signIn } = React.useContext(AuthContext);

  return (
      <View style={styles.container}>
        <Title style={styles.titleText}>RootsWallet Login:</Title>
        <FormInput
            labelName="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(userPassword) => setPassword(userPassword)}
        />
        <FormButton
            title="Login"
            modeValue="contained"
            labelStyle={styles.loginButtonLabel}
            onPress={async () => {
              console.log("LoginScreen - Logging in with password")
              const wal = await loadWallet(password)
              if(wal) {
                console.log("LoginScreen - login with password success")
                signIn(wal);
              } else {
                console.log("LoginScreen - login with password failed")
              }
            }}
        />
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
  loginButtonLabel: {
    fontSize: 22,
  },
  navButtonText: {
    fontSize: 16,
  },
});
