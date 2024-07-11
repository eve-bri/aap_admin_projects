import React from 'react'
import  {PaperProvider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'; 
import { NativeStackHeaderProps, createNativeStackNavigator } from '@react-navigation/native-stack';
//Screen
import SelectCompany from '../screens/login/SelectCompany';
import Login from '../screens/login/Login';
import ProjectsList from '../screens/home/projects/ProjectsList';
import Profile from '../screens/home/profile/Profile';
import Help from '../screens/home/help/Help';
import CustomHeader from '../components/CustomHeader';
import BugReport from '../screens/home/bug_report/BugReport';
import ProjectDetails from '../screens/home/projects/ProjectDetails';
import Register from '../screens/login/Register';

const Stack = createNativeStackNavigator();

export const Navigator = () => {
    return (
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            header: ({ navigation, route, options }: NativeStackHeaderProps) => <CustomHeader navigation={navigation} route={route} options={options}/>,
                        }}
                    >
                        <Stack.Screen name='Login' component={Login}/>
                        <Stack.Screen name='Register' component={Register}/>
                        <Stack.Screen name="ProjectsList" component={ProjectsList}/>
                        <Stack.Screen name="Profile" component={Profile}/>
                        <Stack.Screen name="Help" component={Help}/>
                        <Stack.Screen name="BugReport" component={BugReport}/>
                        <Stack.Screen name="ProjectDetails" component={ProjectDetails}/>
                    </Stack.Navigator>
                </NavigationContainer>
        </PaperProvider>
    );
}