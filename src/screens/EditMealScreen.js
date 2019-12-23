import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    Platform, AsyncStorage, ScrollView
} from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from "moment";


export default class EditMealScreen extends React.Component {

    getDate(givenDate) {
        return moment(givenDate).format('LLL');
    }
    static navigationOptions = {
        title: 'EditMealScreen',
        Home: 'LandingScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            mealName: '',
            userToken: '',
            meal: '',
            mealId: '',
            foods: '',
            foodId: '',

            totalCal: 0,
            totalPro: 0,
            totalCarb: 0,
            totalFat: 0,

        }
    }

    componentDidMount() {
        // this.getUserId();
        this.getUserId().then(() => {

            console.log("compenent mounted and userTOken and Id set!");
            const userToken = this.state.userToken;
            const mealId = this.state.mealId;
            console.log("act ID", mealId);
            //now do a fetch of user to fill out state variables
            if (userToken && mealId) {

                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods/', {
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
                            foods: response.foods
                        });
                    })
                    .then(() => {
                        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId, {
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
                                    mealName: response.name,
                                    date: response.date
                                });
                            })
                    })

                    .catch((error) => { console.log("ERROR: " + error) })
            }
        });
    }


    getUserId = async () => {

        try {
            //this.state.foods = await AsyncStorage.getItem('foods') || null;
            this.state.userToken = await AsyncStorage.getItem('userToken') || null;
            this.state.mealId = await AsyncStorage.getItem('mealId') || null;
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

        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.mealId, {
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
        console.log("CHECK HERE FOR DUB", this.state);
        try {
           // this will store everything for the total day.
            if(this.state.totalCal !== NaN){
                await AsyncStorage.setItem('mealCal' , (this.state.totalCal / 2.0).toString());
            } else {
                await AsyncStorage.setItem('mealCal' , "0");
            }

            if(this.state.totalPro !== NaN){
                await AsyncStorage.setItem('mealPro' , (this.state.totalPro / 2.0).toString());
            } else {
                await AsyncStorage.setItem('mealPro', "0");
            }

            if(this.state.totalCarb !== NaN){
                await AsyncStorage.setItem('mealCarb', (this.state.totalCarb / 2.0).toString());
            } else {
                await AsyncStorage.setItem('mealCarb', "0");
            }
            console.log(this.state.totalFat);
            if(this.state.totalFat !== NaN){
                await AsyncStorage.setItem('mealFat', (this.state.totalFat / 2.0).toString());
            } else {
                await AsyncStorage.setItem('mealFat' , "0");
            }
           
    

            await AsyncStorage.setItem('userToken', token);
        } catch (error) {
            console.log("token storage error", error);
        }
    }


    getFoods() {

        console.log("made it to activity");
        console.log(this.state.foods);
        return Object.values(this.state.foods).map((food, index) => {
        
            this.state.totalCal += food.calories;
            this.state.totalPro += food.protein;
            this.state.totalCarb += food.carbohydrates;
            this.state.totalFat += food.fat;
           

            return (
                <Card  key={food.id} containerStyle={styles.card} titleStyle={{textTransform: 'capitalize'}} title={food.name}>
                    <Text style={styles.goals}>Calories: {food.calories}</Text >
                    <Text style={styles.goals}>Protein: {food.protein}</Text >
                    <Text style={styles.goals}>Carbohydrates: {food.carbohydrates}</Text >
                    <Text style={styles.goals}>Fats: {food.fat}</Text >

                    <View style={{ position: 'absolute', right: '0%', top: '40%', justifyContent: 'center', }}>
                        <TouchableOpacity
                            style={styles.actBtn}
                            value="delFood"
                            onPress={() => {
                                return fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.mealId + '/foods/' + food.id, {
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
                                        alert("food item has been deleted");
                                        this.props.navigation.navigate('Home');
                                    })
                                    .catch((error) => { console.log("ERROR: " + error); });
                            }} >

                            <Text style={{color: '#635E5E', fontWeight: "bold"}}>X</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        })
    }

    render() {
        if (this.state.mealName === null) {
            //loading
        } else {
            console.log("NEW Meal INFO", this.state);
            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Edit Meal</Text>

                    <View style={styles.feedBack}>
                        <View style={styles.subName}>
                            <Text style={styles.header}>Meal Name:</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='none'
                                placeholder={this.state.mealName}
                                placeholderTextColor="#37E3D8"
                                onChangeText={(mealName) => this.setState({ mealName })}
                                value={this.state.mealName}
                                returnKeyType={'done'}
                            />
                        </View>

                        <View style={styles.subName}>
                            <Text style={styles.header}>Date: </Text>
                            <DatePicker
                                style={{ width: 200}}
                                date={this.state.date}
                                mode="datetime"
                                placeholder={this.state.date}
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
                                        marginLeft: 0,
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

                    <View style={styles.sectionHeight} >
                        <View style={styles.subName} >
                            <Text style={styles.header}>Foods:</Text>
                            <ScrollView style={{ paddingTop: '0%', marginTop: "8%",}}
                                contentContainerStyle={{ top: '0%', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                                automaticallyAdjustContentInsets={false}
                                showsVerticalScrollIndicator={true}
                                directionalLockEnabled={true}
                                key={''}>
                                {this.getFoods()}
                            </ScrollView>
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
        width: '100%',
        height: '20%',
        justifyContent: 'flex-start',
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
    },
    sectionHeight: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',

        alignItems: 'center',
        width: '100%',
        height: '65%',
        top: '32%'
    },
    card: {
        flex: 1,
        width: '90%',
        marginLeft: 0,
        marginRight: 0,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
        paddingTop: 0,
    },
    actBtn: {
        fontSize: 8,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        alignSelf: 'center',
        width: 30,
        height: 30,
        borderRadius: 4,
        margin: 10,
        position: 'relative',
    }
})







