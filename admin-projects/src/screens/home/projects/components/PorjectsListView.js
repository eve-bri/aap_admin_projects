import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons"
import Spinner from 'react-native-loading-spinner-overlay';
import { Animated, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { stylesSpinner } from "../../../../shared/Styles";
import { deleteProject } from '../../../../api/ProjectsApi';
import { useEffect } from 'react';

const rowSwipeAnimatedValues = {};

export const ProjectsListView = ({data}) => {
    
    const navigation = useNavigation()
    const [textSpinner, setTextSpinner] = useState('Eliminando proyecto...');
    const [showSpinner, setShowSpinner] = useState(false);

    data.forEach((project) => {
        project.key = project.Id
    })
    const [projects, setProjects] = useState(data);
    projects.forEach((project) => {
        rowSwipeAnimatedValues[project.Id] = new Animated.Value(0)
    });
    
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteProject = async (rowMap, rowKey) => {
        setTextSpinner('Eliminando proyecto...');
        setShowSpinner(true);
        console.log('Ok')
        const result = await deleteProject(rowKey);
        console.log('Sale')
        if(result){
            closeRow(rowMap, rowKey);
            const newData = [...projects];
            const prevIndex = projects.findIndex(item => item.Id === rowKey);
            newData.splice(prevIndex, 1);
            setProjects(newData);
        }else{
           setShowSpinner(true);
           console.log('Error')
        }
    };

    const onSwipeValueChange = (swipeData) => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderItem = (data) => {
        return(
            <TouchableHighlight
                style={styles.rowFront}
                underlayColor={'#AAA'}
                onPress={() => navigation.navigate('ProjectDetails', {data})}
            >
                <View style={styles.containerCard}>
                    <View>
                        <Text style={styles.titleCard}>{data.item.Name}</Text>
                        <Text style={styles.subTitleCard}>{data.item.Description}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    const renderHiddenItem = (data, rowMap) => {
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnLeft]}
                    onPress={() => closeRow(rowMap, data.item.Id)}
                >
                    <Animated.View
                        style={[
                            styles.trash,
                        ]}
                    >
                        <AntDesign name="calendar" size={40} color="black" />
                        
                    </Animated.View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                    onPress={() => deleteProject(rowMap, data.item.Id)}
                >
                    <Animated.View
                        style={[
                            styles.trash
                        ]}
                    >
                        <AntDesign name="delete" size={40} color="black" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={showSpinner}
                textContent={textSpinner}
                textStyle={stylesSpinner.spinnerTextStyle}
            />
            <SwipeListView
                data={projects}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={onSwipeValueChange}
            />
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    containerCard: {
        flexDirection: 'row',
    },
    titleCard: {
        fontSize: 25,
    },
    subTitleCard: {
        fontSize: 20,
    },
    userTitleCard: {
        fontSize: 18,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        //alignItems: 'center',
        backgroundColor: '#CCC',
        margin: 3,
        padding:5,
        //borderBottomColor: 'black',

        //borderBottomWidth: 1,
        //justifyContent: 'center',
        height: 80,
        borderRadius: 5,
    },
    rowBack: {
        height: 70,
        alignItems: 'center',
        backgroundColor: '#DDD',
        margin: 10,
        marginBottom: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 5,
        top: 0,
        width: 70,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        borderRadius: 5,
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        borderRadius: 5,
        right: 0,
    },
    trash: {
        height: 40,
        width: 40,
    },
});