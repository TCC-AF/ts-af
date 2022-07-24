import React, {type PropsWithChildren, useState, createContext, useContext} from 'react';
import styles from '../components/CustomStyle';
import Radio from '../components/RadioButton';
import { RadioButton } from 'react-native-paper';
import { TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';

import {
    Button,
    Pressable,
    Text,
    useColorScheme,
    View,
    ScrollView,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect} from '@react-navigation/native';
const Stack = createNativeStackNavigator();

export default function AFStackNavigation()
{
    var afscreen = new AFScreen();
    // var afscreen:AFScreen;
    return (
        <Stack.Navigator>
            <Stack.Screen name="AF Detection" component={afscreen.MainScreen} />
            {/* <Stack.Screen name="AF ECG Sample List" component={AFSampleScreen} /> */}
            <Stack.Screen name="AF ECG Sample List" component={afscreen.SampleScreen} />
        </Stack.Navigator>
    )
}

const File = {value:'None'}

export class AFScreen
{
    constructor(){}

    SampleScreen()
    {
        const [value, setValue] = React.useState(File.value);

        // const [, updateState] = React.useState({});
        // const forceUpdate = React.useCallback(() => updateState({}), []);

        const onValueChangeHandler = (newValue:any) =>
        {
            setValue(newValue);
            File.value = newValue;
        }

        return (
            <ScrollView>
                <View style={styles.sectionContainer}>
                    <Text>
                        View Home for more information. {"\n"}
                        Current File: {value} {"\n"}
                    </Text>
                    <Text style={styles.sectionTitle}>{">> Choose Sample File"}</Text>
                    <RadioButton.Group
                    onValueChange={(newValue) => onValueChangeHandler(newValue)}
                    value={value}>
                        <RadioButton.Item label="ecg.json" value="ecg.json"/>
                        <RadioButton.Item label="0006-6.txt" value="0006-6.txt"/>
                        <RadioButton.Item label="0007-1.txt" value="0007-1.txt"/>
                        <RadioButton.Item label="0007-2.txt" value="0007-2.txt"/>
                        <RadioButton.Item label="0007-3.txt" value="0007-3.txt"/>
                        <RadioButton.Item label="0008-1.txt" value="0008-1.txt"/>
                        <RadioButton.Item label="0008-2.txt" value="0008-2.txt"/>
                        <RadioButton.Item label="0008-3.txt" value="0008-3.txt"/>
                        <RadioButton.Item label="0009-1.txt" value="0009-1.txt"/>
                        <RadioButton.Item label="0009-2.txt" value="0009-2.txt"/>
                        <RadioButton.Item label="0009-3.txt" value="0009-3.txt"/>
                    </RadioButton.Group>
                    {/* <Text>{"File is now set to: "+File.value}</Text> */}
                    {/* <Button title="Confirm" onPress={onPressHandler}></Button> */}
                    {/* <Text>{"\n"}</Text> */}
                </View>
            </ScrollView>
        )
    }

    MainScreen ({ navigation } : {navigation:any})
    {
        const [detected, setDetected] = React.useState('None')
        const [, updateState] = React.useState({});
        const forceUpdate = React.useCallback(() => updateState({}), []);

        useFocusEffect(forceUpdate);

        const onClickDetect = () =>
        {
            setDetected(detected)
        }

        const onPressHandler = () =>
        {
            navigation.navigate('AF ECG Sample List');
        }

        return (
        <ScrollView>
            <View style={styles.sectionContainer}>
                {/* <Button title="Force Refresh" onPress={forceUpdate}></Button> */}
                <Text style={styles.sectionDescription}>
                    Takes in a 30 second ECG measurement output file and 
                    uses the tf.lite model to make a prediction.
                </Text>
                <View style={styles.customContainer}>
                    <Button title="Change File" onPress={onPressHandler}></Button>
                    <Text style={styles.sectionDescription}>File: {File.value}</Text>
                </View>
                <View style={styles.customContainer}>
                    <Button title="Detect" onPress={onClickDetect}></Button>
                    <Text style={styles.sectionDescription}>Detected: {detected}</Text>
                </View>
            </View>
        </ScrollView>
        );
    }
}

// export class AFComponent
// {
//     // protected value:any = 'None';
//     constructor(){}

//     // getSet()
//     // {
//     //     let value = () => this.value;
//     //     function getValue(){return value;}
//     //     function setValue(value_:any){value = value_;}
//     // }
// }

// export function AFSampleScreen()
// {
//     const [value, setValue] = React.useState('None');

//     return (
//         // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ScrollView>
//             <View style={styles.sectionContainer}>
//                 <Text>
//                     View Home for more information. {"\n"}
//                     Current File: {value} {"\n"}
//                 </Text>
//                 <Text style={styles.sectionTitle}>{">> Choose Sample File"}</Text>
//                 <RadioButton.Group
//                 onValueChange={(newValue) => setValue(newValue)}
//                 value={value}>
//                     <RadioButton.Item label="ecg.json" value="ecg.json"/>
//                     <RadioButton.Item label="0006-6.txt" value="0006-6.txt"/>
//                     <RadioButton.Item label="0007-1.txt" value="0007-1.txt"/>
//                     <RadioButton.Item label="0007-2.txt" value="0007-2.txt"/>
//                     <RadioButton.Item label="0007-3.txt" value="0007-3.txt"/>
//                     <RadioButton.Item label="0008-1.txt" value="0008-1.txt"/>
//                     <RadioButton.Item label="0008-2.txt" value="0008-2.txt"/>
//                     <RadioButton.Item label="0008-3.txt" value="0008-3.txt"/>
//                     <RadioButton.Item label="0009-1.txt" value="0009-1.txt"/>
//                     <RadioButton.Item label="0009-2.txt" value="0009-2.txt"/>
//                     <RadioButton.Item label="0009-3.txt" value="0009-3.txt"/>
//                 </RadioButton.Group>
//             </View>
//         </ScrollView>
//     )
// }