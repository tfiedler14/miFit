import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    ScrollView, Platform, Dimensions, AsyncStorage
} from 'react-native';
import moment from "moment";
import { BarChart, Grid } from 'react-native-svg-charts'

// import {createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

const { height } = Dimensions.get('window');

export default class HistoryScreen extends React.Component {


    static navigationOptions = {
        title: 'HistoryScreen',
        Home: 'LandingScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            activityTot: 0,
            foods: [],
            meals: [],
            calTot: 0,
            proTot: 0,
            carbTot: 0,
            fatTot: 0,
        }
    }

    getDate(givenDate) {
        return moment(givenDate).format('LLL');
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

                fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
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
                            meals: response.meals
                        });
                    })
                    .then(() => this.configureMeals())
                    .then(() => this.configureWeek())
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

    configureMeals = async () => {

        let cal = 0;
        let pro = 0;
        let carb = 0;
        let fat = 0;
        let tempFood;

        console.log("configuring meals");
        Object.values(this.state.meals).forEach((meal) => {
            //make sure its within a week
            if (moment(meal.date).isSame(new Date(), 'week')) {


                console.log("checking meal", meal);
                fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id + '/foods/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': this.state.userToken,
                    },
                    redirect: 'follow'
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then((response) => {
                        console.log("landed a food response", response);
                        tempFood = response.foods;
                        this.setState({
                            foods: [...this.state.foods, response.foods]
                        });
                    })
                    .then(() => {
                        console.log("SPIDERMAN", tempFood);
                        Object.values(tempFood).forEach((food) => {
                            cal += food.calories;
                            pro += food.protein;
                            carb += food.carbohydrates;
                            fat += food.fat;
                            console.log("BATMAN", cal, pro, carb, fat);
                        })
                        cal += this.state.calTot;
                        pro += this.state.proTot;
                        carb += this.state.carbTot;
                        fat += this.state.fatTot;

                        this.setState({
                            calTot: cal,
                            proTot: pro,
                            carbTot: carb,
                            fatTot: fat
                        })

                    })
                    .catch((error) => { console.log("ERROR: " + error) })
            }
        })
    }

    configureWeek() {
        console.log("configuring week");

        console.log("HEYO", this.state.activities, this.state.foods);
        if (this.state.activities !== null) {
            Object.values(this.state.activities).forEach((act) => {
                console.log("act", act);
                this.setState({
                    activityTot: this.state.activityTot + act.calories
                })
            })
        }

        if (this.state.foods !== null) {
            Object.values(this.state.foods).forEach((food) => {
                console.log("food", food);
                this.setState({
                    calTot: this.state.calTot + parseFloat(food.calories),
                    proTot: this.state.proTot + parseFloat(food.protein),
                    carbTot: this.state.carbTot + parseFloat(food.carbohydrates),
                    fatTot: this.state.fatTot + parseFloat(food.fat),
                })

            })
        }

        console.log("week configured", this.state);
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
                "goalDailyProtein": this.state.dailyPro,
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


    render() {
        if (this.state.foods === null) {
            //loading
        } else {
            data = [this.state.activityTot, this.state.calTot, this.state.proTot, this.state.carbTot, this.state.fatTot]
            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Weekly Review</Text>


                    <BarChart style={{ position: 'absolute', top:'32%', paddingLeft:3, paddingRight:14, height: 200 }} data={data} svg={{ fill: '#37E3D8' }} contentInset={{ top: 30, bottom: 30 }}>
                        <Grid />
                    </BarChart>



                    <View style={{ flex: 1, flexDirection: 'row', positon: 'relative', top: '108%', marginLeft: 18, width: '100%' }} >
                        <Text style={styles.goals}>Activities: {this.state.activityTot}</Text>
                        <Text style={styles.goals}>Calories: {this.state.calTot}</Text>
                        <Text style={styles.goals}>Proteins: {this.state.proTot}</Text>
                        <Text style={styles.goals}>Carbs: {this.state.carbTot}</Text>
                        <Text style={styles.goals}>Fats: {this.state.fatTot}</Text>
                    </View>


                    <View style={{ position: 'absolute', top: '5%', width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={styles.editBtn}
                            value="edit"
                            onPress={() => this.props.navigation.navigate('Home')}>
                            <Text style={styles.logIn}>Back</Text>
                        </TouchableOpacity>


                    </View>

                </View>
            );
        }
    }



}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#635E5E',
        paddingTop: (Platform === 'ios') ? 20 : 0,
    },
    goals: {
        width: '21%',
        padding: 0,
        fontSize: 12,
        color: "#37E3D8",
        position: 'relative',
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
        position: 'absolute',
        left: 5,
        right: 5,
        padding: 0,
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

    },
    editBtn: {
        fontSize: 18,
        color: "#fff",
        justifyContent: 'center',
        backgroundColor: "#37E3D8",
        alignItems: 'center',
        padding: 0,
        width: 50,
        height: 30,
        borderRadius: 4,
        right: '525%',
        position: 'relative',
    },
})







