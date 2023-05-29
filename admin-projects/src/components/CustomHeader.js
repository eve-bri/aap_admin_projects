import React, { useEffect, useState } from 'react';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { getItem, setItem } from '../shared/LocalStorage';
import { getHeaderTitle } from '@react-navigation/elements';
import { updateActiveToken } from '../api/UserTokenApi';

export default function CustomHeader({ navigation, route, options }) {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [showHeader, setShowHeader] = useState(false)
    const [title, setTitle] = useState();
    const routeName = getHeaderTitle(options, route.name);
    const [showBackAction, setShowBackAction] = useState(false);
    useEffect(() =>{
        switch(routeName) {
            case 'ProjectsList':
                setTitle('Proyectos');
                setShowHeader(true);
                setShowBackAction(false);
            break;
            case 'Profile':
                setTitle('Perfil');
                setShowHeader(true);
                setShowBackAction(false);
                break; 
            case 'Help':
                setTitle('Ayuda');
                setShowHeader(true);
                setShowBackAction(false);
                break;
            case 'BugReport':
                setTitle('Reportar anomalía');
                setShowHeader(true);
                setShowBackAction(false);
                break;
            case 'ProjectDetails':
                setTitle('Detalles Proyecto');
                setShowHeader(true);
                setShowBackAction(true);
                break;
            case 'TaskDetails':
                setTitle('Detalles Tarea');
                setShowHeader(true);
                setShowBackAction(true);
                break;
            default:
                setTitle('');
                setShowHeader(false);
                setShowBackAction(false);
                break;        
        }
    },[]);

    const logOut = async () => {
        const userToken = JSON.parse(await getItem('userToken'));
        userToken.Active = false;
        const logOut = await updateActiveToken(userToken);
        if(logOut){
            closeMenu()
            await setItem('userToken', JSON.stringify(userToken));
            navigation.push('Login');
        }else{
            Alert.alert('Error', 'Intente nuevamente', [
                    {text: 'OK', onPress: () => {}},
                  ]
            );
        }
    }

    const navigateAction = (url) => {
        closeMenu();
        navigation.push(url)
    }
    return (
        <>
            {showHeader ? (
                <Appbar.Header>
                {
                    showBackAction &&
                        <Appbar.BackAction onPress={() => navigation.goBack()} />
                }
                <Appbar.Content title={title} />
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                                <Appbar.Action
                                icon="dots-vertical"
                                onPress={openMenu}
                                />
                        }>
                        <Menu.Item 
                            onPress={() => navigateAction('ProjectsList')}
                            title="Proyectos"
                        />
                        <Menu.Item 
                            onPress={() => navigateAction('Profile')}
                            title="Perfil"
                        />
                        <Divider/>
                        <Menu.Item 
                            onPress={() => navigateAction('Help')}
                            title="Ayuda"
                        />
                        <Menu.Item 
                            onPress={() => navigateAction('BugReport')}
                            title="Reportar error"
                        />
                        <Menu.Item
                            onPress={() => logOut()}
                            title="Cerrar Sesión"
                        />
                    </Menu>
                </Appbar.Header>
            ) : null}
        </>
    );
}