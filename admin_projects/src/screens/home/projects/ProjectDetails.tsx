import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Center } from 'native-base'
import { AntDesign } from "@expo/vector-icons"
import { Card } from 'react-native-elements'
import { View, Text, Modal, TextInput, StyleSheet, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as yup from 'yup';
import { stylesSpinner } from "../../../shared/Styles";
import { getItem } from "../../../shared/LocalStorage";
import { getProject} from "../../../api/ProjectsApi";
import { green800 } from "react-native-paper/lib/typescript/src/styles/themes/v2/colors";

const ProjectDetails = (data:any) => {
    const project = data.route.params.data.item;
    const [profit, setProfit] = useState<number>(0);
    const [spend, setSpend] = useState<number>(0);
    
    
    return(
        <NativeBaseProvider>
            <View style={styles.container}>
                <View style={[styles.border, styles.viewInformationProject]}>
                    <View style={[styles.nameProject]}>
                        <Text style={[styles.textName]}>{project.Name}</Text>
                    </View>
                    <View style={[styles.nameProject]}>
                        <Text style={[styles.textName]}>{project.Description}</Text>
                    </View>
                    <View style={[styles.containerRow]}>
                        <View style={[styles.containerProfits]}>
                            <Text style={[styles.textName, styles.textColorProfit]}>Ingresos</Text>
                            <Text style={[styles.textName, styles.textColorProfit]}>{profit}</Text>
                        </View>
                        <View style={[styles.containerSpent]}>
                            <Text style={[styles.textName, styles.textColorSpend]}>Gastos</Text>
                            <Text style={[styles.textName, styles.textColorSpend]}>{spend}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.containerRow]}>
                        <View style={[styles.containerTitleTask]}>
                            <Text style={[styles.textName, styles.textColorTitleTask]}>Tareas</Text>
                        </View>
                        <View style={[styles.containerActionTask]}>
                            <AntDesign onPress={()=>console.log('Agregar area')} name="plus" size={25} color="black" />
                        </View>
                </View>
            </View>
        </NativeBaseProvider>
    );

}

const styles = StyleSheet.create({
    viewInformationProject:{
        height: 130,
    },
    border: {
      borderWidth: 1,
      borderRadius: 20,
    },
    nameProject:{
        alignItems: 'center'
    },
    textName:{
        fontSize: 20,
        fontWeight: "bold"
    },
    container: {
      margin: 5,
    },
    containerRow: {
        flexDirection: 'row',
        marginTop: 15,
    },
    containerProfits: {
        width: '50%',
        alignItems: 'center',
    },
    containerSpent: {
        width: '50%',
        alignItems: 'center',
    },
    textColorProfit:{
        color: 'green'
    },
    textColorSpend:{
        color: 'red'
    },
    containerTitleTask: {
        width: '70%',
        alignItems: 'center',
    },
    containerActionTask: {
        width: '30%',
        alignItems: 'center',
    },
    textColorTitleTask:{
        color: 'gray'
    },
    
  });
export default ProjectDetails;