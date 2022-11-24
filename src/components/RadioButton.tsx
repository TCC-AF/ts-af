import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function Radio({ value, changeValue, text } : {value:any, changeValue:any, text:any}) {
    return <TouchableOpacity
        style={radioStyle.btn}
        onPress={changeValue}>

        <Text style={radioStyle.txt}>{text}</Text>
        {value ? <Image source={require("../assets/check.png")} style={radioStyle.tick} /> : null}
    </TouchableOpacity>
}

const radioStyle = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E78B5B',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    txt: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white' },
    tick: {
        position: 'absolute',
        right: 0,
        height: 30,
        width: 30,
        marginRight:
        30,
        tintColor: 'white' }
});