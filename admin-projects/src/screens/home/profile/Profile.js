import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Text, View, NativeBaseProvider } from 'native-base'

const Profile = () => {
    return(
        <NativeBaseProvider>
            <Text> Hola </Text>
        </NativeBaseProvider>
    );
}

export default Profile;