import React from 'react'
import { View, Text, StyleSheet } from "react-native";

export const TitileScreen = ({data})=>{
    return(
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
                {data}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
    },
    titleText: {
        alignItems: 'center',
        fontSize: 25,
    }
})