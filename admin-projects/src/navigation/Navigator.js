import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//Screen
import SelectCompany from '../screens/login/SelectCompany';
import Login from '../screens/login/Login';
import ProjectsList from '../screens//home/projects/ProjectsList';
import Profile from '../screens/home/profile/Profile';
import Help from '../screens/home/help/Help';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const Navigator = () => {
    /**
     <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
     */
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown:false,
            }}
        >
            <Stack.Screen name='SelectCompany' component={SelectCompany}/>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name="ProjectsList" component={ProjectsList}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="Help" component={Help}/>
       </Stack.Navigator>
    );
}