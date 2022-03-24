package com.rootswallet

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.rootsid.wal.library.*
import java.lang.reflect.Field
import java.util.*

class PrismModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    var wal:Wallet = newWallet("wallet1","","passphrase")

    override fun getName(): String {
        return "PrismModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = false)
    fun newDID(didAlias: String) {
        val output = newDid(wal, didAlias, true).toString();
        //return "created did " + wal.dids.last()
    }

    // Beware of the isBlocking. Need to fix with callback or alike
    @ReactMethod(isBlockingSynchronousMethod = false)
    fun publishDid(wal: Wallet, didAlias: String) {
        val output = publishDid(wal, didAlias).toString()
    }


//    fun prepareKeysFromMnemonic(mnemonic: MnemonicCode, pass: String): Map<String, ECKeyPair> {
//       val seed = KeyDerivation.binarySeed(mnemonic, pass)
//       val issuerMasterKeyPair = KeyGenerator.deriveKeyFromFullPath(seed, 0, PrismKeyType.MASTER_KEY, 0)
//       val issuerIssuingKeyPair = KeyGenerator.deriveKeyFromFullPath(seed, 0, PrismKeyType.ISSUING_KEY, 0)
//       val issuerRevocationKeyPair = KeyGenerator.deriveKeyFromFullPath(seed, 0, PrismKeyType.REVOCATION_KEY, 0)
//       return mapOf(
//           Pair(PrismDid.DEFAULT_MASTER_KEY_ID, issuerMasterKeyPair),
//           Pair(PrismDid.DEFAULT_ISSUING_KEY_ID, issuerIssuingKeyPair),
//           Pair(PrismDid.DEFAULT_REVOCATION_KEY_ID, issuerRevocationKeyPair))
//   }

//        val newenv = emptyMap<String,String>().toMutableMap()
//        newenv["PRISM_NODE_HOST"]="ppp-node-test.atalaprism.io";
//        Log.d("LANCETAG", setEnv(newenv).toString())


//    @Throws(Exception::class)
//    fun setEnv(newenv: Map<String, String>?): MutableMap<String, String> {
//        var result: MutableMap<String, String> = mutableMapOf<String, String>()
//        try {
//            val processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment")
//            val theEnvironmentField: Field = processEnvironmentClass.getDeclaredField("theEnvironment")
//            theEnvironmentField.setAccessible(true)
//            val env = theEnvironmentField.get(null) as MutableMap<String, String>
//            env.putAll(newenv!!)
//            val theCaseInsensitiveEnvironmentField: Field =
//                processEnvironmentClass.getDeclaredField("theCaseInsensitiveEnvironment")
//            theCaseInsensitiveEnvironmentField.setAccessible(true)
//            val cienv = theCaseInsensitiveEnvironmentField.get(null) as MutableMap<String, String>
//            cienv.putAll(newenv)
//            result = cienv
//        } catch (e: NoSuchFieldException) {
//            val classes = Collections::class.java.declaredClasses
//            val env = System.getenv()
//            for (cl in classes) {
//                if ("java.util.Collections\$UnmodifiableMap" == cl.name) {
//                    val field: Field = cl.getDeclaredField("m")
//                    field.setAccessible(true)
//                    val obj: Any = field.get(env)
//                    val map = obj as MutableMap<String, String>
//                    map.clear()
//                    map.putAll(newenv!!)
//                    result = map
//                }
//            }
//        }
//
//        return result
//    }

}