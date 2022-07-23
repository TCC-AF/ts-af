import React, {type PropsWithChildren} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from '../components/CustomStyle';

import {
    Button,
    Pressable,
    Text,
    useColorScheme,
    View,
    ScrollView,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

export default function CAFStackNavigation()
{
    return (
        <Stack.Navigator>
            <Stack.Screen name="Continuous AF Detection" component={CAFScreen} />
            <Stack.Screen name="Continuous AF ECG Sample List" component={CAFSampleScreen} />
        </Stack.Navigator>
    )
}

export function CAFSampleScreen({ navigation } : {navigation:any})
{
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>AF Screen</Text>
        </View>
    )
}

export function CAFScreen({ navigation } : {navigation:any})
{
    const [value, setValue] = React.useState('None');
    const [checked, setChecked] = React.useState('None')
    const [detected, setDetected] = React.useState('None')
    const [status, setStatus] = React.useState({file: 'None', result: 'None'})

    const onClickDetect = () =>
    {
        setDetected(detected)
    }

    const onPressHandler = () =>
    {
        navigation.navigate('Continuous AF ECG Sample List');
    }

    return (
    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //     <Text>CAF Screen</Text>
    // </View>
    <ScrollView>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionDescription}>
                Takes in a continuous ECG measurement output file and 
                uses the tf.lite model (every 30 seconds) to make a prediction.
            </Text>
            <View style={styles.customContainer}>
                <Button title="Change File" onPress={onPressHandler}></Button>
                <Text style={styles.sectionDescription}>File: {value}</Text>
            </View>
            <View style={styles.customContainer}>
                <Button title="Detect" onPress={onClickDetect}></Button>
                <Text style={styles.sectionDescription}>Detected: {detected}</Text>
            </View>
        </View>
    </ScrollView>
    );
}