import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const UserScreen = ({ navigation, setSignedInUser }) => {

  const handleLogout = () => {

    
    setSignedInUser(null);

    // Navigate back to the LoginScreen
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text>Enjoy your DayEscape</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserScreen;

