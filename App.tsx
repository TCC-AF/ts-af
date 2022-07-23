// import * as React from 'react';
import React, {type PropsWithChildren} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './src/screens/HomeScreen';
import AFScreen from './src/screens/AFScreen';
import { AFSampleScreen } from './src/screens/AFScreen';
import CAFScreen from './src/screens/CAFScreen';
import { CAFSampleScreen } from './src/screens/CAFScreen';

import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App()
{
  const myIcon = <FontAwesome5 name="rocket" size={30} color="#900" />;

  return (
    <NavigationContainer>
      {/* <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AF Detection" component={AFScreen} />
        <Stack.Screen name="Continuous AF Detection" component={CAFScreen} />
      </Stack.Navigator> */}
      {/* <Stack.Navigator>
        <Stack.Screen name="AF Sample List" component={AFSampleScreen} />
        <Stack.Screen name="Continuous AF Sample List" component={CAFSampleScreen} />
      </Stack.Navigator> */}
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName='';
          if (route.name==="Home")
          {
              iconName = 'house-chimney';
              size = focused ? 25 : 20;
          }
          else if (route.name==="AF Detection")
          {
            iconName = 'wave-pulse';
            size = focused ? 25 : 20;
          }
          else if (route.name==="Continuous AF Detection")
          {
            iconName = 'heart-pulse';
            size = focused ? 25 : 20;
          }
          return (
            <FontAwesome5
              name={iconName}
              size={size}
            />
          )
        }
      })}
      // screenOptions=
      // {{
      //   tabBarActiveTintColor: '#f0f',
      //   tabBarInactiveTintColor: '#555',
      // }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AF Detection" component={AFScreen} />
        <Tab.Screen name="Continuous AF Detection" component={CAFScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// const App = () =>
// {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState(null);
//   const [items, setItems] = React.useState([
//     {label: 'ecg.json', value: 'ecg.json'},
//     {label: '0006-6.txt', value: '0006-6.txt'},
//     {label: '0007-1.txt', value: '0007-1.txt'},
//     {label: '0007-2.txt', value: '0007-2.txt'},
//     {label: '0007-3.txt', value: '0007-3.txt'},
//     {label: '0008-1.txt', value: '0008-1.txt'},
//     {label: '0008-2.txt', value: '0008-2.txt'},
//     {label: '0008-3.txt', value: '0008-3.txt'},
//     {label: '0009-1.txt', value: '0009-1.txt'},
//     {label: '0009-2.txt', value: '0009-2.txt'},
//     {label: '0009-3.txt', value: '0009-3.txt'},
//   ]);

//   const [checked, setChecked] = React.useState('None')
//   const [detected, setDetected] = React.useState('None')
//   const [status, setStatus] = React.useState({file: 'None', result: 'None'})

//   const onClickDetect = () =>
//   {
//     setDetected(detected)
//   }
  
//   return (
//     <View style={styles.sectionContainer}>
//       <Text style={styles.sectionTitle}>Atrial Fibrillation Detection Test</Text>
//       <View style={styles.customContainer}>
//         <Text style={styles.sectionDescription}>File: {value}</Text>
//         <Text style={styles.sectionDescription}>Detected: {detected}</Text>
//       </View>
//       <View style={styles.customContainer}>
//         <Button title="Detect" onPress={onClickDetect}></Button>
//       </View>
//       <View style={styles.customContainer}>
//         <DropDownPicker
//           open={open}
//           value={value}
//           items={items}
//           setOpen={setOpen}
//           setValue={setValue}
//           setItems={setItems}
//         />
//       </View>
//     </View>
//   );
// };

export default App;
