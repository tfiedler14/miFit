import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    Platform, AsyncStorage, TabBarIOS, ScrollView
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from "moment";
import Picker from 'react-native-picker';
import { Card } from 'react-native-elements';

export default class MealScreen extends React.Component {

    getDate(givenDate) {
        return moment(givenDate).format('LLL');
    }
    static navigationOptions = {
        title: 'MealScreen',
        Home: 'LandingScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            id: '',
            // mealType: '',
            mealName: '',
            userToken: '',
            // foods: [],
            // totals: [
            //     { Calories: 0 },
            //     { Proteins: 0 },
            //     { Fats: 0 },
            //     { Carbohydrates: 0 }
            // ]
        }
    }


    componentDidMount() {
        this.getUserId();
    }


    getUserId = async () => {

        try {
            this.state.userToken = await AsyncStorage.getItem('userToken') || null;
            // let temp = await AsyncStorage.getItem('foodId') || null;
            // this.state.foods.push(temp);
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

        let myDate = new Date(temp).toLocaleString("en-US", { timeZone: "America/Chicago" });
        myDate = new Date(myDate);


        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.state.userToken,
            },
            redirect: 'follow',
            body: JSON.stringify({
                "date": myDate,
                "name": this.state.mealName,
            })
        })
            .then((response) => {
                console.log("put response", response);
                if (response.status === 200) {
                    this.storeId();
                    alert("Meal has been created. Customize this meal from your meal list");
                    this.props.navigation.navigate('Home');
                } else {
                    alert("Could not add meal. Make sure all fields are filled and try again later");
                }
            })
            .catch((error) => { console.log("ERROR: " + error) })

    }

    storeId = async () => {
        try {
            await AsyncStorage.setItem('userToken', this.state.userToken);
        } catch (error) {
            console.log("token storage error", error);
        }
    }

  


    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.banner}>Add a Meal</Text>
                <View style={styles.feedBack}>
                    <Card containerStyle={styles.card} >
                        
                    <View style={styles.subName}>
                            <Text style={styles.header}>Name:</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                onChangeText={(mealName) => this.setState({ mealName })}
                                value={this.state.mealName}
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
                                        marginLeft: 36,
                                        colors: '#fff'
                                    },
                                    dateText: {
                                        color: '#635E5E',
                                        fontWeight: "bold"
                                    }

                                }}
                                onDateChange={(date) => { this.setState({ date: date }) }} />

                        </View>

                    </Card>

                </View>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.saveUpdates}>
                    <Text style={styles.log}>Create Meal</Text>
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
        paddingTop: 25,
        justifyContent: 'space-between'
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
        color: '#635E5E',
        borderBottomWidth: 1,
        borderColor: '#000',
        fontSize: 34,
        height: 35,
        width: 150,
    },
    btn: {
        position: 'absolute',
        borderRadius: 12,
        bottom: '5%',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'center',
        padding: 20,
        width: '90%',
        height: '10%',
        borderRadius: 12
    },
    log: {
        fontSize: 25
    },
    addFood: {
        position: 'relative',
        left: '50%',
        bottom: '25%'

    },
    card: {
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        alignSelf: 'center',
        marginTop: '0%',
        top: '0%'

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







