import React, { Component } from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from "./src/screens/LoginScreen";
import SignUp from "./src/screens/SignUp";
import LandingScreen from "./src/screens/LandingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ActivityScreen from "./src/screens/ActivityScreen";
import ActivityListScreen from "./src/screens/ActivityListScreen";
import EditActivityScreen from "./src/screens/EditActivityScreen";
import MealScreen from "./src/screens/MealScreen";
import MealListScreen from "./src/screens/MealListScreen";
import EditMealScreen from "./src/screens/EditMealScreen";
import FoodScreen from  "./src/screens/FoodScreen";
import HistoryScreen from "./src/screens/HistoryScreen";




const Project = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: LandingScreen,
    navigationOptions: {
      header: LandingScreen,
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      header: LandingScreen
    },
  },
  Activity: {
    screen: ActivityScreen,
    navigationOptions: {
      header: LandingScreen,
    }
  },
  ActivityList: {
    screen: ActivityListScreen,
    navigationOptions :{
        header: LandingScreen,
        EditActivity: EditActivityScreen,
    }
  },
  EditActivityScreen: {
    screen: EditActivityScreen,
    navigationOptions :{
      header: ProfileScreen,
    }
  },
  Meal: {
    screen: MealScreen,
    navigationOptions: {
      header: LandingScreen,
    }
  },
  MealList: {
    screen: MealListScreen,
    navigationOptions :{
        header: LandingScreen,
        EditMeal: EditMealScreen,
    }
  },
  EditMealScreen: {
    screen: EditMealScreen,
    navigationOptions :{
      header: ProfileScreen,
    }
  },
  MealListScreen: {
    screen: MealListScreen,
    navigationOptions:{
      header: null
    }
  },
  FoodScreen: {
    screen: FoodScreen,
    navigationOptions: {
      header: null,
    },
  },
  History: {
    screen: HistoryScreen,
    navigationOptions: {
      header: null,
    },
  },

});
export default createAppContainer(Project);