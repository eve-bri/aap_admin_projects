import { StyleSheet } from "react-native";

export const createStyleSaveArea = (insets) =>{
    return StyleSheet.create({
        saveArea: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }
    });
}

export const stylesSpinner = () => {
    return StyleSheet.create({
            spinnerTextStyle: {
            color: '#FFF'
            },
        });
}