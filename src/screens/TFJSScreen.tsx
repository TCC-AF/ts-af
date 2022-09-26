import React, {type PropsWithChildren} from 'react';
import styles from '../components/CustomStyle';

import {
    Button,
    Pressable,
    Text,
    useColorScheme,
    View,
    ScrollView,
    Touchable,
    TouchableOpacity,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { white } from 'react-native-paper/lib/typescript/styles/colors';

const Stack = createNativeStackNavigator();
const currFile = {value: 'None'};
const File = {value:'None'};
// const FileList = ['sample.json'];
const FileList = ['sample.json', '0006-6.txt', '0007-1.txt', '0007-2.txt', '0007-3.txt',
                    '0008-1.txt', '0008-2.txt', '0008-3.txt', '0009-1.txt', '0009-2.txt', '0009-3.txt'];
var FileFormat = 'json';
var isStart = false;

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export default function CAFStackNavigation()
{
    return (
        <Stack.Navigator>
            <Stack.Screen name="TFJS Test" component={TFJSScreen} />
            {/* <Stack.Screen name="Continuous AF ECG Sample List" component={CAFSampleScreen} /> */}
        </Stack.Navigator>
    )
}

// export function CAFSampleScreen({ navigation } : {navigation:any})
// {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>AF Screen</Text>
//         </View>
//     )
// }

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
}

export function TFJSScreen({ navigation } : {navigation:any})
{
    var myTimer = 30;
    const [prediction, setPrediction] = React.useState('None');
    const [reject, setReject] = React.useState('None');
    const [counter, setCounter] = React.useState(myTimer);
    const [startCounter, setStartCounter] = React.useState(false);

    const [done, setDone] = React.useState(false);
    const [prog, setProg] = React.useState('Idle')
    const [index, setIndex] = React.useState(0);

    React.useEffect(() =>
    {
        if(startCounter)
        {
            const timer = counter >= 0 && setInterval(() => setCounter(counter - 1), 1000);

            if(counter < 0)
            {
                readSimulation();
                contDetect();
                setCounter(myTimer);
            }

            return () => clearInterval(timer);
        }
    }
    ), [counter, startCounter]

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

        setDone(true);
        setProg('Success!');
        setTimeout(() => {setProg('Measuring...')}, 1000);
    }

    const onDetect = async(simulatedValue:number[]) =>
    {   
        setPrediction('None');
        setReject('None');

        setProg('Inputting data...');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: simulatedValue })
        };
        setProg('Predicting...');
        fetch("https://detect-af.azurewebsites.net/api/ecg-predict?code=serBnqELEn8-B03IlFAzEe8Q1Wy0RA_TAHoZTkB5caLNAzFuX6udzw==", requestOptions)
            .then(response => response.json())
            .then(data => checkPrediction(data));
    }

    const readSimulation = async() =>
    {
        var listIndex = 0;
        let emptyList: number[] = [];
        let sampleList: number[] = [];

        sampleList = await readFromSample();
        intervalSimulation(sampleList, emptyList, listIndex)
    }

    const intervalSimulation = (oldList:number[], newList:number[], listIndex:any) =>
    {
        setProg('Measuring...');

        var interval = setInterval(() => {
            newList.push(oldList[listIndex]);
            listIndex++;

            if(counter < 0)
            {
                detectSimulation(oldList);
                clearInterval(interval);
            }
        }
        , 30);
    }

    const detectSimulation = async(newList:number[]) =>
    {
        setProg('Reading...');
        await onDetect(newList);
    }

    const contDetect = () =>
    {
        if(index > FileList.length-1)
        {
            setIndex(0);
        }

        setIndex(0);
        setProg('Setting file...');
        File.value = FileList[index];
        FileFormat = FileList[index].substr(FileList[index].indexOf('.')+1, 4);
        setIndex(index+1);
    }

    const onStartHandler = () =>
    {
        setProg('Starting...');
        isStart = true;
        contDetect();
        setStartCounter(true);
        readSimulation();
    }

    const onStopHandler = () =>
    {
        setProg('Stopping...');
        setStartCounter(false);
        isStart = false;
        setTimeout(() => {setProg('Idle')}, 1000);
    }

    const onResetHandler = () =>
    {
        setProg('Reseting...');
        setStartCounter(false);
        isStart = false;
        setIndex(0);
        File.value = 'None';
        FileFormat = FileList[index].substr(FileList[index].indexOf('.')+1, 4);
        setPrediction('None');
        setReject('None');
        setCounter(myTimer);
        setTimeout(() => {setProg('Idle')}, 1000);
    }

    const onTFJSReadyHandler = async() =>
    {
        // Wait for tf to be ready.
        await tf.ready();
        console.log('TFJS Ready');
    }

    return (
    <ScrollView>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionDescription}>
                Takes in a continuous ECG measurement output file and 
                uses the tf.lite model (every 30 seconds) to make a prediction.
            </Text>
            <View style={styles.customContainer}>
                <TouchableOpacity onPress={onTFJSReadyHandler} style={styles.customButton1}>
                    <Text style={styles.customButtonText}>Check TFJS Ready</Text>
                </TouchableOpacity>
                <Text style={styles.sectionDescription}>Current File: {File.value}</Text>
                <Text style={styles.sectionDescription}>Next File: {FileList[index]}</Text>
                <View style={styles.customGrid22}>
                    <TouchableOpacity onPress={onStartHandler} style={styles.customButton1}>
                        <Text style={styles.customButtonText}>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onStopHandler} style={styles.customButton2}>
                        <Text style={styles.customButtonText}>Stop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onResetHandler} style={styles.customButton3}>
                        <Text style={styles.customButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionDescription}>Next Prediction: {counter} seconds</Text>
                <Text style={styles.sectionDescription}>Status: {prog}</Text>
                <Text style={styles.sectionDescription}>Detected: {prediction}</Text>
                <Text style={styles.sectionDescription}>Reject Status: {reject}</Text>
            </View>
        </View>
    </ScrollView>
    );
}