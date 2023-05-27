import React, { useEffect, useCallback, useState } from "react";
import { getItem } from "../../../shared/LocalStorage"; 
import { NativeBaseProvider } from 'native-base'
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, TouchableOpacity, Button, Image } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { stylesSpinner } from "../../../shared/Styles";
import { getProjects } from "../../../api/ProjectsApi";

const ProjectsList = () => {
    const [showSpinner, setShowSpinner] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [company, setCompany] = useState(null);
    const [projects, setProjects] = useState([]);


    const getAllProjects = useCallback(async()=> {
        setCompany(JSON.parse(await getItem('Companay')));
        if(company !== null){
            setProjects(await getProjects(company.Id));
        }
        setShowSpinner(false)
    }, [])

    useEffect(()=>{
        getAllProjects();
    }, [])

    return(
        <NativeBaseProvider>
            <Spinner
                visible={showSpinner}
                textContent={'Cargando proyectos'}
                textStyle={stylesSpinner.spinnerTextStyle}
            />
            <View>
                <Button
                    width="90%"
                    title="Nuevo"
                    color="green"
                    onPress={() => setModalVisible(true)}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTextTitle}>Nuevo Proyecto</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <ScrollView> 
                {
                    projects.map((project) => {
                        return(
                            <TouchableOpacity key={project.Id} onPress={() => {}} style={stylesCard.button}>
                                <View style={stylesCard.view} > 
                                    <Text style={stylesCard.text}>{project.Name}</Text>
                                    <Text style={stylesCard.text}>{project.Description}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </NativeBaseProvider>
    );
}
const stylesCard = StyleSheet.create({
    view:{
        alignItems: 'center',
        flexDirection: 'column'
    },
    image: {
        height: 50,
        width: 150,
    },
    text:{
        fontSize: 20,
        marginBottom:5,
    },
    button: {
        backgroundColor: 'white',
        marginTop: 10,
        marginHorizontal: 10,
        padding: 10,
    },
})
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 3,
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
        fontSize: 30,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    modalTextTitle: {
      marginBottom: 5,
      textAlign: 'center',
      fontSize: 25,
      fontWeight: "bold"
    },
});
export default ProjectsList;