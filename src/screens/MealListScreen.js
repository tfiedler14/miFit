import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, AsyncStorage, ScrollView, SafeAreaView, TextComponent } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import moment from "moment";


export default class MealListScreen extends React.Component {

    static navigationOptions = {
        title: 'MealListScreen',
        Home: 'LandingScreen',
        Meal: 'MealScreen',
        Food: 'FoodScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            userToken: '',
            meals: '',
            foods: '',

            mealCal: 0,
            mealPro: 0,
            mealCarb: 0,
            mealFat: 0,
        }
    }



    componentDidMount() {
        this.getUserId().then(() => {

            console.log("compenent mounted and userToken and Id set!");

            const userToken = this.state.userToken;
            //now do a fetch of user to fill out state variables
            if (userToken) {
                console.log('Token:', userToken);

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
            await AsyncStorage.setItem('mealId', id.toString());
            await AsyncStorage.setItem('userToken', this.state.userToken);
            await AsyncStorage.setItem('userId', this.state.userName);
        } catch (error) {
            console.log("token storage error", error);
        }
    }


    getMeals() {

        
        console.log("made it to Meal");
        console.log(this.state.meals);
        return Object.values(this.state.meals).map((meal) => {
            console.log("****INDiviudal meal", meal);
            let date = moment(meal.date).format("MMM Do YYYY");
            this.getMealStats(meal.id);
            console.log("checking", this.state);

            return (
                <Card key={meal.id} containerStyle={styles.card} title={meal.name}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '75%', justifyContent: 'space-between', paddingBottom: 5 }} >
                        <Text style={styles.goals}>Date: {date}</Text>
                        <TouchableOpacity
                            style={styles.editBtn}
                            value="addFood"
                            onPress={() => {

                                this.storeActId(meal.id);
                                this.props.navigation.navigate('FoodScreen');
                            }}>
                            <Text style={styles.logIn}>Add Food</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', width: '75%', justifyContent: 'space-between', paddingBottom: 5 }} >
                        <Text style={styles.goals}>Calories: {this.state.mealCal}</Text>
                        <Text style={styles.goals}>Proteins: {this.state.mealPro}</Text>
                        <Text style={styles.goals}>Carbohydrates: {this.state.mealCarb}</Text>
                        <Text style={styles.goals}>Fats: {this.state.mealFat}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

                        <TouchableOpacity
                            style={styles.actBtn}
                            value="editMeal"
                            onPress={() => {
                                console.log("Leaving meal", meal.id);
                                this.storeActId(meal.id);
                                this.props.navigation.navigate('EditMealScreen');
                            }}>
                            <Text style={styles.logIn}>Edit Meal/foods</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actBtn}
                            value="delMeal"
                            onPress={() => {
                                return fetch('https://mysqlcs639.cs.wisc.edu/meals/' + meal.id, {
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
                                        alert("meal has been deleted");
                                        this.props.navigation.navigate('Home');
                                    })
                                    .catch((error) => { console.log("ERROR: " + error); });
                            }} >

                            <Text style={styles.logIn}>Delete Meal</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        })



    }





    getMealStats = async (mealId) => {
        console.log("trying...");
        let mealStats = null;
        try{
            mealStats = await AsyncStorage.getItem(mealId) || null;
            console.log("almost there...", mealStats);
            return mealStats;

        } catch(error){
            console.log('ERROR', error);
        }
        // console.log("trying to display foods", mealId);
        // let mealStats = {};
        // let foods = null;
        // let cal = 0;
        // let pro = 0;
        // let carb = 0;
        // let fat = 0;
         
        // try {
        //     await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId + '/foods/', {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'x-access-token': this.state.userToken,
        //         },
        //         redirect: 'follow'
        //     })
        //         .then(function (response) {
        //             return response.json();
        //         })
        //         .then((response) => {
        //             console.log("landed a response", response);
        //             foods = response.foods;
        //         })
        //         .catch((error) => { console.log("ERROR: " + error); });
        // } catch (error) {
        //     console.log("Error", error);
        // }

        // if (foods !== null) {
        //    Object.values(foods).forEach((food) => {
        //        console.log("this is where we are tom", food);
        //         cal += food.calories;
        //         pro += food.protein;
        //         carb += food.carbohydrates;
        //         fat += food.fat;

        //    });
           
        //    mealStats['cal'] = cal;
        //    mealStats['cal'] = cal;
        //    mealStats['cal'] = cal;
           
        //    this.state.mealCal = cal;
        //    this.state.mealPro = pro;
        //    this.state.mealCarb = carb;
        //    this.state.mealFat = fat;
        
        //    return;
        
        // }


    }




    render() {
        if (this.state.meals === null) {
            //loading
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Logged Meals:</Text>
                    <View style={styles.sectionHeight} >

                        <ScrollView style={{ paddingTop: '0%', marginTop: "20%", marginBottom: 25, }}
                            contentContainerStyle={{ top: '0%', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                            automaticallyAdjustContentInsets={false}
                            showsVerticalScrollIndicator={true}
                            directionalLockEnabled={true}
                            automaticallyAdjustContentInsets={false}
                            key={''}>
                            {this.getMeals()}


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
        top: '4%',
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
        // top: '12%',
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
    summary: {
        fontSize: 18,
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
        height: 30,
        borderRadius: 4,
        margin: 10,
        position: 'relative',

    }
})







