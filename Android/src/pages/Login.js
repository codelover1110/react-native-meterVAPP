import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialIcons'

import Logo from '../components/Logo';

import CheckBox from 'react-native-check-box';
import AsyncStorage from "@react-native-community/async-storage";

function Login(props) {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const [isSelected, setSelection] = useState(true);
  const [isLogined, setLogined] = useState(false);


  useEffect(() => {
    AsyncStorage.getItem('check_status').then(value => {
      setLogined(value)
      if (value == 'true') {
        props.navigation.navigate('Home')
      }
    });
  });

  _goRegister = () => {
    props.navigation.navigate('Register')
  }


  _handlePress = () => {

    if (userEmail && userPassword) {
      setShowLoading(true);
      // props.navigation.navigate('Home')

      let api_url = 'https://inventoryapi.scnordic.com/getuser/' + userEmail + '/' + userPassword;
      return fetch(api_url)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.email != "") {
            if (responseJson.password != "") {
              if (responseJson.active != "Inactive") {
                AsyncStorage.setItem('customerID', userEmail);
                AsyncStorage.setItem('customerUserName', responseJson["username"]);
                if (isSelected) {
                  AsyncStorage.setItem('check_status', 'true')
                }
                props.navigation.navigate('Home')
              } else {
                setShowLoading(false)
                alert("Your account is inactive. Please contact administrator")
              }
            } else {
              setShowLoading(false)
              alert("Password isn't correct. Try again.")
            }
          } else {
            setShowLoading(false)
            alert("Your email isn't correct. Try again.")
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Please input email and password.")
    }
  }

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.signupContainer}>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="email" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            placeholder="Email"
            placeholderTextColor="#ffffff"
            selectionColor='#fff'
            keyboardType="email-address"
            returnKeyLabel={"next"}
            onChangeText={(text) => setUserEmail(text)}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="keyboard" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#ffffff"
            // ref={(input) => this.password = input}
            returnKeyLabel={"next"}
            onChangeText={(text) => setUserPassword(text)}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.itemcontainer}>
          <CheckBox
            onClick={() => {
              setSelection(!isSelected)
            }}
            isChecked={isSelected}
          />
          <Text>Stay signed in?</Text>
        </View>

        {showLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
          : <TouchableOpacity style={styles.button}
            onPress={this._handlePress}>
            <Text style={styles.buttonText}>SignIn</Text>
          </TouchableOpacity>
        }
         <TouchableOpacity style={styles.button}
                onPress={() => props.navigation.navigate('PasswordReset')}>
                <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#548235',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signupContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 16
  },

  button: {
    // backgroundColor: '#1c313a',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 300,
    borderRadius: 15,
    marginVertical: 10,
    paddingVertical: 13,
    marginLeft: 30
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center",
  },
  itemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imgIcon: {
    padding: 10
  },

});

export default Login;