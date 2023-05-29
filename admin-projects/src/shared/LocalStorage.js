import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (name, value) =>{
    await AsyncStorage.setItem(name, value);
}

export const getItem = async (name) => {
    return await AsyncStorage.getItem(name);
}