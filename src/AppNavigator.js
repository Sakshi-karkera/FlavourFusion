import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from './Screens/Splash';
import Home from './Screens/Home';
import Search from './Screens/Search';
import Details from './Screens/Details';
import Signup from './Screens/Signup';
import RecipeByCategory from './Screens/RecipeByCategory';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Splash'
                    component={Splash}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Signup'
                    component={Signup}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Search'
                    component={Search}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Details'
                    component={Details}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='RecipeByCategory'
                    component={RecipeByCategory}
                    options={{ headerShown: false }} />

            </Stack.Navigator>

        </NavigationContainer>
    );
};
export default AppNavigator