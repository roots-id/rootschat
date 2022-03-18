import { NativeModules } from "react-native";

const { PrismModule } = NativeModules;

export function generateDID(passphrase,didIndex) {
  let did = PrismModule.createDID(passphrase)
  let output = 'From passphrase: '+passphrase+'\ngenerated DID #'+didIndex+':\n'+did
  console.log(output);
  return did
}
