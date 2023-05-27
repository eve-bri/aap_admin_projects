import { StyleSheet,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
//Navigation
import { Navigator } from './src/navigation/Navigator';

//API

export default function App() {
  return (
      <Navigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
