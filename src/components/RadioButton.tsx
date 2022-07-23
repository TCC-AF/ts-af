import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function Radio({ value, changeValue, text } : {value:any, changeValue:any, text:any}) {
    return <TouchableOpacity
        style={radioStyle.btn}
        onPress={changeValue}>

        {/* <Image source={leftImage} style={radioStyle.leftImg} /> */}
        <Text style={radioStyle.txt}>{text}</Text>
        {value ? <Image source={require("../assets/check.png")} style={radioStyle.tick} /> : null}
        {/* {value ? null : null} */}
    </TouchableOpacity>
}

const radioStyle = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#c36e02',
        backgroundColor: '#E78B5B',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    // leftImg: { height: 40, width: 40, marginRight: 30, tintColor: 'white', resizeMode: 'contain' },
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