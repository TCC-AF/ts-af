import {
    StyleSheet,
} from 'react-native';
import { blue100 } from 'react-native-paper/lib/typescript/styles/colors';

// const styles = StyleSheet.create
export default StyleSheet.create
({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    customContainer: {
        marginTop: 32,
        // paddingHorizontal: 24,
        // backgroundColor: '#008',
    },
    customGrid22:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        // alignContent: 'center',
        // flex: 1,
        // minWidth: 100,
        // height: 50,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        paddingLeft: 20,
        color: 'white',
        backgroundColor: '#8A2424',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        // textAlign: 'center'
    },
    customButton1: {
        backgroundColor: '#24398A',
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 10,
        elevation: 10,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    customButton2: {
        backgroundColor: '#8A2424',
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 10,
        elevation: 10,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    customButton3: {
        backgroundColor: '#909090',
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 10,
        elevation: 10,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    customButtonText: {
        color: 'white',
        fontSize: 18,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    highlight: {
        fontWeight: '700',
    },
    Title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 24,
        color: '#24398A',
    },
});