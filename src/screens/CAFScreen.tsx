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
    Touchable,
    TouchableOpacity,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, StackActions } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const File = {value:'None'};
const FileList = ['sample.json', '0006-6.txt', '0007-1.txt', '0007-2.txt', '0007-3.txt',
                    '0008-1.txt', '0008-2.txt', '0008-3.txt', '0009-1.txt', '0009-2.txt', '0009-3.txt'];
var FileFormat = 'json';
var isStart = false;

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

async function readSimulation()
{
    console.log('READ!');
    var index = 0;
    let emptyList: number[] = [];
    let sampleList: number[] = [];

    sampleList = await readFromSample();
    setInterval(() => {
        emptyList.push(index);
        index++;
    }
    , 150);

    console.log(emptyList.length);
    console.log(sampleList.length);
}

export function CAFScreen({ navigation } : {navigation:any})
{
    const [prediction, setPrediction] = React.useState('None');
    const [reject, setReject] = React.useState('None');
    const [counter, setCounter] = React.useState(30);
    const [startCounter, setStartCounter] = React.useState(false);

    const [done, setDone] = React.useState(false);
    const [prog, setProg] = React.useState('Idle')

    var index = 0;

    React.useEffect(() =>
    {
        if(startCounter)
        {
            const timer = counter >= 0 && setInterval(() => setCounter(counter - 1), 500);

            if(!done)
            {
                // readSimulation();
                setDone(true);
            }
            else if(counter < 0)
            {
                setProg('Reading...');
                contDetect();
                setDone(false);
                setCounter(30);
                readSimulation();
            }

            return () => clearInterval(timer);
        }
    }
    ), [counter, startCounter]

    const contDetect = () =>
    {
        setProg('Predicting...');
        File.value = FileList[index];
        FileFormat = FileList[index].substr(FileList[index].indexOf('.')+1, 4);
        index++;
    }

    const onStartHandler = () =>
    {
        // navigation.navigate('Continuous AF ECG Sample List');
        setProg('Starting...');
        isStart = true;
        setStartCounter(true);
        setTimeout(() => {setProg('Waiting for countdown...')}, 1000);
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
        index = 0;
        setCounter(30);
        setTimeout(() => {setProg('Idle')}, 1000);
    }

    return (
    <ScrollView>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionDescription}>
                Takes in a continuous ECG measurement output file and 
                uses the tf.lite model (every 30 seconds) to make a prediction.
            </Text>
            <View style={styles.customContainer}>
                <Text style={styles.sectionDescription}>Next File: {File.value}</Text>
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
                    {/* <Button title="Start" onPress={onPressHandler}></Button> */}
                    {/* <Button title="Stop" onPress={onClickDetect}></Button> */}
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