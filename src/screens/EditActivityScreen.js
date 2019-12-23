import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    Platform, AsyncStorage
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from "moment";


export default class EditActivityScreen extends React.Component {

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
            userId: '',
            userToken: '',
            activity: '',
            actId: '',
        }
    }

    componentDidMount() {
        // this.getUserId();
        this.getUserId().then(() => {

            console.log("compenent mounted and userTOken and Id set!");
            const userToken = this.state.userToken;
            const actId = this.state.actId;
            console.log("act ID", actId);
            //now do a fetch of user to fill out state variables
            if (userToken && actId) {

                fetch('https://mysqlcs639.cs.wisc.edu/activities/' + actId, {
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
                            actName: response.name,
                            actLen: response.duration,
                            actCal: response.calories,
                            date: response.date,
                        });
                    })
                    .catch((error) => { console.log("ERROR: " + error) })
            }
        });
    }


    getUserId = async () => {

        try {
            this.state.userToken = await AsyncStorage.getItem('userToken') || null;
            this.state.actId = await AsyncStorage.getItem('actId') || null;
            console.log("user caught");
            console.log("state: ", this.state);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        return;
    }

    saveUpdates = async () => {
        console.log("date", this.state.date);
        let temp = (this.state.date).substr(0, this.state.date.indexOf(' ')) + 'T';
        temp += (this.state.date).substr((this.state.date.indexOf(' ') + 1), this.state.date.length);

        let myDate = new Date(temp).toLocaleString("en-US", { timeZone: "America/Chicago" });
        myDate = new Date(myDate);
        console.log("mydate", this.state.myDay);
        console.log("inside updates!", this.state);

        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.state.actId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.userToken,
            },
            redirect: 'follow',
            body: JSON.stringify({
                "date": this.state.date,
                "name": this.state.actName,
                "duration": this.state.actLen,
                "calories": this.state.actCal
            })
        })
            .then((response) => {
                console.log("put response", response);
                if (response.status === 200) {
                    alert("Activity has been updated");
                    this.storeId(this.state.userToken);
                    this.props.navigation.navigate('Home');
                } else {
                    alert("Could not add activity. Try again later");
                    return response.json();
                }
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => { console.log("ERROR: " + error) })

    }

    storeId = async (token) => {
        try {
            await AsyncStorage.setItem('totalAct', this.state.actCal.toString());
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userId', this.state.userName);
        } catch (error) {
            console.log("token storage error", error);
        }
    }


    render() {
        if (this.state.actName === null) {
            //loading
        } else {
            console.log("NEW ACTIVITY INFO", this.state);
            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Edit Activity</Text>

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
                                placeholder={this.state.actLen}
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
                                placeholder={this.state.actCal}
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







