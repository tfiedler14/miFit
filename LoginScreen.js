import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, Text, View, Font} from 'react-native';
import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

  

export default class LoginScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state ={
      userName: '',
      passWord: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.banner} >Welcome to MiFit!</Text>
        <Text style={styles.logIn} >Login in or Signup now!</Text>
        <TextInput 
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#37E3D8"
          onChangeText={(userName) => this.setState({userName})}
          value={this.state.userName}
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#37E3D8"
          onChangeText={(passWord) => this.setState({passWord})}
          value={this.state.passWord}
          secureTextEntry={true}

        />
        <TouchableOpacity  
          style={styles.btn}
          onPress={this.signIn}>
            <Text style={styles.logIn}>Login</Text>
          </TouchableOpacity>
      </View>
    );
  }

  signIn = () => {
      
    if(user.userName === this.state.userName && user.passWord === this.state.passWord){
        //this would redirect to home page
        alert('logging in');
    } else {
        alert('Invalid user name and password. Please try again');
    }
  }
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#635E5E',

  },
  logIn :{
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: "#635E5E",
  },
  banner:{
    fontSize: 30,
    //fontFamily: 'Silom',
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '80%',
    width: '80%',
    color: "#37E3D8",
  },
  input :{
    color: '#fff',
    borderBottomWidth: .5,
    borderColor: '#000',
    alignSelf:'center',
    margin: 12,
    height: 35,
    width:  250,
    fontSize: 16,
    padding: 5,

  },
  btn :{
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#37E3D8",
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    width: 250
  }
})







