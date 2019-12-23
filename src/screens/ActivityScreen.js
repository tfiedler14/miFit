import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    Platform, AsyncStorage
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from "moment";


export default class ActivityScreen extends React.Component {

    getDate(givenDate) {
        return moment(givenDate).format('LLL');
    }
    static navigationOptions = {
        title: 'ActivityScreen',
        Home: 'LandingScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            actLen: '',
            actName: '',
            actCal: '',
            userName: '',
            userToken: '',
            activities: '',
        }
    }

    componentDidMount() {
        // this.getUserId();
        this.getUserId().then(() => {

            console.log("compenent mounted and userTOken and Id set!");
            const userToken = this.state.userToken;
            //now do a fetch of user to fill out state variables
            if (userToken) {



                fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
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
                            activities: response.activities
                        });
                    })
                    .catch((error) => { console.log("ERROR: " + error) })
            }
        });
    }


    getUserId = async () => {

        try {
            this.state.userToken = await AsyncStorage.getItem('userToken') || null;

            console.log("user caught");
            console.log("state: ", this.state);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        return;
    }

    saveUpdates = async () => {
        
        let temp = (this.state.date).substr(0, this.state.date.indexOf(' ')) + 'T';
        temp += (this.state.date).substr((this.state.date.indexOf(' ') + 1), this.state.date.length);
        
        let myDate = new Date(temp).toLocaleString("en-US", {timeZone: "America/Chicago"});
        myDate = new Date(myDate);  
        

        fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.userToken,
            },
            redirect: 'follow',
            body: JSON.stringify({
                "date": myDate,
                "name": this.state.actName,
                "duration" : this.state.actLen,
                "calories": this.state.actCal,
            })
        })
            .then((response) => {
                console.log("put response", response);
                if (response.status === 200) {
                    this.storeId(this.state.userToken);
                    this.props.navigation.navigate('Home');
                } else {
                    alert("Could not add activity. Make sure all fields are filled and try again later");
                }
            })
            .catch((error) => { console.log("ERROR: " + error) })

    }

    storeId = async (token) => {
        try {
            await AsyncStorage.setItem('totalAct', this.state.actCal);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userId', this.state.userName);
            await AsyncStorage.setItem('dailyAct', this.state.dail)
        } catch (error) {
            console.log("token storage error", error);
        }
    }


    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.banner}>Add Activity</Text>

                <View style={styles.feedBack}>
                    <View style={styles.subName}>
                        <Text style={styles.header}>Activity Name:</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            placeholder={this.state.actName}
                            placeholderTextColor="#37E3D8"
                            onChangeText={(actName) => this.setState({ actName })}
                            value={this.state.actName}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Length in Minutes: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={""}
                            keyboardType='numeric'
                            placeholderTextColor="#37E3D8"
                            onChangeText={(actLen) => this.setState({ actLen })}
                            value={this.state.actLen}
                            returnKeyType={'done'}
                        />
                    </View>

                    <View style={styles.subName}>
                        <Text style={styles.header}>Calories: </Text>
                        <TextInput
                            style={styles.input}
                            placeholder={""}
                            keyboardType='numeric'
                            placeholderTextColor="#37E3D8"
                            onChangeText={(actCal) => this.setState({ actCal })}
                            value={this.state.actCal}
                            returnKeyType={'done'}
                        />
                    </View>
                

                    <View style={styles.subName}>
                        <Text style={styles.header}>Date: </Text>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.date}
                            mode="datetime"
                            placeholder="select date"
                            format="YYYY-MM-DD HH:mm"
                            minDate="2019-01-01"
                            maxDate="2020-12-31"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                },
                                dateText: {
                                    color: '#FFF',
                                    fontWeight: "bold"
                                }
                                
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>

                    



                </View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.saveUpdates}>
                    <Text style={styles.log}>Save</Text>
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
        justifyContent: 'space-between',
        alignSelf: 'center',
        top: '14%',
        marginTop: 0,

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
        position: 'absolute',
        left: '50%',
        bottom: '5%',
        borderRadius: 12,
    },
    log: {
        right: '50%',
        bottom: '5%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'center',
        padding: 20,
        width: 175,
        borderRadius: 10

    }
})







