import React, { useEffect, useCallback, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { getIpAddress } from "../../shared/General";
import { setItem } from "../../shared/LocalStorage";
import  {createStyleSaveArea} from '../../shared/Styles'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {getUsertToken} from "../../api/UserTokenApi"
import {getCompanies, getCompany} from "../../api/CompanyApi"
import { TitleScreen } from "../../components/TitleScreen";
import { IUserToken } from "../../model/UserToken";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ICompany } from "../../model/Company";

const SelectCompany =  () => {
    const insets = useSafeAreaInsets();
    const styles = createStyleSaveArea(insets);
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [showSpinner, setShowSpinner] = useState(true);

    const verifySession = async()=> {
        const ipAdress = await getIpAddress();
        var token:IUserToken|null = await getUsertToken(ipAdress);
        if(token != null){
            console.log('sesion is null');
            await setItem('userToken', JSON.stringify(token));
            await setItem('company', JSON.stringify(await getCompany(token.CompanyId)));
            if(token.Active){
                setShowSpinner(false);
                navigation.navigate('ProjectsList');
            }else{
                setShowSpinner(false);
                navigation.push('Login');
            }
        }else{
            const companiesR = await getCompanies()
            setCompanies(companiesR);
            setShowSpinner(false);
        }
    }

    useEffect(() =>{
        verifySession();
    },[]);

    const goToLogin = async (company:ICompany) => {
        await setItem('company', JSON.stringify(company));
        navigation.push('Login')
    }
 
    return(
        <View style={styles.saveArea}>
            <Spinner
                visible={showSpinner}
                textContent={'Verificando información'}
                textStyle={stylesSpinner.spinnerTextStyle}
            />
            <TitleScreen data={'Seleccionar Compañía'}/>
            <ScrollView> 
                {
                    companies.map((company:ICompany) => {
                        return(
                            <TouchableOpacity key={company.Id} onPress={() => goToLogin(company)} style={stylesCard.button}>
                                <View style={stylesCard.view} > 
                                    <Text style={stylesCard.text}>{company.Name}</Text>
                                    <Image style={stylesCard.image}
                                        source={{uri:company.LogoUrl}}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </View>
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
const stylesSpinner = StyleSheet.create({
    spinnerTextStyle: {
      color: '#FFF'
    },
  });
export default SelectCompany;