import React from "react";
import { } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Text, View, NativeBaseProvider } from 'native-base'
import  {createStyleSaveArea} from '../../../shared/Styles'
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TitileScreen } from "../../../components/TitleScreen";

const ProjectsList = () => {
    const navegation = useNavigation()
    const insets = useSafeAreaInsets();
    const styles = createStyleSaveArea(insets)

    return(
        <NativeBaseProvider>
            <View style={styles.saveArea}>
                <TitileScreen  data={'Lista de proyectos'}/>
            </View>
        </NativeBaseProvider>
    );
}

export default ProjectsList;