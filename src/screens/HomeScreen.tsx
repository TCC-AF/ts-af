import React, {type PropsWithChildren} from 'react';
import { DataTable } from 'react-native-paper';
import styles from '../components/CustomStyle';

import {
    Button,
    Pressable,
    Text,
    useColorScheme,
    View,
    ScrollView
} from 'react-native';

export default function HomeScreen({ navigation } : {navigation:any})
{
    const onPressHandler = () =>
    {
        navigation.navigate('AF Detection');
    }

    return (
    // <ScrollView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ScrollView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.sectionTitle}>Stats Info</Text>
            <Text style={styles.sectionDescription}>
                Prediction List {"\n"}
                1 - Atrial Fibrillation {"\n"}
                2 - Normal Sinus Rhythm {"\n"}
                3 - Other Arrhytmia {"\n"}
                4 - Too Noisy {"\n\n"}
                Reject {"\n"}
                0 - Reliable {"\n"}
                1 - Unreliable {"\n"}
            </Text>
            <Text style={styles.sectionTitle}>Expected</Text>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Filename</DataTable.Title>
                    <DataTable.Title>Expected</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <DataTable.Cell>ecg.json</DataTable.Cell>
                    <DataTable.Cell>1</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0006-6.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0007-1.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0007-2.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0007-3.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0008-1.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0008-2.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0008-3.txt</DataTable.Cell>
                    <DataTable.Cell>2</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0009-1.txt</DataTable.Cell>
                    <DataTable.Cell>1</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0009-2.txt</DataTable.Cell>
                    <DataTable.Cell>1</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>0009-3.txt</DataTable.Cell>
                    <DataTable.Cell>1</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
            {/* <Pressable onPress={onPressHandler}
            style={({ pressed }) => ({backgroundColor: pressed ? '#ddd' : '#0f0'})}>
            <Text>Go to AF</Text>
            </Pressable> */}
        </View>
    </ScrollView>
    );
}