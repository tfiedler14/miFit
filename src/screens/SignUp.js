import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, Font, AsyncStorage } from 'react-native';
import base64 from 'react-native-base64';


const user = {
  userName: 'admin',
  passWord: '12345'
};
export default class LoginScreen extends React.Component {

  static navigationOptions = {
    title: 'SignUp',
  }
  /// add a parameter to take the label of sign up or settings... it will essentially be the same thing. 
  // also may need to parameterize edit vs save... one would be a POSTING for whole new user, other would be 
  //just PUTTING..... maybe putting can substitute posting?? ask andrew...
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      passWord: '',
      userToken: '',
    }
  }

  _signUp = async () => {
    
    console.log(this.state.userName, this.state.passWord);

    if(this.state.passWord.length <= 4){
      alert("Password is too short... try again");
      this.clearUser();
    } else if (this.state.passWord === null || this.state.userName === null){
      alert("Username and password are required to create profile");
      this.clearUser();
    }

    fetch('https://mysqlcs639.cs.wisc.edu/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify({
          "username": this.state.userName,
          "password": this.state.passWord,
          "firstName": this.state.firstName,
          "lastName": this.state.lastName,
      })
    })
      .then((response) => {
        console.log(response);
        if(response.status === 200){
          //its been created
          this.storeId();
          this.props.navigation.navigate('Home');
        } else {
          alert("This username and password has already created an account. Use new username or log in from home page"); 
        }
      })
      .catch((error) => {console.log("ERROR: " + error)})
     
  }

  clearUser() {
    this.setState({
      firstName: '',
      lastName: '',
      userName: '',
      passWord: '',
    });
    return;
  }
  storeId = async () => {
    try{
      await AsyncStorage.setItem('firstName', this.state.firstName);
      await AsyncStorage.setItem('userId', this.state.userName);
    } catch (error) {
      console.log("userName storage error" , error);
    }
  }


render() {
  return (
    <View style={styles.container}>
      <Text style={styles.banner} >Sign Up!</Text>
      <Text style={styles.logIn} >Complete the form below to design your profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#37E3D8"
        onChangeText={(firstName) => this.setState({ firstName })}
        value={this.state.firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#37E3D8"
        onChangeText={(lastName) => this.setState({ lastName })}
        value={this.state.lastNname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize='none'
        placeholderTextColor="#37E3D8"
        onChangeText={(userName) => this.setState({ userName })}
        value={this.state.userName}

      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#37E3D8"
        onChangeText={(passWord) => this.setState({ passWord })}
        value={this.state.passWord}
        secureTextEntry={true}

      />
      <TouchableOpacity
        style={styles.btn}
        onPress={this._signUp}>
        <Text style={styles.logIn}>Save & Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => this.props.navigation.navigate('Login')}>
        <Text style={styles.logIn}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#635E5E',

  },
  logIn: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: "#635E5E",
  },
  banner: {
    fontSize: 30,
    //fontFamily: 'Silom',
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '80%',
    width: '80%',
    color: "#37E3D8",
  },
  input: {
    color: '#fff',
    borderBottomWidth: .5,
    borderColor: '#000',
    alignSelf: 'center',
    margin: 12,
    height: 35,
    width: 250,
    fontSize: 16,
    padding: 5,

  },
  btn: {
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#37E3D8",
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    width: 250,
    borderRadius: 10,
    margin: 12,

  }
})







