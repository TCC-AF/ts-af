// import * as React from 'react';
import React, {type PropsWithChildren} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './src/screens/HomeScreen';
import AFScreen from './src/screens/AFScreen';
import CAFScreen from './src/screens/CAFScreen';
import TFJSScreen from './src/screens/TFJSScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function App()
{
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        header: () => null,
        tabBarIcon: ({ focused, size }) => {
          let iconName='home';
          if (route.name==="Home")
          {
              // iconName = 'home';
              size = focused ? 25 : 20;
          }
          else if (route.name==="AF")
          {
            iconName = 'heart';
            size = focused ? 25 : 20;
          }
          else if (route.name==="CAF")
          {
            iconName = 'heartbeat';
            size = focused ? 25 : 20;
          }
          else if (route.name==="TFJS")
          {
            iconName = 'hat-wizard';
            size = focused ? 25 : 20;
          }
          return (
            <FontAwesome5
              name={iconName}
              size={size}
            />
            // <FontAwesomeIcon icon="iconName" />
            // <FontAwesomeIcon icon="heart-pulse" />
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
        <Tab.Screen name="AF" component={AFScreen} options={{headerShown: false}}/>
        <Tab.Screen name="CAF" component={CAFScreen} options={{headerShown: false}}/>
        <Tab.Screen name="TFJS" component={TFJSScreen} options={{headerShown: false}}/>
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
