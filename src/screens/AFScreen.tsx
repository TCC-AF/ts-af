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
const File = {value:'None'};
var FileFormat = 'json';

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

async function getSampleJson()
{
    return fetch('https://raw.githubusercontent.com/ItsLame/ts-af/main/src/assets/samples/ecg.json?token=GHSAT0AAAAAABWIDSQXEXA7V4N2URV5OMDSYYEXRTQ')
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson[3];
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getSampleText()
{
    const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'text/plain' },
        };
    return fetch('https://raw.githubusercontent.com/ItsLame/samples/main/readings/0006-6.txt', requestOptions)
        .then((response) => {
            return response.text().then(text => {
                // console.log(text.split('\n').map(Number));
                return (text.split('\n').map(Number));
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

async function readFromSample()
{
    var fetchURL = 'https://raw.githubusercontent.com/ItsLame/samples/main/readings/' + File.value;

    if(FileFormat == 'json')
    {
        return fetch(fetchURL)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson[3];
        })
        .catch((error) => {
            console.error(error);
        });
    }
    else if(FileFormat == 'txt')
    {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'text/plain' },
        };
        return fetch(fetchURL, requestOptions)
        .then((response) => {
            return response.text().then(text => {
                // console.log(text.split('\n').map(Number));
                return (text.split('\n').map(Number));
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }
    else
    {
        File.value = 'Please Choose a File!';
    }
}

export class AFScreen
{
    constructor(){}

    SampleScreen()
    {
        const [value, setValue] = React.useState(File.value);
        // const [fileFormat, setFileFormat] = React.useState(FileFormat);

        // const [, updateState] = React.useState({});
        // const forceUpdate = React.useCallback(() => updateState({}), []);

        const onValueChangeHandler = (newValue:any) =>
        {
            setValue(newValue);
            File.value = newValue;
            // setFileFormat(newValue.substr(newValue.indexOf('.')+1, 4));
            FileFormat = newValue.substr(newValue.indexOf('.')+1, 4);
            // console.log(newValue.substr(newValue.indexOf('.')+1, 4));
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
                        <RadioButton.Item label="sample.json" value="sample.json"/>
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
        const [prediction, setPrediction] = React.useState('None');
        const [reject, setReject] = React.useState('None');
        const [prog, setProg] = React.useState('Idle')
        
        const [, updateState] = React.useState({});
        const forceUpdate = React.useCallback(() => updateState({}), []);
        
        useFocusEffect(forceUpdate);

        const checkPrediction = (value:any) =>
        {
            setProg('Checking...');

            if(!value.prediction)
            {
                setPrediction(JSON.stringify(value));
                return;
            }

            switch(value.prediction)
            {
                case 1: setPrediction('Atrial Fibrillation'); break;
                case 2: setPrediction('Normal Sinus Rhythm'); break;
                case 3: setPrediction('Other Arrhytmia'); break;
                case 4: setPrediction('Too Noisy'); break;
            }

            if(value.reject == 0)
                setReject('Reliable');
            else if (value.reject == 1)
                setReject('Unreliable');

            setProg('Success!');
            setTimeout(() => {setProg('Idle')}, 1000);
        }

        const onClickDetect = async() =>
        {
            if(File.value == 'None')
            {
                setProg('Please choose a file!');
                setTimeout(() => {setProg('Idle')}, 1000);
                return;
            }

            setPrediction('None');
            setReject('None');

            setProg('Reading sample...');
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ value: await getSampleJson() })
                body: JSON.stringify({ value: await readFromSample() })
                // body: JSON.stringify({ value: [1, 2, 3] })
            };
            setProg('Predicting...');
            fetch("https://detect-af.azurewebsites.net/api/ecg-predict?code=serBnqELEn8-B03IlFAzEe8Q1Wy0RA_TAHoZTkB5caLNAzFuX6udzw==", requestOptions)
                .then(response => response.json())
                .then(data => checkPrediction(data));
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
                    <TouchableOpacity onPress={onPressHandler} style={styles.customButton2}>
                        <Text style={styles.customButtonText}>Change File</Text>
                    </TouchableOpacity>
                    {/* <Button title="Change File" onPress={onPressHandler}></Button> */}
                    {/* <Button title="Change File" onPress={readFile}></Button> */}
                    <Text style={styles.sectionDescription}>File: {File.value}</Text>
                    {/* <Text style={styles.sectionDescription}>File: {content}</Text> */}
                </View>
                <View style={styles.customContainer}>
                    {/* <Button title="Detect" onPress={onClickDetect}></Button> */}
                    <TouchableOpacity onPress={onClickDetect} style={styles.customButton1}>
                        <Text style={styles.customButtonText}>Detect</Text>
                    </TouchableOpacity>
                    {/* <Button title="Detect" onPress={onClickDetect}></Button> */}
                    <Text style={styles.sectionDescription}>Status: {prog}</Text>
                    <Text style={styles.sectionDescription}>Detected: {prediction}</Text>
                    <Text style={styles.sectionDescription}>Reject Status: {reject}</Text>
                    {/* <Text style={styles.sectionDescription}>PostID: {post.postId}</Text> */}
                </View>
            </View>
        </ScrollView>
        );
    }
}