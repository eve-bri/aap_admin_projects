import React from 'react'
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screen
import SelectCompany from '../screens/login/SelectCompany';
import Login from '../screens/login/Login';
import ProjectsList from '../screens//home/projects/ProjectsList';
import Profile from '../screens/home/profile/Profile';
import Help from '../screens/home/help/Help';
import CustomHeader from '../components/CustomHeader';
import BugReport from '../screens/home/bug_report/BugReport';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        header: (props) => <CustomHeader {...props} />,
                      }}
                >
                    <Stack.Screen name='SelectCompany' component={SelectCompany}/>
                    <Stack.Screen name='Login' component={Login}/>
                    <Stack.Screen name="ProjectsList" component={ProjectsList}/>
                    <Stack.Screen name="Profile" component={Profile}/>
                    <Stack.Screen name="Help" component={Help}/>
                    <Stack.Screen name="BugReport" component={BugReport}/>
                </Stack.Navigator>
            </NavigationContainer>
       </PaperProvider>
    );
}