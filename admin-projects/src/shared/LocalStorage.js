import { Storage } from 'expo-storage'

export const setItem = async (name, value) =>{
    await Storage.setItem({
        key: name,
        value: value
    })
}

export const getItem = async (name) => {
    return await Storage.getItem({ key: name })
}