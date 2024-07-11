import React, {useEffect,useState} from "react";
import { useNavigation } from '@react-navigation/native';
import { Input, Icon, Text, View, Button, NativeBaseProvider } from 'native-base'
import { StyleSheet, Image, Platform, TouchableOpacity, Alert, TextInput, Pressable } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay'
import { Formik } from 'formik';
import * as yup from 'yup';
import  {createStyleSaveArea} from '../../shared/Styles'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getItem,setItem } from "../../shared/LocalStorage";
import { deleteUserToken, saveUserToken, updateActiveToken } from "../../api/UserTokenApi"
import { verifyUserNameAvailability, registerUser } from "../../api/UserApi";
import { getExtensionFile } from "../../shared/General";
import { ICompany } from "../../model/Company";
import { IUser } from "../../model/User";
import { IUserToken } from "../../model/UserToken";

const Register = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styles = createStyleSaveArea(insets);
    const [inputPassword, setInputPassword]  = useState('password');
    const [showSpinner, setShowSpinner] = useState(false);
    const [image, setImage] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (libraryStatus.status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
    
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== 'granted') {
              alert('Sorry, we need camera permissions to make this work!');
            }
          }
        })();
      }, []);

    const loginValidationSchema = yup.object().shape({
        Name: yup
            .string()
            .required('Se requiere nombre'),
        UserName: yup
            .string()
            .required('Se requiere usuario'),
        Password: yup
            .string()
            .required('Se requiere contraseña'),
    })

    const registerUserHandler = async(values:any) => {
        setShowSpinner(true);
        const isValidUserName = await verifyUserNameAvailability(values.UserName);
        if(!isValidUserName){
            setShowSpinner(false);
            return Alert.alert('Error', 'Usuario ocupado', [
                {text: 'OK', onPress: () => {}},
              ]
            );
        }
        console.log(getExtensionFile(image));
        var userData = {
            'companyId' : '1',
            'login': values.UserName,
            'password': values.Password,
            'name': values.Name,
            'file':{
                'base64': 'data:image/'+getExtensionFile(image)+';base64,'+imageBase64,
                'name':new Date().toISOString()+'.png',
                'extension': getExtensionFile(image)
            }
        }
        var result = await registerUser(userData);
        console.log(result)
        setShowSpinner(false);
        //const user:IUser|null = await verifyLoginUser(values.UserName, values.Password);
        /*if(user !== null){
            await setItem('user',JSON.stringify(user));
            const result = await getItem('userToken');
            var userToken:IUserToken = JSON.parse(result!);
            if(userToken !== null){
                userToken.UserId = user.Id!;
                userToken.CompanyId = '';
                userToken.Active = true;
                const login = await updateActiveToken(userToken)
                if(login){
                    await setItem('userToken',JSON.stringify(userToken));
                    setShowSpinner(false);
                    return navigation.push('ProjectsList');
                }else{
                    setShowSpinner(false);
                    return Alert.alert('Error', 'Intente nuevamente', [
                        {text: 'OK', onPress: () => {}},
                      ]
                    );
                }
            }
            const ipAddress = await getIpAddress();
            const data:IUserToken = {
                Id: '',
                Active: true,
                CompanyId: '',
                IpAddress: ipAddress,
                UserId: user.Id!
            }
            userToken = await saveUserToken(data);
            if(userToken !== null){
                await setItem('userToken', JSON.stringify(userToken));
                setShowSpinner(false);
                return navigation.push('ProjectsList');
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
        */
    }

    const showPassword = () =>{
        if(inputPassword === 'password'){
            setInputPassword('text');
        }else{
            setInputPassword('password');
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: false,
          quality: 1,
          base64:true
        });
    
        if (!result.canceled) {
            //setImage(result.assets[0].uri);
            setImage('data:image/'+getExtensionFile(result.assets[0].uri)+';base64,'+result.assets[0].base64!);
            setImageBase64(result.assets[0].base64!);
        }
      };

    const goToLogin = async () => {
        navigation.push('Login')
    }

    return(
        <NativeBaseProvider>
            <View style={styles.saveArea}>
            <View style={stylesForm.container}>
                    <Spinner
                        visible={showSpinner}
                        textContent={'Registrando...'}
                        textStyle={stylesSpinner.spinnerTextStyle}
                    />
                    <View>
                        <Text fontSize={20} fontWeight={600}>Formulario de Registro</Text>
                    </View>
                    <Formik
                            validationSchema={loginValidationSchema}
                            initialValues={{ Name: '', UserName: '', Password: '' }}
                            onSubmit={(values) => registerUserHandler(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, isValid, errors }) => (

                                <View style={{marginTop: 25, justifyContent: 'space-around' }} >
                                    <Text style={stylesForm.LabelInput}>Nombre:</Text>
                                    <Input style={stylesForm.Input}
                                        onChangeText={handleChange('Name')}
                                        onBlur={handleBlur('Name')}
                                        value={values.Name}
                                        size={'xl'}
                                        type='text'
                                        placeholder="Nombre"
                                        w={{
                                            base: "80%",
                                        }}
                                    />
                                    {errors.Name &&
                                      <Text style={{ marginLeft: 15, fontSize: 10, color: 'red' }}>{errors.Name}</Text>
                                    }
                                    <Text style={stylesForm.LabelInput}>Usuario:</Text>
                                    <Input style={stylesForm.Input}
                                        onChangeText={handleChange('UserName')}
                                        onBlur={handleBlur('UserName')}
                                        value={values.UserName}
                                        size={'xl'}
                                        type='text'
                                        placeholder="Usuario"
                                        w={{
                                            base: "80%",
                                        }}
                                    />
                                    {errors.UserName &&
                                        <Text style={{ marginLeft: 15, fontSize: 10, color: 'red' }}>{errors.UserName}</Text>
                                    }
                                    <Text style={stylesForm.LabelInput}>Contraseña:</Text>
                                    <Input style={stylesForm.Input}
                                        onChangeText={handleChange('Password')}
                                        onBlur={handleBlur('Password')}
                                        value={values.Password}
                                        size={'xl'}
                                        type='text'
                                        placeholder="Contraseña"
                                        w={{
                                            base: "80%",
                                        }}
                                    />
                                    {errors.Password &&
                                        <Text style={{ marginLeft: 15, fontSize: 10, color: 'red' }}>{errors.Password}</Text>
                                    }
                                    <Text style={stylesForm.LabelInput}>Foto Perfil:</Text>
                                    <TouchableOpacity onPress={pickImage}>
                                        {image != '' 
                                            ? <Image source={{ uri: image }} style={stylesForm.Image} />
                                        :
                                        <Image source={require('../../../assets/no-image-icon.png')} style={stylesForm.Image} />
                                        }
                                    </TouchableOpacity>

                                    <View style={{ alignItems: 'center' }} >
                                        <Button style={{marginTop:15}}
                                            disabled={!isValid}
                                            onPress={()=>handleSubmit()}
                                            width={'90%'}
                                            height={50}
                                            colorScheme="green"
                                        >
                                            <Text color={'white'} fontSize={20}>Registrarme</Text>
                                        </Button>
                                    </View>
                                </View>

                            )}
                    </Formik>
                    <View style={{marginTop:15}}>
                        <TouchableOpacity onPress={() => goToLogin()}>
                            <Text style = {{color:'blue'}}>Iniciar Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </NativeBaseProvider>
    );
}

const stylesForm = StyleSheet.create({
    LabelInput: {
        fontSize: 18,
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5, 
        fontWeight: '300',
    },
    Input: {
        marginTop: 5,
        marginLeft: 5,
      },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    Image: {
        width: 200,
        height: 200,
        marginTop: 20,
        alignSelf: 'center'
      },
      ButtonPhotoProfile:{
        justifyContent: 'flex-start',
        backgroundColor: 'white',
      },
})
const stylesSpinner = StyleSheet.create({
    spinnerTextStyle: {
      color: '#FFF'
    },
  });

export default Register;