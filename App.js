// In App.js in a new project

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from "react-native-elements";
import Saved from './components/Saved';
import Home from './components/Home';
import Settings from './components/Settings'


const Tab = createBottomTabNavigator();

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    color: 'aliceblue'
  }

  componentDidMount() {
   
  }

  changeBackgroundColor = () => {

  }

  render() {

  
  return (
    
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home';
            } else if (route.name === 'Saved') {
              iconName = focused ? 'bookmark' : 'bookmark-border';
            }
            return <Icon name={iconName}/>
          },
        })}
        >
          
        <Tab.Screen name="Home" component={Home} options={({ route }) => ({ color: this.state.color, changeColor: this.changeBackgroundColor() })}/>
        <Tab.Screen name="Saved" component={Saved}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
}