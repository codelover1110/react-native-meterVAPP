import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Button
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";

export default function ShopScreen({ navigation }) {
  const [content, setContent] = useState('Please connect Nfc tag')
  const [connectNfc, setConnectNfc] = useState(true)
  const [conntectStatus, setConnectStatus] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(false)
  const [isScan, setIsScan] = useState(false)

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')

  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image style={styles.logoutButton}
              source={require('../assets/images/logo.png')} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}
              source={require('../assets/images/logo.png')}>Back</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    NfcManager.start();
    return function cleanup() {
      this._cleanUp();
    }
    // this._cleanSuccess('469')
  });

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  buildUrlPayload = (valueToWrite) => {
    return Ndef.encodeMessage([
      Ndef.uriRecord(valueToWrite),
    ]);
  }

  // _connectNfctag = async () => {
  //   setIsScan(true)
  //   try {
  //     let resp = await NfcManager.requestTechnology(NfcTech.NfcA, {
  //       alertMessage: 'Ready to Read your NFC tags!'
  //     });
  //     let ndef = await NfcManager.getNdefMessage();
  //     await NfcManager.setAlertMessageIOS('Welcome to MetaData!')
  //     let tag = await NfcManager.getTag();
  //     let nfc_id = Ndef.text.decodePayload(tag.ndefMessage[0].payload)
  //     if (nfc_id != '') {

  //       this._cleanSuccess(nfc_id);
  //       NfcManager.cancelTechnologyRequest().catch(() => 0);
  //     }
  //   } catch (ex) {
  //     this._cleanUp();
  //   }
  // }

  _connectNfctag = () => {
    setIsScan(true)
    NfcManager.registerTagEvent(tag => console.log(tag))
            .then(() => NfcManager.requestTechnology(NfcTech.Ndef))
            .then(() => NfcManager.getTag())
            .then(tag => {
                console.log(JSON.stringify(tag));
                let nfc_id = Ndef.text.decodePayload(tag.ndefMessage[0].payload)
                if (nfc_id != '') {

                  this._cleanSuccess(nfc_id);
                  NfcManager.cancelTechnologyRequest().catch(() => 0);
                }
            })
            .then(this.cleanUp)
            .catch(err => {
                console.warn(err);
                this._cleanUp();
            })
  }

  _cleanSuccess = (nfc_id) => {
    let api_url = 'https://inventoryapi.scnordic.com/editNfctag/' + nfc_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        navigation.navigate('Metadata', {
          nfc_id: responseJson["tag_id"]
        });
      })
      .catch((response) => alert("There isn't data TagID: " + nfc_id))
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={{ width: 100, height: 100 }}
          source={require('../assets/images/logo.png')} />
      </View>
      { 
      isScan == true ? <View style={styles.scanContainer}><Image style={styles.itemImageStyle}
            source={require('../assets/images/ready_scan.png')} />
      <TouchableOpacity onPress={() => {this._cleanUp(); setIsScan(false);}} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity></View> :
      <TouchableOpacity style={[connectNfc == false ? styles.hiddenVoteButtons : styles.nfctagButton]}
        onPress={() => this._connectNfctag()}
      >
        <Text style={styles.buttonText}>Scan NFC Tag</Text>
      </TouchableOpacity>
      }
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },


  logoContainer: {
    // flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    top: 100
  },

  button: {
    backgroundColor: '#548235',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10
  },
  nfctagButton: {
    backgroundColor: '#548235',
    width: 300,
    borderRadius: 25,
    marginVertical: 230,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#ffffff'
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: "center",
    
  },
  showVoteButtons: {
    display: 'flex'
  },
  hiddenVoteButtons: {
    display: 'none'
  },
  textContainer: {
    // width: 300,
    borderWidth: 3,
    color: 'rgba(0, 0, 0, 0.7)',
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  logoContainerLogoutButton: {
    flexDirection: "row",
    width: '100%',
    borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderColor: '#000000',
    padding: 5
  },
  logoutButton: {
    marginRight: 20,
    padding: 5,
    marginBottom: 0,
    width: 40,
    height: 40
  },
  backButton: {
    marginLeft: 20,
    padding: 10,
    marginBottom: 0,
    borderColor: '#ccc',
    borderWidth: 2,
    color: '#ffffff',
    borderRadius: 10,
    justifyContent: "center",
  },
  itemImageStyle: {
    width: '50%',
    height: '50%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    // marginLeft: '20%'
    marginVertical: '10%',
    // paddingVertical: 10,
  },
  scanContainer: {
    width: '80%',
    height: '50%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center"    
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ccc',
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 15,
    width: '40%'
  }

});