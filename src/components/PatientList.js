import { API, graphqlOperation, Auth } from 'aws-amplify';
import { onCreatePatient, onUpdatePatient } from '../graphql/subscriptions';
import { listPatients } from '../graphql/queries';
import {
    Pressable, View, Text, ListItem, Box, Surface, Button,
    ActivityIndicator, Flex, Stack, HStack, Spacer, VStack,
    Chip, Dialog,TextInput,
    DialogHeader,
    DialogContent,
    DialogActions,
    Divider, FAB
}
    from "@react-native-material/core";

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react';
import Position from 'react-native/Libraries/Components/Touchable/Position';
import AddForm from './AddForm';



const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);

   


    useEffect(() => {
        fetchLog();
        const subscription = API.graphql(graphqlOperation(onUpdatePatient)).subscribe({
            next: () => {
                fetchLog();
                console.log("Update detected");
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [patients]);

    useEffect(() => {
        const subscription = API.graphql(graphqlOperation(onCreatePatient)).subscribe({
            next: () => {
                fetchLog();
                console.log("New record detected");
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [patients]);

    async function fetchLog() {
        try {
            const apiData = await API.graphql(graphqlOperation(listPatients));
            setPatients(apiData.data.listPatients.items);
            // console.log(patients);
        } catch (error) {
            console.log(error);
        }

    }

    function toggleForm() {
        setShowForm(!showForm)
    }


    
    return (

        showForm ?

            <>
                <AddForm />
                <Button onPress={toggleForm} title='Back' />
            </>
            :
            <>
                <Text variant='h1'>
                    list here
                </Text>
                <Button title="Add Patient" variant="contained" color="primary"
                    style={{ position: 'absolute', bottom: 20, right: 20, width: 140, height: 40 }}
                    onPress={toggleForm}
                />
            </>

    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default PatientList;