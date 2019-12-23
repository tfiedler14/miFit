import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, Text, View, AsyncStorage} from 'react-native';
import base64 from 'react-native-base64';


  
// const user ={
//     userName: 'admin',
//     passWord: '12345'
// };
export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }
  
  
  constructor(props){
    super(props);
    this.state ={
      userName: '',
      passWord: '',
      isLoading: true,
      userToken: null,
    }
  }

  _signIn = async () =>{
    
    var headers = new Headers();
    var status = -1;
    headers.append('Authorization', 'Basic ' + base64.encode(this.state.userName + ":" + this.state.passWord));
    headers.append('Content-Type', 'application/json');

    try{
    fetch('https://mysqlcs639.cs.wisc.edu/login', {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    })
      
      .then(function(response) {
        status = response.status;
        return response.json();
      })
      .then((response) => { 
  
        if(status === 200){
          this.setState({
            userToken: response
          })
          this.storeId(this.state.userToken);
          console.log("navigating to landing screen" );
          this.props.navigation.navigate('Home');
          
        } else {
          alert("Login in failed. Please try again with valid username and password");
          this.setState({
            userName: '',
            passWord:''
          })
        }

      })
      .catch((error) => {console.log(error)})
    }catch(e){
      console.log(e);
    }
         
  }

  storeId = async (token) => {
    try{
      await AsyncStorage.setItem('userToken', token.token);
      await AsyncStorage.setItem('userId', this.state.userName);
    } catch (error) {
      console.log("token storage error" , error);
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
          autoCapitalize="none"
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
          onPress={this._signIn}>
            <Text style={styles.logIn}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity  
          style={styles.btn}
          onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.logIn}>Sign Up Now!</Text>
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
    padding: 15,
    width: 250,
    borderRadius: 10,
    margin: 12,

  }
});




async function signIn() {
      
  if(user.userName === this.state.userName && user.passWord === this.state.passWord){
      //this would redirect to home page
      alert('logging in');
  } else {
      alert('Invalid user name and password. Please try again');
  }
}



