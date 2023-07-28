import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Button, Center } from 'native-base'
import { AntDesign } from "@expo/vector-icons"
import { View, Text, Modal, TextInput, StyleSheet, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as yup from 'yup';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { stylesSpinner } from "../../../shared/Styles";
import { getItem } from "../../../shared/LocalStorage";
import { getProjects, saveProject} from "../../../api/ProjectsApi";
import { ProjectsListView } from "./components/PorjectsListView";
import { IProject } from "../../../model/Project";
import { ICompany } from "../../../model/Company";
import { IUser } from "../../../model/User";

const data = {
    name: 'Divyesh Barad',
    email: 'divyesh@gmail.com',
    address: 'Rajkot',
}

const ProjectsList = () => {
    const [textSpinner, setTextSpinner] = useState('Cargando proyectos...');
    const [showSpinner, setShowSpinner] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const stylesSpinnerList = stylesSpinner();
    const [company, setCompany] = useState<ICompany>();
    const [user, setUser] = useState<IUser>();
    const [projects, setProjects] = useState<IProject[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const dateToday = new Date();
    const [stringDate, setStringDate] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    
    const handleConfirm = (value:Date) => {
        setDate(value);
        setStringDate(toStringDate(value));
        setDatePickerVisibility(false);
    };
    async function getUtils(){
        var result1 = await getItem('company');
        setCompany(JSON.parse(result1!));
        var result2 = await getItem('user');
        setUser(JSON.parse(result2!));
        await getProjectsList(JSON.parse(result1!));
    }
    useEffect(()=>{
        getUtils()
        setStringDate(toStringDate(date));
    },[])
    useEffect(()=>{
        /*
        if(company !== null){
            getProjectsList();
        }
        */
    },[])
    async function getProjectsList(companyP: ICompany){
        setProjects(await getProjects(companyP.Id!));
        setShowSpinner(false);
    }

    const loginValidationSchema = yup.object().shape({
        Name: yup
            .string()
            .required('Se requiere Nombre'),
        CreationDate: yup
            .date()
            .max(new Date())
            .required('Se requiere Fecha creación')
    })

    const toStringDate = (value:Date) => {
        var day = value.getDate();
        var month = value.getMonth() + 1;
        var year = value.getFullYear();

        return day + '-' + month + '-' + year;
    }

    const initialValuesForm =() =>{
        return {
            Name: '', 
            Description: '', 
            CreationDate: date,
        };
    }
 
    const createProject = async (values:any) => {
        setTextSpinner('Guardando proyecto...');
        setShowSpinner(true);
        var project:IProject = {
            Archived:false,
            CompanyId: company?.Id!,
            CreationDate: values.CreationDate,
            Description: values.Description,
            Name: values.Name,
            UserId: user?.Id!,
            key:''
        }
        const result = await saveProject(project);
        if(result !== null ){
            setShowSpinner(false);
            setModalVisible(false)
            project.Id = result;
            project.User = user;
            console.log(project)
            setProjects([...projects, project]);
        }else{
            setShowSpinner(false);
            return Alert.alert('Error', 'Intente nuevamente', [
                {text: 'OK', onPress: () => {}},
              ]
            );
        }
    }

    const html = `
        <html>
            <body>
                <h2>Hi ${data.name}</h2>
                <h4>Email: ${data.email}</h4>
                <h4>Address: ${data.address}</h4>
            </body>
        </html>
    `;

    const generatePdf = async () => {
        const file = await printToFileAsync({
            html: html,
            base64: false,
            
        });
        await shareAsync(file.uri);
    }

    return(
        <NativeBaseProvider>
            <Spinner
                visible={showSpinner}
                textContent={textSpinner}
                textStyle={stylesSpinnerList.spinnerTextStyle}
            />
            <View style={{alignItems:'center'}}>
                <Button
                    width="40%"
                    height={50}
                    backgroundColor='green.600'
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.labelButton}>Nuevo</Text>
                </Button>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTextTitle}>Nuevo Proyecto</Text>
                        <Formik 
                            validationSchema={loginValidationSchema}
                            initialValues={initialValuesForm()}
                            onSubmit={(values) => createProject(values)}
                        >
                            
                            {({ handleChange, handleBlur, handleSubmit, values, isValid, errors }) => (

                                <View style={{ height: 280, width:'80%', marginTop: 3, justifyContent: 'center' }} >
                                    <Text style={styles.label}>Nombre</Text>
                                    <TextInput style={styles.input}
                                        onChangeText={handleChange('Name')}
                                        onBlur={handleBlur('Name')}
                                        value={values.Name}
                                    />
                                    {errors.Name &&
                                        <Text style={{ marginLeft: 15, marginBottom: 10, fontSize: 10, color: 'red' }}>{errors.Name}</Text>
                                    }
                                    <Text style={styles.label}>Descripción</Text>
                                    <TextInput style={styles.input}
                                        onChangeText={handleChange('Description')}
                                        onBlur={handleBlur('Description')}
                                        value={values.Description}
                                    />

                                    <Text style={styles.label}>Fecha creación</Text>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems:'center'}}>
                                        <Button
                                            width="20"
                                            height='45'
                                            backgroundColor='muted.400'
                                            onPress={() => setDatePickerVisibility(true)}
                                            leftIcon={<AntDesign name="calendar" size={28} color="white" />}
                                        >
                                        </Button>
                                        <TextInput style={[styles.input, {width: '60%', color:'black'}]}
                                            editable={false}
                                            value={stringDate}
                                        />
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        maximumDate={dateToday}
                                        mode="date"
                                        date={date}
                                        onConfirm={(value)=> handleConfirm(value)}
                                        onCancel={()=>setDatePickerVisibility(false)}
                                    />

                                    <View style={styles.buttonFormActionContent}>
                                        <Button style={[styles.button, styles.buttonClose]}
                                            onPress={() => setModalVisible(!modalVisible)}
                                            height={50}
                                            colorScheme="red"
                                        ><Text style={styles.labelButton}>Cancelar</Text></Button>
                                        <Button style={[styles.button, styles.buttonSucces]}
                                            disabled={!isValid}
                                            onPress={()=>handleSubmit()}
                                            height={50}
                                            
                                        ><Text style={styles.labelButton}>Guardar</Text></Button>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>
            {
              projects.length === 0 ?
                <Center>
                  <Text>Sin proyectos</Text>
                </Center>
                :
                <ProjectsListView data={projects}/> 
            }
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
    buttonFormActionContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    input:{
        backgroundColor: '#d3dbd9',
        borderRadius: 5,
        margin: 3,
        height: 40,
        padding: 3,
    },
    label: {
        fontSize: 20,
    },
    labelButton:{
        fontSize: 20,
        color: 'white'
    },
    centeredView: {
        width: '90%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 3,
    },
    modalView: {
      margin: 3,
      backgroundColor: 'white',
      width: '90%',
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
        margin: 4,
        elevation: 2,
    },
    buttonSucces: {
      backgroundColor: 'green',
    },
    buttonClose: {
      backgroundColor: '#f21d41',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 3,
      textAlign: 'center',
    },
    modalTextTitle: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: "bold"
    },
});
export default ProjectsList;