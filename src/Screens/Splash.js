import { View, Text, StyleSheet,StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation()
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Home")
        }, 9000)
    }, [])
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <StatusBar barStyle="dark-content" />
            <Animatable.Image animation={'slideInUp'} source={require('../images/logo.png')} style={styles.logo} />
            <Animatable.Text animation={'slideInUp'} style={styles.appname}>RecipeRef</Animatable.Text>
            <Animatable.Text animation={'slideInUp'} style={styles.tagline}>Cooking Made Simple, Flavor Made Spectacular!</Animatable.Text>
        </View>
    )
}

export default Splash
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: '50%',
    },
    appname: {
        fontSize: 50,
        fontWeight: '600',
        color: 'black',
        marginBottom: '19%',
    },
    tagline: {
        bottom: 65,
        fontWeight: '600',
        color: 'black',
        fontSize: 17,
        marginBottom: '50%',

    },
})