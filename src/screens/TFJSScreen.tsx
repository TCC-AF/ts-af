import React from 'react';
import styles from '../components/CustomStyle';

import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
const File = { value: 'p_sample.json' };
const FileList = ['p_sample.json', 'p_0006-6.txt', 'p_0007-1.txt', 'p_0007-2.txt', 'p_0007-3.txt',
    'p_0008-1.txt', 'p_0008-2.txt', 'p_0008-3.txt', 'p_0009-1.txt', 'p_0009-2.txt', 'p_0009-3.txt'];

var model:tf.GraphModel;

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
const modelJson = require('../assets/af/graph-model/model.json');
const modelWeights = require('../assets/af/graph-model/weights.bin');

export default function TFJSStackNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TFJS Screen" component={TFJSScreen} />
            {/* <Stack.Screen name="Continuous AF ECG Sample List" component={CAFSampleScreen} /> */}
        </Stack.Navigator>
    )
}

async function readFromSample() {
    var fetchFile = File.value;
    var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/processed/' + fetchFile;

    if (fetchFile.split('.')[1] == 'json') {
        return fetch(fetchURL)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson[3];
            })
            .catch((error) => {
                console.error(error);
            });
    }
    else if (fetchFile.split('.')[1] == 'txt') {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'text/plain' },
        };
        return fetch(fetchURL, requestOptions)
            .then((response) => {
                return response.text().then(text => {
                    return (text.split('\n').map(Number));
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export function TFJSScreen({ navigation }: { navigation: any }) {
    var myTimer = 15;
    const [prediction, setPrediction] = React.useState('None');
    const [reject, setReject] = React.useState('None');
    const [counter, setCounter] = React.useState(myTimer);
    const [startCounter, setStartCounter] = React.useState(false);
    const [TFJSReady, setTFJSReady] = React.useState(false);

    const [prog, setProg] = React.useState('Idle')
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        if (startCounter) {
            const timer = counter >= 0 && setInterval(() => setCounter(counter - 1), 1000);

            if (counter < 0) {
                readSimulation();
                contDetect();
                setCounter(myTimer);
            }

            return () => clearInterval(timer);
        }
    }
    ), [counter, startCounter]

    // ---------------------------------- //
    // ------ AF Detection (Azure) ------ //
    // ---------------------------------- //

    const onDetect = async (simulatedValue: number[]) => {
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

    const checkPrediction = (value: any) => {
        setProg('Checking...');

        if (!value.prediction) {
            setPrediction(JSON.stringify(value));
            return;
        }

        switch (value.prediction) {
            case 1: setPrediction('Atrial Fibrillation'); break;
            case 2: setPrediction('Normal Sinus Rhythm'); break;
            case 3: setPrediction('Other Arrhytmia'); break;
            case 4: setPrediction('Too Noisy'); break;
        }

        if (value.reject == 0)
            setReject('Reliable');
        else if (value.reject == 1)
            setReject('Unreliable');

        setProg('Success!');
        setTimeout(() => { setProg('Measuring...') }, 1000);
    }

    // --------------------------------- //
    // ------ AF Detection (TFJS) ------ //
    // --------------------------------- //

    const secondLargest = (prediction_array: number[]) => {
        let sortedArray = tf.squeeze(prediction_array.sort().reverse()).arraySync() as number[];
        let secondLargestNumber = sortedArray[1];
        
        return secondLargestNumber;
    }

    const onTFJSReadyHandler = async () => {

        // If crash after predict, add the following line
        await tf.setBackend('cpu');

        // Wait for tf to be ready.
        await tf.ready();
        console.log('TFJS Ready');

        // load model
        setProg('Loading Model...');
        model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
        setProg('Loaded!')
        setTFJSReady(true)
    }

    const onTFJSPredict = (sample_expand:tf.Tensor) => {
        try {
            const res = model.predict(sample_expand) as tf.Tensor;
            return Promise.resolve(res)
        } catch(e) {
            return Promise.reject(e)
        }
    }

    const onTFJSDetect = async (simulatedValue: number[]) => {
        try {
            // read from sample
            setProg('Reading...');
            readFromSample()
                .then(sample => {
                    setProg('Expanding...');
                    console.log("EXPANDING")
                    let sample_expand = tf.expandDims(tf.expandDims(sample, 1), 0);
                    console.log(sample_expand)

                    setProg('Predicting...')
                    console.log("PREDICTING")
                    
                    // predict model
                    onTFJSPredict(sample_expand)
                        .then(data => {
                            // pass prediction results as 1d array
                            checkTFJSResult(data.as1D())
                        })
                })
        } catch (e) {
            console.log(e)
        } finally {
            console.log("Done")
        }
    }

    const checkTFJSResult = (output_data: any) => {
        // check prediction and reject
        let prediction = tf.argMax(output_data).arraySync() as number + 1;
        let predictionProb = output_data.arraySync() as number[];
        let thresh = [0.95, 0.91]
        
        // compare with threshold
        if (tf.max(predictionProb).arraySync() < thresh[0] &&
            (tf.max(predictionProb).arraySync() as number) - secondLargest(predictionProb) < thresh[1])
            var reject = 1
        else
            reject = 0
    
        // determine result to readable string
        switch (prediction) {
            case 1: setPrediction('Atrial Fibrillation'); break;
            case 2: setPrediction('Normal Sinus Rhythm'); break;
            case 3: setPrediction('Other Arrhytmia'); break;
            case 4: setPrediction('Too Noisy'); break;
        }

        // determine reject to readable stirng
        if (reject == 0)
            setReject('Reliable');
        else if (reject == 1)
            setReject('Unreliable');

        // update progress and status
        setProg('Success!');
        setTimeout(() => { setProg('Measuring...') }, 1000);
    }

    // ----------------------------------- //
    // ------ Continuous Simulation ------ //
    // ----------------------------------- //

    const readSimulation = async () => {
        var listIndex = 0;
        let emptyList: number[] = [];
        let sampleList: number[] = [];

        sampleList = await readFromSample();
        intervalSimulation(sampleList, emptyList, listIndex)
    }

    const intervalSimulation = (oldList: number[], newList: number[], listIndex: any) => {
        setProg('Measuring...');

        var interval = setInterval(() => {
            newList.push(oldList[listIndex]);
            listIndex++;

            if (counter < 0) {
                detectSimulation(oldList);
                clearInterval(interval);
            }
        }
            , 30);
    }

    const detectSimulation = async (newList: number[]) => {
        setProg('Reading...');
        await onTFJSDetect(newList);
    }

    const contDetect = () => {
        if (index > FileList.length - 1) {
            setIndex(0);
        }

        setIndex(0);
        setProg('Setting file...');
        File.value = FileList[index];
        // FileFormat = FileList[index].substr(FileList[index].indexOf('.') + 1, 4);
        FileFormat = FileList[index].split('.')[1];
        setIndex(index + 1);
    }

    // ------------------------------ //
    // ------ Controls/Buttons ------ //
    // ------------------------------ //

    const onStartHandler = () => {
        setProg('Starting...');
        contDetect();
        setStartCounter(true);
        readSimulation();
    }

    const onStopHandler = () => {
        setProg('Stopping...');
        setStartCounter(false);
        setTimeout(() => { setProg('Idle') }, 1000);
    }

    const onResetHandler = () => {
        setProg('Reseting...');
        setStartCounter(false);
        setIndex(0);
        File.value = 'None';
        setPrediction('None');
        setReject('None');
        setCounter(myTimer);
        setTimeout(() => { setProg('Idle') }, 1000);
    }

    return (
        <ScrollView>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionDescription}>
                    Takes in a continuous ECG measurement output file and
                    uses the tf.lite model (every 30 seconds) to make a prediction.
                </Text>
                <View style={styles.customContainer}>
                    <TouchableOpacity onPress={onTFJSReadyHandler} disabled={TFJSReady} style={[styles.customButton4, TFJSReady? { opacity: 0.5 } : { opacity: 1 }]}>
                        <Text style={styles.customButtonText}>{TFJSReady? 'TFJS Enabled' : 'Tap to Enable TFJS'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionDescription}>Current File: {File.value}</Text>
                    <Text style={styles.sectionDescription}>Next File: {FileList[index]}</Text>
                    <View style={styles.customGrid22}>
                        <TouchableOpacity onPress={onStartHandler} disabled={!TFJSReady} style={[styles.customButton1, !TFJSReady? { opacity: 0.5 } : { opacity: 1 }]}>
                            <Text style={styles.customButtonText}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onStopHandler} disabled={!TFJSReady} style={[styles.customButton2, !TFJSReady? { opacity: 0.5 } : { opacity: 1 }]}>
                            <Text style={styles.customButtonText}>Stop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onResetHandler} disabled={!TFJSReady} style={[styles.customButton3, !TFJSReady? { opacity: 0.5 } : { opacity: 1 }]}>
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







// ARCHIVE
// const fileName = `${RNFS.DocumentDirectoryPath}/AF/layers-model/model.json`;
// const fileName = `${RNFS.DocumentDirectoryPath}/model.json`;
// const fileName = `${RNFS.DocumentDirectoryPath}/Test`;
// const exists = await RNFS.exists(fileName);

// const direxists = await RNFS.exists(RNFS.DocumentDirectoryPath);
// const direxists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}`);

// const path = await require('../assets/af/layers-model/group1-shard1of34.bin');
// const binpath = require('./group1-shard1of34.bin');
// const path = require('../assets/af/layers-model/model.json');
// console.log(path);
// console.log(exists);
// console.log(direxists);
// console.log(RNFS.DocumentDirectoryPath);
// console.log(direxists);

//source: https://stackoverflow.com/questions/70995689/importing-bin-file-in-expo
// const modelJson = require('../assets/af/layers-model/model.json');
// const modelWeights = require('../assets/af/layers-model/group1-shard1of34.bin');
// let model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));

        // The minimum prediction confidence.
        // const threshold = 0.9;

        // Load the model. Users optionally pass in a threshold and an array of
        // labels to include.
        // toxicity.load(threshold).then(model => {
            // const sentences = ['you suck'];

            // model.classify(sentences).then(predictions => {
                // `predictions` is an array of objects, one for each prediction head,
                // that contains the raw probabilities for each input along with the
                // final prediction in `match` (either `true` or `false`).
                // If neither prediction exceeds the threshold, `match` is `null`.

                // console.log(predictions);
                /*
                prints:
                {
                "label": "identity_attack",
                "results": [{
                    "probabilities": [0.9659664034843445, 0.03403361141681671],
                    "match": false
                }]
                },
                {
                "label": "insult",
                "results": [{
                    "probabilities": [0.08124706149101257, 0.9187529683113098],
                    "match": true
                }]
                },
                ...
                */
            // });
        // });

        // return;

        // console.log(res.array())
            // console.log(res.toFloat())

            // load model
            // let model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
            // let model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));

            // read from sample
            // let sample = await readFromSample();
            // let sample_expand = tf.expandDims(tf.expandDims(sample, 1), 0);

            // console.log(sample_expand)

            // console.log(typeof(sample_expand))
            // console.log(model.outputs)

            // let tempNRR = tf.tensor(sample)
            // let transSample = tf.expandDims(tf.tensor(sample), 0);
            // console.log(transSample)
            // let res = model.predict(sample_expand) as tf.Tensor;
            // let res = await model.predict(sample_expand);
            // console.log("check predict pass")
            // console.log(res)
            // console.log("respond ok")
            // console.log("printing")
            // res.print();

            // console.log(model.inputs);
            // console.log(model.outputs);

            // console.log(model.outputNodes);
            // model

            // console.log(sample_expand);
            // console.log(sample);
            // let prediction = tf.argMax(model.predict(sample_expand));
            // let res = model.predict(sample);

            // let tempF = tf.squeeze(sample);
            // let tempN = 
            // let tempNRF = tf.expandDims(tempF, 1)

            // let input_details = tf.input(tempNRF);

            // const res = model.predict(tempNRF);
            // const res = model.predict(input_details) as tf.Tensor;
            // console.log(res)

            // console.log(input_details);

            // console.log(sample);
            // let sampleData = tf.tensor(sample);
            // model.in
            // console.log(sampleData);

            // let sampleExpand = tf.expandDims(tf.expandDims(sampleData, 1), 0);
            // console.log(sampleExpand)

            // let newData = sampleData.reshape([-1, 3000, 1]);
            // let newData = sampleData.reshape([1, 3000]);
            // let newData = sampleData.reshape([-1, 3000, 1]);
            // console.log(newData);

            // let newArray = []
            // for (var a in newData) {
            // newArray.push(a);
            // }

            // console.log(newData);

            // sampleData.reshape([-1, 3000, 1]).print();
            // sampleData.reshape([1, 3000]).print();
            // sampleData.reshape([3000, 1]).print();

            // console.log(newData)
            // let newData = sampleData.reshape([1, 7500]);
            // let newData = sampleData.reshape([2, 3750]);
            // let newData = sampleData.reshape([1, 3000])
            // let newData = sampleData.reshape([1, 3001]);
            // console.log(sampleData);
            // console.log(newdata);

            // make prediction based from sample array
            // const res = model.predict(sampleData) as tf.Tensor;
            // const res = model.predict(newData) as tf.Tensor;
            // console.log(res)

        // var fetchURL = 'https://raw.githubusercontent.com/ItsLame/samples/main/readings/' + File.value;
    // var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/' + File.value;
    // var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/sample06-6.txt';
    // var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/0006-6.txt';

    // const modelJson = require('../assets/af/layers-model/model.json');
// const modelWeights = require('../assets/af/layers-model/group1-shard1of34.bin');
// const modelWeights = require('../assets/af/graph-model/group1-shard1of33.bin');
// const modelJson = require('../assets/af/layers-model/model.json');
// const modelWeights = require('../assets/af/layers-model/weights.bin');

// const File = {value:'None'};
// const FileList = ['sample.json'];
// const FileList = ['sample.json', '0006-6.txt', '0007-1.txt', '0007-2.txt', '0007-3.txt',
    // '0008-1.txt', '0008-2.txt', '0008-3.txt', '0009-1.txt', '0009-2.txt', '0009-3.txt'];

      // var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/processed/p_sample.json';
    // var fetchURL = 'https://raw.githubusercontent.com/TCC-AF/Samples/main/readings/processed/p_0006-6.txt';

                // console.log(res)
            // console.log("respond ok")

            // print results
            // res.print();

            // console.log(prediction);
        // console.log(tf.max(predictionProb).arraySync());
        // secondLargest(predictionProb);