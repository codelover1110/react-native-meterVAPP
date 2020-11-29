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
  Button,
  FlatList,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard,
  PermissionsAndroid
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import SelectInput from 'react-native-select-input-ios';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function Metadata({ route, navigation }) {


  const [metaData, setMetaData] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editedItem, setEditedItem] = useState(0)
  const [itemTitle, setItemTitle] = useState()
  const [rowID, setRowID] = useState()
  const [nfcTagID, setNfcTagID] = useState()
  const [nfcTAG, setNfcTAG] = useState('')

  const [currentLatitude, setCurrentLatitude] = useState('')
  const [currentLogitude, setCurrentLongitude] = useState('')
  const [flag, setFlag] = useState(true)
  const [currentID, setCurrentID] = useState('')
  const { nfc_id } = route.params;


  useEffect(() => {
    setNfcTagID(nfc_id)
    if (flag) {
      getCurrentLocation()
      getChangsLocation()
      setFlag(false)
      getMetaData(nfc_id)

    }
    AsyncStorage.getItem('customerUserName').then(value => {
      setCurrentID(value)
    });
  }), [nfc_id];

  const options = [
    { value: "Electricity", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "CO2", label: "CO2" },
    { value: "NH3", label: "NH3" },
    { value: "Compressed Air", label: "Compressed Air" },
    { value: "Heat", label: "Heat" },
    { value: "Glycol", label: "Glycol" },
    { value: "Waste Water", label: "Waste Water" },
    { value: "pH", label: "pH" },
    { value: "Acid", label: "Acid" }
  ]

  getMetaData = (tag_id) => {
    let api_url = 'https://inventoryapi.scnordic.com/editMetaData/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setRowID(responseJson.id)
        let metaData = [
          { item: 'tag_id', text: 'TagID', value: responseJson.tag_id },
          { item: 'nfc_tag', text: 'NFCTag', value: responseJson.nfc_tag },
          { item: 'media_type', text: 'MediaType', value: responseJson.media_type },
          { item: 'energy_media_type', text: 'EnergyMediaType', value: responseJson.energy_media_type },
          { item: 'meter_point_description', text: 'MeterPointDescription', value: responseJson.meter_point_description },
          { item: 'energy_unit', text: 'EnergyUnit', value: responseJson.energy_unit },
          { item: 'group', text: 'Group', value: responseJson.group },
          { item: 'column_line', text:  'ColumnLine(Production)', value: responseJson.column_line },
          { item: 'meter_location', text: 'MeterLocation', value: responseJson.meter_location },
          { item: 'energy_art', text: 'EnergyArt', value: responseJson.energy_art },
          { item: 'supply_area_child', text: 'SupplyArea(Child)', value: responseJson.supply_area_child },
          { item: 'meter_level_structure', text: 'MeterLevelStructure', value: responseJson.meter_level_structure },
          { item: 'supply_area_parent', text: 'SupplyArea(Parent)', value: responseJson.supply_area_parent },
          { item: 'longtitude', text: 'Longtitude', value: responseJson.longtitude },
          { item: 'latitude', text: 'Latitude', value: responseJson.latitude },
          { item: 'serialNumber', text: 'SerialNumber', value: responseJson.serialNumber },
          { item: 'fabricate', text: 'Fabricate', value: responseJson.fabricate },
          { item: 'model', text: 'Model', value: responseJson.model },
          { item: 'impUnit', text: 'ImpUnit', value: responseJson.impUnit },
          { item: 'screenCharacters', text: 'ScreenCharacters', value: responseJson.screenCharacters },
          { item: 'fabricationDate', text: 'FabricationDate', value: responseJson.fabricationDate },
          { item: 'inBuiltDimensions', text: 'InBuiltDimensions', value: responseJson.inBuiltDimensions },
          { item: 'dataConnectionType', text: 'DataConnectionType', value: responseJson.dataConnectionType },
        ]
        setMetaData(metaData)
        setNfcTAG(responseJson.tag_id)
      })
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

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')
  }

  _handleEditItem = (editedItem) => {
    let newData = metaData.map(item => {
      if (item.item == editedItem) {
        item.value = inputText
        return item
      }
      return item
    })
    setMetaData(newData)
    let alertData = editedItem
    Alert.alert(
      'Are you sure?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _upDateMetadata(newData) },
      ],
      { cancelable: false },
    );
  }

  getChangsLocation = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => Geolocation.watchPosition(
        //Will give you the current location
        (position) => {
          let longitude = JSON.stringify(position.coords.longitude);
          let latitude = JSON.stringify(position.coords.latitude);
          setCurrentLatitude(latitude)
          setCurrentLongitude(longitude)
        },
        (error) => alert(error.message),
        {
          enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
        }
      ))
  }

  getCurrentLocation = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(() => Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          let longitude = JSON.stringify(position.coords.longitude);
          let latitude = JSON.stringify(position.coords.latitude);
          setCurrentLatitude(latitude)
          setCurrentLongitude(longitude)
        },
        (error) => alert(error.message),
        {
          enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
        }
      ))
  }

  _getLocation = () => {
    let alertData = "Get current location"
    Alert.alert(
      'Are you sure?',
      alertData,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _upDateLocation() },
      ],
      { cancelable: false },
    );
  }

  _upDateMetadata = (newData) => {
    let formData = new FormData();
    formData.append("by_user", currentID)
    formData.append("id", rowID)
    formData.append("tag_id", newData[0].value)
    formData.append("nfc_tag", newData[1].value)
    formData.append("media_type", newData[2].value)
    formData.append("energy_media_type", newData[3].value)
    formData.append("meter_point_description", newData[4].value)
    formData.append("energy_unit", newData[5].value)
    formData.append("group", newData[6].value)
    formData.append("column_line", newData[7].value)
    formData.append("meter_location", newData[8].value)
    formData.append("energy_art", newData[9].value)
    formData.append("supply_area_child", newData[10].value)
    formData.append("meter_level_structure", newData[11].value)
    formData.append("supply_area_parent", newData[12].value)
    formData.append("longtitude", newData[13].value)
    formData.append("latitude", newData[14].value)
    formData.append("serialNumber", newData[15].value)
    formData.append("fabricate", newData[16].value)
    formData.append("model", newData[17].value)
    formData.append("impUnit", newData[18].value)
    formData.append("screenCharacters", newData[19].value)
    formData.append("fabricationDate", newData[20].value)
    formData.append("inBuiltDimensions", newData[21].value)
    formData.append("dataConnectionType", newData[22].value)

    fetch('https://inventoryapi.scnordic.com/updateMetaDataMobile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          setModalVisible(false)

        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  _upDateLocation = () => {
    let formData = new FormData();
    formData.append("id", rowID)
    formData.append("by_user", currentID)
    formData.append("tag_id", metaData[0].value)
    formData.append("nfc_tag", metaData[1].value)
    formData.append("media_type", metaData[2].value)
    formData.append("energy_media_type", metaData[3].value)
    formData.append("meter_point_description", metaData[4].value)
    formData.append("energy_unit", metaData[5].value)
    formData.append("group", metaData[6].value)
    formData.append("column_line", metaData[7].value)
    formData.append("meter_location", metaData[8].value)
    formData.append("energy_art", metaData[9].value)
    formData.append("supply_area_child", metaData[10].value)
    formData.append("meter_level_structure", metaData[11].value)
    formData.append("supply_area_parent", metaData[12].value)
    formData.append("longtitude", currentLongitude)
    formData.append("latitude", currentLatitude)
    formData.append("serialNumber", metaData[15].value)
    formData.append("fabricate", metaData[16].value)
    formData.append("model", metaData[17].value)
    formData.append("impUnit", metaData[18].value)
    formData.append("screenCharacters", metaData[19].value)
    formData.append("fabricationDate", metaData[20].value)
    formData.append("inBuiltDimensions", metaData[21].value)
    formData.append("dataConnectionType", metaData[22].value)

    fetch('https://inventoryapi.scnordic.com/updateMetaDataMobile/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          metaData[12].value = currentLatitude
          metaData[13].value = currentLongitude
        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { setModalVisible(true); setInputText(item.value), setEditedItem(item.item), setItemTitle(item.text) }}
      underlayColor={'#f1f1f1'}>
      <View style={styles.item} >
        <View>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>{item.text}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text multiline={true} style={styles.itemText}>{item.value} </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}> TagID:  </Text>
          <Text style={(nfcTAG.length > 5) ? styles.headerLongTextXY : styles.headerTextXY}>{nfcTAG}</Text>
        </View>
        <Image style={{ width: 40, height: 40, marginLeft: '5%', marginBottom: 20 }}
          source={require('../assets/images/metabrand.png')} />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={metaData}
          keyExtractor={(item) => item.item}
          renderItem={renderItem}
        />
      </View>
      <Modal animationType="fade" visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.logoContainer}>
              <Image style={{ width: 170, height: 170 }}
                source={require('../assets/images/logo.png')} />
            </View>
            <View style={styles.item} >
              <View>
                <View style={(itemTitle == "EnergyArt") ? styles.energyStyle : styles.itemTitle}>
                  <Text style={styles.itemTitleText}>{itemTitle}</Text>
                </View>
              </View>
              {
                itemTitle == "EnergyArt" ?
                  <View style={styles.itemEnerygyContent}>
                    <SelectInput
                      value={inputText}
                      options={options}
                      onSubmitEditing={(value) => setInputText(value)}
                      style={styles.selectInput}
                      multiline={2}
                    />
                  </View> :
                  <View style={styles.itemContent}>
                    <TextInput
                      onChangeText={(text) => { setInputText(text); }}
                      defaultValue={inputText}
                      editable={true}
                      multiline={true}
                      maxLength={200}
                    />
                  </View>
              }
            </View>
            <View style={styles.modelButtonContainer}>
              <TouchableHighlight onPress={() => { _handleEditItem(editedItem); }}
                style={styles.modalButton}>
                <Text style={styles.modalText}>UPDATE</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => { setModalVisible(false) }}
                style={styles.modalButton}>
                <Text style={styles.modalText}>CANCEL</Text>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.bottomContaner}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Nfctag')}>
          <Image style={{ width: 40, height: 40, marginLeft: '25%' }}
            source={require('../assets/images/next.png')} />
        </TouchableOpacity> */}
        <View style={styles.bottomRightContainer}>
          <TouchableOpacity onPress={() => _getLocation()}>
            <Image style={styles.getLocation}
              source={require('../assets/images/getLocation.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Consumption', { nfc_id: nfcTAG, nfc_tag: nfcTagID })}>
            <Image style={styles.getLocation}
              source={require('../assets/images/plus.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Location')}>
            <Image style={styles.getLocation}
              source={require('../assets/images/location.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#548235',
    borderRadius: 15,
    flexDirection: "row"

  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    // marginLeft: "15%"

  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: 35,
    color: '#000000',
    maxWidth: wp('30%'),
    maxHeight: 70,
    letterSpacing: 0.5
  },
  headerLongTextXY: {
    fontSize: 15,
    color: '#000000',
    maxWidth: wp('30%'),
    maxHeight: 70,
    letterSpacing: 0.5
  },
  container: {
    backgroundColor: '#548235',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    marginTop: 10,
    height: '73%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    marginLeft: 10
  },
  marginLeft: {
    marginLeft: 5,
  },
  menu: {
    width: 20,
    height: 2,
    backgroundColor: '#111',
    margin: 2,
    borderRadius: 3,
  },
  text: {
    fontSize: 13,

  },
  itemText: {
    fontSize: 13,
    maxHeight: 43

  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold"

  },
  itemContent: {
    width: '40%',
    height: 43,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemEnerygyContent: {
    width: '60%',
    height: 43,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 13,
    color: '#ffffff',
  },

  textInput: {
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderColor: 'gray',
    borderBottomWidth: 2,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableHighlight: {
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
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
  itemTitle: {
    borderWidth: 2,
    padding: 0,
    width: 200,
    height: 50,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#5b9bd5',
    alignItems: "center",
    justifyContent: "center",

  },
  energyStyle: {
    borderWidth: 2,
    padding: 10,
    width: 100,
    height: 50,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#5b9bd5',
    alignItems: "center",
    justifyContent: "center",

  },
  logoContainer: {
    marginBottom: '10%',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modalButton: {
    borderWidth: 2,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    borderRadius: 15,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    margin: 20
  },
  modelButtonContainer: {
    flexDirection: "row",
  },
  bottomContaner: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 15

  },
  getLocation: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  bottomRightContainer: {
    flexDirection: "row",
    position: "absolute"
  },
  selectInput: {
    // flexDirection: 'row',
    padding: 0,
    // backgroundColor: 'rgba(255,255,255,0.2)',
  },
})

