import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import { Alert, SafeAreaView, ScrollView, StyleSheet,Text, Image, AsyncStorage, TouchableOpacity } from 'react-native';

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List({ navigation }) {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://192.168.1.10:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA :)' : 'REJEITADA :('}`)
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    }, [])

    function handleLogout() {
        AsyncStorage.removeItem('user');
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
                <TouchableOpacity 
                style={styles.btn}
                onPress={handleLogout}
            >
                <Text>Logout</Text>
            </TouchableOpacity>
            </ScrollView>
        
        </ SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logo: {
        marginTop: 50,
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
    },

    btn: {
        height: 30,
        width:100,
        alignSelf: 'center',
        backgroundColor: '#fe1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 15,
    },
})