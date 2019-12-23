import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    ScrollView, Platform, Dimensions, AsyncStorage
} from 'react-native';
// import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

const { height } = Dimensions.get('window');

export default class ProfileScreen extends React.Component {


    static navigationOptions = {
        title: 'ProfileScreen',
        Home: 'LandingScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            userName: '',
            dailyCal: 0,
            dailyPro: 0,
            dailyCarb: 0,
            dailyFat: 0,
            actGoal: 0,
            userToken: '',
        }
    }

    componentDidMount() {
        this.getUserId().then(() => {

            console.log("compenent mounted and userTOken and Id set!");
            const userName = this.state.userName;
            const userToken = this.state.userToken;
            //now do a fetch of user to fill out state variables
            if (userName && userToken) {
                console.log('Token:', userToken);
                console.log('User:', userName);

                fetch('https://mysqlcs639.cs.wisc.edu/users/' + userName, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': userToken,
                    },
                    redirect: 'follow'
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then((response) => {
                        console.log("landed a response", response);
                        this.setState({
                            userName: response.username,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            actGoal: response.goalDailyActivity,
                            dailyCal: response.goalDailyCalories,
                            dailyPro: response.goalDailyProtein,
                            dailyCarb: response.goalDailyCarbohydrates,
                            dailyFat: response.goalDailyFat,

                        });
                    })
                    .catch((error) => { console.log("ERROR: " + error) })
            }
        });
    }


    getUserId = async () => {

        try {
            this.state.userToken = await AsyncStorage.getItem('userToken') || null;
            this.state.userName = await AsyncStorage.getItem('userId') || null;
            
           this.state.dailyCal = await AsyncStorage.setItem('dailyCal') || null;
           this.state.dailyPro = await AsyncStorage.setItem('dailyPro') || null;
           this.state.dailyCarb = await AsyncStorage.setItem('dailyCarb') || null;
           this.state.dailyFat = await AsyncStorage.setItem('dailyFat') || null;

            console.log("user caught");
            console.log("state: ", this.state);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        return;
    }

    saveUpdates = async () => {
        console.log("button received");
        console.log("precheck", this.state);

        fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.userName, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.userToken,
            },
            redirect: 'follow',
            body: JSON.stringify({
                "username": this.state.userName,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "goalDailyActivity": this.state.actGoal,
                "goalDailyCalories": this.state.dailyCal,
                "goalDailyProtein" : this.state.dailyPro,
                "goalDailyCarbohydrates": this.state.dailyCarb,
                "goalDailyFat": this.state.dailyFat,
            })
        })
            .then((response) => {
                console.log("put response", response);
                if (response.status === 200) {
                    this.storeId(this.state.userToken);
                    this.props.navigation.navigate('Home');
                } else {
                    alert("Could not update user account. Try again later");
                }
            })
            .catch((error) => { console.log("ERROR: " + error) })

    }
    
    storeId = async (token) => {
        try{
            await AsyncStorage.setItem('dailyCal', this.state.dailyCal);
            await AsyncStorage.setItem('dailyPro', this.state.dailyPro);
            await AsyncStorage.setItem('dailyCarb', this.state.dailyCarb);
            await AsyncStorage.setItem('dailyFat', this.state.dailyFat);

            await AsyncStorage.setItem('actGoal', this.state.actGoal);
            await AsyncStorage.setItem('userToken', this.state.userToken);
            await AsyncStorage.setItem('userId', this.state.userName);
        } catch (error) {
          console.log("token storage error" , error);
        }
      }


    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.banner}>Edit Profile</Text>

                <View style={styles.feedBack}>
                    <View style={styles.subName}>
                        <Text style={styles.header}>Username:</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            placeholder={this.state.userName}
                            placeholderTextColor="#37E3D8"
                            onChangeText={(userName) => this.setState({ userName })}
                            value={this.state.userName}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>First Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.firstName}
                            placeholderTextColor="#37E3D8"
                            onChangeText={(firstName) => this.setState({ firstName })}
                            value={this.state.firstName}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Last Name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.lastName}
                            placeholderTextColor="#37E3D8"
                            onChangeText={(lastName) => this.setState({ lastName })}
                            value={this.state.lastName}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Activity Goal:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.actGoal}
                            placeholderTextColor="#37E3D8"
                            keyboardType='numeric'
                            onChangeText={(actGoal) => this.setState({ actGoal })}
                            value={String(this.state.actGoal)}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Fat Goal:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.dailyFat}
                            placeholderTextColor="#37E3D8"
                            keyboardType='numeric'
                            onChangeText={(dailyFat) => this.setState({ dailyFat })}
                            value={String(this.state.dailyFat)}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Protein Goal:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.dailyPro}
                            placeholderTextColor="#37E3D8"
                            keyboardType='numeric'
                            onChangeText={(dailyPro) => this.setState({ dailyPro })}
                            value={String(this.state.dailyPro)}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>

                        <Text style={styles.header}>Calorie Goal:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={this.state.dailyCal}
                            placeholderTextColor="#37E3D8"
                            keyboardType='numeric'
                            onChangeText={(dailyCal) => this.setState({ dailyCal })}
                            value={String(this.state.dailyCal)}
                            returnKeyType={'done'}
                        />
                    </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView style={styles.subName} keyboardVerticalOffset={70} behavior="padding" enabled>
                            <Text style={styles.header}>Carbohydrate Goal:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={this.state.dailyCarb}
                                placeholderTextColor="#37E3D8"
                                keyboardType='numeric'
                                onChangeText={(dailyCarb) => this.setState({ dailyCarb })}
                                value={String(this.state.dailyCarb)}
                                returnKeyType={'done'}
                            />
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>


                </View>



                <View style={{ flex: 1, position: 'absolute', bottom: '5%', width: '100%', flexDirection: 'row', justifyContent: 'center', }}>
                    <TouchableOpacity
                        style={styles.dltbtn}
                        value="viewActivity"
                        onPress={() =>
                            fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.userName, {
                                method: 'DELETE',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'x-access-token': this.state.userToken,
                                },
                                redirect: 'follow',
                            })
                                .then((response) => {
                                    console.log("put response", response);
                                    if (response.status === 200) {
                                        alert("Activity has been Deleted");

                                        this.props.navigation.navigate('SignUp');
                                    } else {
                                        alert("Could not delete activity. Try again later");
                                    }
                                })
                                .catch((error) => { console.log("ERROR: " + error) })

                        }>
                        <Text style={styles.delete}>Delete Profile</Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        value="saveProf"
                        onPress={this.saveUpdates}>

                        <Text style={styles.log}>Save Profile</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#635E5E',
        paddingTop: (Platform === 'ios') ? 20 : 0,
    },
    banner: {
        flex: 1,
        fontSize: 40,
        position: 'absolute',
        height: '80%',
        width: '80%',
        color: "#37E3D8",
        textAlign: 'center',
        alignSelf: 'center',
        top: '4%',
        paddingBottom: 2
    },
    feedBack: {
        flex: 1,
        position: 'absolute',
        width: '90%',
        height: '70%',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        top: '11%',
        marginTop: 0,

    },
    editContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        position: 'absolute',
        width: '100%',
        height: '100%',
        marginTop: 55,
    },
    subName: {
        flex: 1,
        position: 'relative',
        flexDirection: 'row',
        left: 5,
        padding: 0,
        justifyContent: "space-between"
    },
    header: {
        fontSize: 20,
        color: "#37E3D8",
        position: 'relative',
    },
    input: {
        position: 'relative',
        alignContent: 'flex-end',
        textAlign: 'center',
        color: '#fff',
        borderBottomWidth: 1,
        borderColor: '#000',
        fontSize: 34,
        height: 35,
        width: 150,

    },
    btn: {
        fontSize: 8,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'center',
        width: 150,
        height: 60,
        borderRadius: 4,
        marginLeft: 10,
        marginRight: 15,
        position: 'relative',
    },
    dltbtn: {
        fontSize: 8,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#c41c10",
        alignItems: 'center',
        alignSelf: 'center',
        width: 150,
        height: 60,
        borderRadius: 4,
        marginLeft: 15,
        right: '5%',
        position: 'relative',
    },

    log: {
        position: 'relative',
        textAlign: 'center',
        textAlign: 'center',

    },
    delete: {
        position: 'relative',
        textAlign: 'center',
        backgroundColor: "#c41c10",
        color: "#fff"

    }
})







