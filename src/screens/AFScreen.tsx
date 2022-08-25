import React, {type PropsWithChildren, useState, createContext, useContext} from 'react';
import styles from '../components/CustomStyle';
import Radio from '../components/RadioButton';
import { RadioButton } from 'react-native-paper';
import { TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
// import * as RNFS from 'react-native-fs';
import RNFS from 'react-native-fs';

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
        // const [detected, setDetected] = React.useState({ value: [1, 2]})
        const [, updateState] = React.useState({});
        const forceUpdate = React.useCallback(() => updateState({}), []);
        const [post, setPost] = React.useState({ postId: 0 })

        // read file
        const [content, setContent] = useState(null);

        const readFile = () => {
            RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then((result) => {
            console.log('GOT RESULT', result);
            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    return RNFS.readFile(statResult[1], 'utf8');
                }
                return 'no file';
            })
            .then((contents:any) => {
                setContent(contents);
                console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
        }
        // end read file
        
        useFocusEffect(forceUpdate);

        const checkPrediction = (value:any) =>
        {
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
        }

        const onClickDetect = async() =>
        {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // body: JSON.stringify({ value: await getSampleJson() })
                body: JSON.stringify({ value: await readFromSample() })
                // body: JSON.stringify({ value: [1, 2, 3] })
            };
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
                    <Button title="Change File" onPress={onPressHandler}></Button>
                    {/* <Button title="Change File" onPress={readFile}></Button> */}
                    <Text style={styles.sectionDescription}>File: {File.value}</Text>
                    {/* <Text style={styles.sectionDescription}>File: {content}</Text> */}
                </View>
                <View style={styles.customContainer}>
                    {/* <Button title="Detect" onPress={onClickDetect}></Button> */}
                    <Button title="Detect" onPress={onClickDetect}></Button>
                    <Text style={styles.sectionDescription}>Detected: {prediction}</Text>
                    <Text style={styles.sectionDescription}>Reject Status: {reject}</Text>
                    {/* <Text style={styles.sectionDescription}>PostID: {post.postId}</Text> */}
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

// export async function RunPrediction()
// {
    // const model = await tflite.loadTFLiteModel("https://1drv.ms/u/s!AhwQNlQ3dXFkiuN3XSV49evRF_li5w?e=Ho1lhy");
    // const model = await tflite.loadTFLiteModel("https://tfhub.dev/tensorflow/lite-model/mobilenet_v2_1.0_224/1/metadata/1");
    // const modeltf = await tfrn.bundleResourceIO
    // console.log(model);
    // console.log('end');

    // const outputTensor = tf.tidy(() => {
    //     // Get pixels data from an image.
    //     const img = tf.browser.fromPixels(document.querySelector('img'));
    //     // Normalize (might also do resize here if necessary).
    //     const input = tf.sub(tf.div(tf.expandDims(img), 127.5), 1);
    //     // Run the inference.
    //     let outputTensor = model.predict(input) as tf.Tensor;
    //     // De-normalize the result.
    //     return tf.mul(tf.add(outputTensor, 1), 127.5)
    // });
    // console.log(outputTensor);  
// }