import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Center } from 'native-base'
import { AntDesign } from "@expo/vector-icons"
import { View, Text, Modal, TextInput, StyleSheet, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as yup from 'yup';
import { stylesSpinner } from "../../../shared/Styles";
import { getItem } from "../../../shared/LocalStorage";
import { getProject} from "../../../api/ProjectsApi";

const ProjectDetails = (data) => {
    console.log(data.route.params.data.item);
    return(
        <NativeBaseProvider>
            <Center>
                <Text>Detalles Proyectos</Text>
            </Center>
        </NativeBaseProvider>
    );

}

export default ProjectDetails;