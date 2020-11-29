import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

function Logo() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logoImage}
        source={require('../assets/images/logo.png')}
      />
    </View>
  );
}

export default Logo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: "center"
  },
  logoText: {
    marginVertical: 15,
    fontSize: 50,
    letterSpacing: 2,
    color: 'rgba(0, 0, 0, 0.7)',

  },
  logoImage: {
    width: 100,
    height: 100
  },
  textContainer: {
    // width: 300,
    borderWidth: 3,
    color: 'rgba(0, 0, 0, 0.7)',
    borderRightWidth: 0,
    borderLeftWidth: 0,
  }

});