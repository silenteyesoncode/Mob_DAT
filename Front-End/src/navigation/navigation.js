
import React , { useState , useEffect , useContext } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth , onAuthStateChanged   } from "../firebase/firebase-utilities";


import Welcome_screen from '../Screens/welcome';
import TableCreationScreen from '../Screens/create-table';
import TableListScreen from '../Screens/table-list';
import TableDetailsScreen from '../Screens/tableDetails';



const Stack = createStackNavigator();


export default function Home() {


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="welcome_screen" component={Welcome_screen} />
        <Stack.Screen name="tableCreationScreen" component={TableCreationScreen} />
        <Stack.Screen name="tableListScreen" component={TableListScreen} />
        <Stack.Screen name="tableDetailsScreen" component={TableDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}