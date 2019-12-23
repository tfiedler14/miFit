import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Card} from 'react-native-elements';



export default class LandingScreen extends React.Component {

    static navigationOptions = {
        title: 'LandingScreen',
        Profile: 'ProfileScreen',
        Activity: 'ActivityScreen',
        ActivityList: 'ActivityListScreen',
        Login: 'LoginScreen',
        History: 'HistoryScreen',
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

            currCal: 0,
            currPro: 0,
            currCarb: 0,
            currFat: 0,


            actGoal: 0,
            incAct: 0,
        }
    }


    clearUser() {
        this.setState({
          firstName: '',
          lastName: '',
          userName: '',
          passWord: '',
        });
        AsyncStorage.clear();
        return;
      }

    componentDidMount() {
       this.getUserId().then(() => {

            console.log("compenent mounted and userToken and Id set!");
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



                // if (this.state.incAct !== null) {
                //     let temp = Number(this.state.totalAct) + Number(this.state.incAct);
                    
                // }
            }
        });
    }


    getUserId = async () => {

        try {
            let tempCal = await AsyncStorage.getItem('mealCal') || 0;
            let tempPro = await AsyncStorage.getItem('mealPro') || 0;
            let tempCarb = await AsyncStorage.getItem('mealCarb') || 0;
            let tempFat = await AsyncStorage.getItem('mealFat') || 0;

            console.log("TOMBO", tempCal, tempPro,tempCarb,tempFat);
            this.state.currCal = parseFloat(tempCal);
            this.state.currPro = parseFloat(tempPro);
            this.state.currCarb = parseFloat(tempCarb);
            this.state.currFat = parseFloat(tempFat);

            this.state.dailyCal = await AsyncStorage.getItem('dailyCal');
            this.state.dailyPro = await AsyncStorage.getItem('dailyPro');
            this.state.dailyCarb = await AsyncStorage.getItem('dailyCarb');
            this.state.dailyFat = await AsyncStorage.getItem('dailyFat');

            this.state.actGoal = await AsyncStorage.getItem('actGoal');
            let temp = await AsyncStorage.getItem('totalAct') || null;
            temp += this.state.incAct;
            this.state.incAct = temp;
            this.state.firstName = await AsyncStorage.getItem('firstName') || null;
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




    render() {
     
   
        return (
            
            <View style={styles.container}>
                <Text style={styles.banner}>Today's log:</Text>
                <View style={styles.sectionHeight} >

                    <ScrollView style={{ paddingTop: '0%', marginTop: "6%", marginBottom: 0 }}
                        contentContainerStyle={{ top: '0%', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={true}
                        directionalLockEnabled={true}
                        automaticallyAdjustContentInsets={false}>

                        <Card containerStyle={styles.card} title='Activity'>

                            <Text style={styles.goals}>Today's Activity: {this.state.incAct} / {this.state.actGoal}</Text >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                <TouchableOpacity
                                    style={styles.actBtn}
                                    value="addActivity"
                                    onPress={() => this.props.navigation.navigate('Activity')}>
                                    <Text style={styles.logIn}>Add Activity</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actBtn}
                                    value="viewActivity"
                                    onPress={() => this.props.navigation.navigate('ActivityList')}>
                                    <Text style={styles.logIn}>View Activities</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>

                        <Card containerStyle={styles.card} title='Meals'>
                            <Text style={styles.goals}>Calories: {this.state.currCal} / {this.state.dailyCal}</Text>
                            <Text style={styles.goals}>Proteins: {this.state.currPro} / {this.state.dailyCal}</Text>
                            <Text style={styles.goals}>Carbohydrates: {this.state.currCarb} / {this.state.dailyCal}</Text>
                            <Text style={styles.goals}>Fats: {this.state.currFat} / {this.state.dailyCal}</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                <TouchableOpacity
                                    style={styles.actBtn}
                                    value="addMeal"
                                    onPress={() => this.props.navigation.navigate('Meal')}>
                                    <Text style={styles.logIn}>Add Meal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actBtn}
                                    value="viewMeal"
                                    onPress={() => this.props.navigation.navigate('MealList')}>
                                    <Text style={styles.logIn}>View Meals</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                        <Card containerStyle={styles.card} title='History'>
                            

                            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                <TouchableOpacity
                                    style={styles.actBtn}
                                    value="addMeal"
                                    onPress={() => this.props.navigation.navigate('History')}>
                                    <Text style={styles.logIn}>Check your week!</Text>
                                </TouchableOpacity>
                                
                            </View>
                        </Card>

                    </ScrollView>

                </View>

            <View style={{position: 'absolute', top: '5%', width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
                    style={styles.logBtn}
                    value="logout"
                    onPress={() => {
                        this.clearUser();
                        this.props.navigation.navigate('Login');
                        }}>
                    <Text style={styles.logIn}>Sign out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editBtn}
                    value="edit"
                    onPress={() => this.props.navigation.navigate('Profile')}>
                    <Text style={styles.logIn}>Edit Profile</Text>
                </TouchableOpacity>

               
                </View> 
            </View>

        );
        
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
        alignSelf: 'center',
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
        padding: 0,
        width: 80,
        height: 30,
        borderRadius: 4,
        left: '325%',
        position: 'relative',
    },
    logBtn: {
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
        right: '325%',
        position: 'relative',

        
    },
    sectionHeight: {
        position: 'absolute',
        top: 0,
        marginTop: '15%',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    card: {
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        width: '95%',
        alignSelf: 'center'

    },
    goals: {
        width: '100%',
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







