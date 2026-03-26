import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              title: 'MeetWhen',
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity 
                  style={{ marginRight: 16 }} 
                  onPress={() => navigation.setParams({ showModal: true })} 
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="add" 
                    size={24} 
                    color="#007AFF" 
                  />
                </TouchableOpacity>
              ),
            })} 
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
