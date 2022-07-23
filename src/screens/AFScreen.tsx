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

export function AFSampleScreen()
{
    return (
        <View>
            <Text> Test </Text>
        </View>
    )
}

export default function AFScreen({ navigation } : {navigation:any})
{
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState([
        {label: 'ecg.json', value: 'ecg.json'},
        {label: '0006-6.txt', value: '0006-6.txt'},
        {label: '0007-1.txt', value: '0007-1.txt'},
        {label: '0007-2.txt', value: '0007-2.txt'},
        {label: '0007-3.txt', value: '0007-3.txt'},
        {label: '0008-1.txt', value: '0008-1.txt'},
        {label: '0008-2.txt', value: '0008-2.txt'},
        {label: '0008-3.txt', value: '0008-3.txt'},
        {label: '0009-1.txt', value: '0009-1.txt'},
        {label: '0009-2.txt', value: '0009-2.txt'},
        {label: '0009-3.txt', value: '0009-3.txt'},
    ]);

    const [checked, setChecked] = React.useState('None')
    const [detected, setDetected] = React.useState('None')
    const [status, setStatus] = React.useState({file: 'None', result: 'None'})

    const onClickDetect = () =>
    {
        setDetected(detected)
    }

    const onPressHandler = () =>
    {
        navigation.navigate('AF Sample List');
    }

    return (
        // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        //     <Text>AF Screen</Text>
        // </View>
    <ScrollView>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Atrial Fibrillation Detection Test</Text>
            <View style={styles.customContainer}>
                <Text style={styles.sectionDescription}>File: {value}</Text>
                <Text style={styles.sectionDescription}>Detected: {detected}</Text>
            </View>
            <View style={styles.customContainer}>
                <Button title="Detect" onPress={onClickDetect}></Button>
            </View>
            <View style={styles.customContainer}>
                <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                />
            </View>
        </View>
    </ScrollView>
    );
}