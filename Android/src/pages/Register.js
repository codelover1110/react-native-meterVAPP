import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import SelectInput from 'react-native-select-input-ios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../components/Logo';

function Register(props) {
  console.log(props)

  const selectOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ]

  const selectOptions1 = []

  for (let i = 1980; i <= 2020; i++) {
    selectOptions1.push({ value: ('' + i), label: ('' + i) })
  }

  const [selectOption, setSelectOption] = useState('Male')
  const [selectOption1, setSelectOption1] = useState('1990')
  const [signEmail, setSignEmail] = useState('')
  const [signPassword, setSignPassword] = useState('')
  const [signName, setSignName] = useState('')
  const [signAge, setSignAge] = useState('')
  const [signLoading, setSignLoading] = useState('')

  _handleFormSubmit = () => {
    let formData = new FormData();
    formData.append("gender", selectOption)
    formData.append("email", signEmail)
    formData.append("password", signPassword)
    formData.append("name", signName)
    formData.append("age", selectOption1)
    if (validate(signEmail) == false) {
      alert("Invalid Email. Try again.")
      return
    }
    if (signEmail == '' || signPassword == ''
      || signName == '') {
      alert("You have to input your information correctly!")
    } else {
      setSignLoading(true)
      fetch('https://inventoryapi.scnordic.com/adduser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      })
        .then((response) => response.json())
        .then(response => {
          setSignLoading(false)
          if (response.success == "true") {
            Alert.alert("Congratulations!  Successful Registered!")
            setSignName('');
            setSignPassword('');
            setSignAge('');
            setSignEmail('');
            props.navigation.navigate('Login')
          } else {
            alert("Your email already registed!")
          }
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
    }
  }

  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      return expression.test(String(email).toLowerCase())
  }


  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.registerContainer}>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="email" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Email"
            placeholderTextColor="#ffffff"
            keyboardType="email-address"
            onSubmitEditing={() => this.password.focus()}
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignEmail(text)}
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
            placeholderTextColor="#ffffff"
            ref={(input) => this.password = input}
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignPassword(text)}
            autoCapitalize="none"

          />
        </View>
        <View style={styles.itemcontainer}>
          <Icon
            style={styles.imgIcon} name="person" size={20} color='#000'
          />
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Name"
            placeholderTextColor="#ffffff"
            returnKeyLabel={"next"}
            onChangeText={(text) => setSignName(text)}
            autoCapitalize="none"
          />
        </View>
        {/* <View style={styles.selectItemcontainer}>
          <Icon
            style={styles.imgIcon} name="face" size={20} color='#000'
          />
          <View style={styles.selectInputContainer}>
            <SelectInput
              value={selectOption1}
              options={selectOptions1}
              onSubmitEditing={(value) => setSelectOption1(value)}
              style={styles.selectInput}
            />
          </View>
        </View>
        <View style={styles.selectItemcontainer}>
          <Icon
            style={styles.imgIcon} name="group" size={20} color='#000'
          />
          <View style={styles.selectInputContainer}>
            <SelectInput
              value={selectOption}
              options={selectOptions}
              onSubmitEditing={(value) => setSelectOption(value)}
              style={styles.selectInput}
            />
          </View> */}
        {/* </View> */}
        {signLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
          : <TouchableOpacity style={styles.button}
            onPress={() => _handleFormSubmit()}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        }
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#548235',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  registerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    marginVertical: 16
  },

  selectBox: {
    width: 300,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 10,
    // fontSize: 16,
    color: 'red',
    marginVertical: 16
  },

  selectBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    marginVertical: 5,

  },

  button: {
    // backgroundColor: '#1c313a',
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10,
    marginLeft: 30
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center"
  },
  itemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectItemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },
  selectInputContainer: {
    // flexDirection: "row"
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingLeft: 10,
    paddingRight: 40,
    textAlign: "center",
    textAlignVertical: "center"
  },
  imgIcon: {
    padding: 10
  },
  selectInput: {
    // flexDirection: 'row',
    // height: 40,
    // padding: 8,
    // backgroundColor: 'rgba(255,255,255,0.2)',
    // width: 300,
    // alignContent: "center"
  },
  selectInputLarge: {
    width: '100%',
    paddingHorizontal: 16
  }
});

export default Register;