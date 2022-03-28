package com.rootswallet

import android.annotation.SuppressLint
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.rootsid.wal.library.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import java.util.*

class PrismModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    //var wal:Wallet = newWallet("wallet1","","passphrase")

    override fun getName(): String {
        return "PrismModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun test() {Log.d("test","test")}

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun testNode() {
        val wal = newWallet("walletname1", "", "password1")
        val didAlias1 = "didAlias1"
        val walAfterDid = newDid(wal, didAlias1, true)
        Log.d("LANCETAG", "Testing node publish....")
        val output = publishDid(walAfterDid, didAlias1).toString()
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun newDID(walJson: String, didAlias: String): String {
        var cliWal = Json.decodeFromString<Wallet>(walJson);
        cliWal = newDid(cliWal, didAlias, true);
        return Json.encodeToString(cliWal)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun newWal(name: String, mnemonic: String, passphrase: String): String {
        val cliWal = newWallet(name,mnemonic,passphrase);
        return Json.encodeToString<Wallet>(cliWal);
    }

    // Beware of the isBlocking. Need to fix with callback or alike
    @ReactMethod(isBlockingSynchronousMethod = false)
    fun publishDid(wal: Wallet, didAlias: String) {
        val output = publishDid(wal, didAlias).toString()
    }
}