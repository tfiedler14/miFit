import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, AsyncStorage, ScrollView, SafeAreaView, TextComponent } from 'react-native';
import { Card } from 'react-native-elements';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import moment from "moment";


export default class ActivityListScreen extends React.Component {

    static navigationOptions = {
        title: 'ActivityListScreen',
        Home: 'LandingScreen',
        Activity: 'ActivityScreen'
    }

    constructor(props) {
        super(props);
        this.state = {
            userToken: '',
            activities: ''


        }
    }



    componentDidMount() {
        this.getUserId().then(() => {

            console.log("compenent mounted and userToken and Id set!");

            const userToken = this.state.userToken;
            //now do a fetch of user to fill out state variables
            if (userToken) {
                console.log('Token:', userToken);

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
            this.state.userName = await AsyncStorage.getItem('userId') || null;

            console.log("user caught");
            console.log("state: ", this.state);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        return;
    }

    storeActId = async (id) => {
        try {
            await AsyncStorage.setItem('actId', id.toString());
            await AsyncStorage.setItem('userToken', this.state.userToken);
            await AsyncStorage.setItem('userId', this.state.userName);
        } catch (error) {
            console.log("token storage error", error);
        }
    }


    getActivities() {

        console.log("made it to activity");
        console.log(this.state.activities);
        return Object.values(this.state.activities).map((act, index) => {
            let date = moment(act.date).format("MMM Do YYYY");
            return (
                <Card key={act.name} containerStyle={styles.card} title={act.name}>
                    <Text style={styles.goals}>Length: {act.duration}</Text >
                    <Text style={styles.goals}>Calories: {act.duration}</Text >
                    <Text style={styles.goals}>Date: {date}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        <TouchableOpacity
                            style={styles.actBtn}
                            value="editActivity"
                            onPress={() => {
                                console.log("Leaving activity", act.id);
                               this.storeActId(act.id);
                               this.props.navigation.navigate('EditActivityScreen');
                            }}>
                            <Text style={styles.logIn}>Edit Activity</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actBtn}
                            value="delActivity"
                            onPress={()  => {
                                    return fetch('https://mysqlcs639.cs.wisc.edu/activities/' + act.id, {
                                        method: 'DELETE',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json',
                                            'x-access-token': this.state.userToken,
                                        },
                                        redirect: 'follow'
                                    })
                                        .then((response) => {
                                            console.log("landed a response", response);
                                            alert("activity has been deleted");
                                            this.props.navigation.navigate('Home');
                                        })
                                        .catch((error) => { console.log("ERROR: " + error); });
                                }} >
                            
                                    <Text style={styles.logIn}>Delete Activity</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        })



    }










    render() {
        if (this.state.activities === null) {
            //loading
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Logged Activities:</Text>
                    <View style={styles.sectionHeight} >

                        <ScrollView style={{ paddingTop: '0%', marginTop: "20%", marginBottom: 25, }}
                            contentContainerStyle={{ top: '0%', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                            automaticallyAdjustContentInsets={false}
                            showsVerticalScrollIndicator={true}
                            directionalLockEnabled={true}
                            automaticallyAdjustContentInsets={false}
                            key={''}>
                            {this.getActivities()}
                        </ScrollView>

                    </View>
                </View>

            );
        }
    }



}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#635E5E',


    },

    banner: {
        flex: 1,
        fontSize: 30,
        textAlign: 'center',
        alignSelf: 'flex-start',
        position: 'absolute',
        color: "#37E3D8",
        marginLeft: 2,
        top: '4%'
    },
    editBtn: {
        fontSize: 18,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: 0,
        width: 80,
        height: 30,
        borderRadius: 4,
        margin: 0,
        position: 'relative',
        top: '12%',
    },
    sectionHeight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    activity: {
        // paddingTop: '0%',
        // marginTop: '0%',

        // fontSize: 26,
        // textAlign: 'left',
        // alignSelf: 'center',
        // height: '40%',
        // width: '100%',

        // color: "#37E3D8",
        // position: 'relative',
    },
    card: {
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10

    },
    goals: {
        width: '100%',
        paddingLeft: 0,
        paddingRight: 40,
        paddingBottom: 20,
        fontSize: 26,
        color: "#635E5E",
        position: 'relative',
    },
    actBtn: {
        fontSize: 8,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'center',
        width: 150,
        height: 60,
        borderRadius: 4,
        margin: 10,
        position: 'relative',

    }
})







