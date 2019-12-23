import React from 'react';
import {
    StyleSheet, TextInput, TouchableOpacity, Text, View,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard,
    Platform, AsyncStorage, ScrollView
} from 'react-native';
import moment from "moment";
import { Card } from 'react-native-elements';



export default class FoodScreen extends React.Component {


    static navigationOptions = {
        title: 'FoodScreen',
        Home: 'MealListScreen',
    }

    constructor(props) {
        super(props);
        this.state = {
            foods: '',
            foodId: '',
            mealId: '',
        }
    }

    componentDidMount() {

        this.getUserId().then(() => {
            console.log('fetching foods');

            fetch('https://mysqlcs639.cs.wisc.edu/foods/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
                .catch((error) => { console.log("ERROR: " + error) })
        });


    }

    getUserId = async () => {

        try {

            this.state.userToken = await AsyncStorage.getItem('userToken') || null;
            this.state.userName = await AsyncStorage.getItem('userId') || null;
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



        fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.mealId + '/foods/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            redirect: 'follow',
            body: JSON.stringify({
                "name": this.state.actName,
                "duration": this.state.actLen,
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
            await AsyncStorage.setItem('foodId', this.state.foodId);
        } catch (error) {
            console.log("token storage error", error);
        }
    }



    getFoods() {

        console.log("made it to foods");
        console.log(this.state.foods);
        return Object.values(this.state.foods).map((food, index) => {

            return (
                <Card key={food.id} containerStyle={styles.card} titleStyle={{ color: '#635E5E', textTransform: 'capitalize' }} title={food.name}>
                    <Text style={styles.goals}>Calories: {food.calories}</Text>
                    <Text style={styles.goals}>Fat: {food.fat}</Text>
                    <Text style={styles.goals}>Protein: {food.protein}</Text>
                    <Text style={styles.goals}>Carbohydrates: {food.calories}</Text>
                    <Text style={styles.goals}>Per : {food.measure}</Text>


                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

                        <TouchableOpacity
                            style={styles.actBtn}
                            value="addFood"
                            onPress={() => {
                                return fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.mealId + '/foods/', {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'x-access-token': this.state.userToken,
                                    },
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        "name" : food.name,
                                        "calories" : food.calories,
                                        "protein": food.protein,
                                        "carbohydrates": food.carbohydrates,
                                        "fats": food.fats       
                                    })
                                })
                                    .then((response) => {
                                        console.log("FOOOOOOD RESPONSE", response);
                                        alert("food has been added");
                                        this.props.navigation.navigate('MealList');
                                    })
                                    .catch((error) => { console.log("ERROR: " + error); });
                            }} >

                            <Text style={styles.logIn}>Add Food</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            );
        });
    }



    render() {
        if (this.state.foodId === null) {
            //loading
        } else {

            return (
                <View style={styles.container}>
                    <Text style={styles.banner}>Add a Food</Text>
                    <View style={styles.sectionHeight} >

                        <ScrollView style={{ paddingTop: '0%', marginTop: "20%", marginBottom: 25, }}
                            contentContainerStyle={{ top: '0%', alignItems: 'center' }}
                            automaticallyAdjustContentInsets={false}
                            showsVerticalScrollIndicator={true}
                            directionalLockEnabled={true}
                            automaticallyAdjustContentInsets={false}
                            key={''}>
                            {this.getFoods()}


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

    },
    card: {
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%'
    },
    goals: {
        flex:1,
        paddingLeft: 0,
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







