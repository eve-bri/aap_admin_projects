import React, {useEffect,useCallback, useState} from "react";
import { useNavigation } from '@react-navigation/native';
import { Input, Icon, Text, View, Button, NativeBaseProvider } from 'native-base'
import { StyleSheet, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import Spinner from 'react-native-loading-spinner-overlay';
import { Formik } from 'formik';
import * as yup from 'yup';
import  {createStyleSaveArea} from '../../shared/Styles'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TitileScreen } from "../../components/TitleScreen";
import { NoLogo } from "../../shared/Links";

import { getItem,setItem } from "../../shared/LocalStorage";
import {deleteUserToken, saveUserToken, updateActiveToken} from "../../api/UserTokenApi"
import { verifyLoginUser } from "../../api/UserApi";
import { getIpAddress } from "../../shared/General";

const Login = () => {
    const navegation = useNavigation()
    const insets = useSafeAreaInsets();
    const styles = createStyleSaveArea(insets)
    const [company, setCompany] = useState();
    const [inputPassword, setInputPassword]  = useState('password');
    const [showSpinner, setShowSpinner] = useState(false);
    const getStorageInfo = useCallback(async()=> {
        const result = JSON.parse(await getItem('company'));
        setCompany(result);
    }, [])
    useEffect(() =>{
        getStorageInfo();
    },[]);

    const loginValidationSchema = yup.object().shape({
        UserName: yup
            .string()
            .required('Se requiere Usuario'),
        Password: yup
            .string()
            .required('Se requiere contraseña'),
    })

    const login = async(values) => {
        setShowSpinner(true);
        var user = await verifyLoginUser(values.UserName, values.Password, company.Id);
        if(user !== null){
            await setItem('user',JSON.stringify(user));
            var userToken = JSON.parse(await getItem('userToken'));
            if(userToken !== null){
                userToken.UserId = user.Id;
                userToken.CompanyId = company.Id;
                userToken.Active = true;
                const login = await updateActiveToken(userToken)
                if(login){
                    await setItem('userToken',JSON.stringify(userToken));
                    setShowSpinner(false);
                    return navegation.push('ProjectsList');
                }else{
                    setShowSpinner(false);
                    return Alert.alert('Error', 'Intente nuevamente', [
                        {text: 'OK', onPress: () => {}},
                      ]
                    );
                }
            }
            const ipAddress = await getIpAddress();
            const data ={
                CompanyId: company.Id,
                IpAddress: ipAddress,
                UserId: user.Id
            }
            userToken = await saveUserToken(data);
            if(userToken !== null){
                await setItem('userToken', JSON.stringify(userToken));
                setShowSpinner(false);
                return navegation.push('ProjectsList');
            }else{
                setShowSpinner(false);
                return Alert.alert('Error', 'Intente nuevamente', [
                        {text: 'OK', onPress: () => {}},
                    ]
                );
            }
        }else{
            setShowSpinner(false);
            Alert.alert('Error', 'Datos incorrectos', [
                    {text: 'OK', onPress: () => {}},
                  ]
            );
        }
    }

    const showPassword = () =>{
        if(inputPassword === 'password'){
            setInputPassword('text');
        }else{
            setInputPassword('password');
        }
    }

    const goToSelectCompany = async () => {
        var userToken = JSON.parse(await getItem('userToken'));
        if(userToken !== null){
            await deleteUserToken(userToken.id);
        }
        navegation.push('SelectCompany')
    }

    return(
        <NativeBaseProvider>
            <View  style={styles.saveArea}>
                <TitileScreen data={'Iniciar Sesión'}/>
                <View style={stylesForm.container}>
                    <Spinner
                        visible={showSpinner}
                        textContent={'Iniciando Sesión'}
                        textStyle={stylesSpinner.spinnerTextStyle}
                    />
                    <View>
                        <TouchableOpacity onPress={() => goToSelectCompany()}>
                            <Image style={stylesForm.image} source={{uri: company != null ?company.LogoUrl:NoLogo}}/>
                        </TouchableOpacity>
                    </View>
                    <Formik
                            validationSchema={loginValidationSchema}
                            initialValues={{ UserName: '', Password: '' }}
                            onSubmit={(values) => login(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, isValid, errors }) => (

                                <View style={{ height: 250, marginTop: 25, justifyContent: 'space-around' }} >
                                    <Input
                                        onChangeText={handleChange('UserName')}
                                        onBlur={handleBlur('UserName')}
                                        value={values.UserName}
                                        type='text'
                                        size="2xl"
                                        variant="rounded"
                                        mx="3"
                                        space={4}
                                        placeholder="Usuario"
                                        w={{
                                            base: "80%",
                                            md: "25%",
                                        }}
                                        InputLeftElement={
                                            <Icon
                                                as={<MaterialIcons name="person" />}
                                                size={5}
                                                ml="2"
                                                color="muted.400"
                                            />
                                        }
                                    />
                                    {errors.UserName &&
                                        <Text style={{ marginLeft: 15, fontSize: 10, color: 'red' }}>{errors.UserName}</Text>
                                    }
                                    <Input
                                        onChangeText={handleChange('Password')}
                                        onBlur={handleBlur('Password')}
                                        value={values.Password}
                                        type={inputPassword}
                                        size="2xl"
                                        variant="rounded"
                                        mx="3"
                                        placeholder="Contraseña"
                                        w={{
                                            base: "80%",
                                            md: "25%",
                                        }}
                                        InputLeftElement={
                                            <Icon
                                                as={<MaterialIcons name="lock" />}
                                                size={5}
                                                ml="2"
                                                color="muted.400"
                                            />
                                        }
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => showPassword()}>
                                                <Icon as={<AntDesign name="eyeo"/>}
                                                    size={5}
                                                    mr={2}
                                                    color="muted.400"
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                    {errors.Password &&
                                        <Text style={{ marginLeft: 15, fontSize: 10, color: 'red' }}>{errors.Password}</Text>
                                    }

                                    <View style={{ alignItems: 'center' }} >
                                        <Button
                                            disabled={!isValid}
                                            onPress={handleSubmit}
                                            width={'90%'}
                                            height={50}
                                            leftIcon={<AntDesign name="arrowright" size={30} color="white" />}
                                            colorScheme="green"
                                        >
                                        </Button>
                                    </View>

                                </View>

                            )}
                        </Formik>
                </View>
            </View>
        </NativeBaseProvider>
    );
}
const stylesForm = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialContainer: {
        flex: 1,
        marginTop: 10,
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    image:{
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 80
    }
})
const stylesSpinner = StyleSheet.create({
    spinnerTextStyle: {
      color: '#FFF'
    },
  });
export default Login;