import { API, graphqlOperation, Auth } from 'aws-amplify';
import { onCreatePatient, onUpdatePatient } from '../graphql/subscriptions';
import { listPatients } from '../graphql/queries';
import { deletePatient } from '../graphql/mutations';
import {
    Pressable, View, Text, ListItem, Box, Surface, Button,
    ActivityIndicator, Flex, Stack, HStack, Spacer, VStack,
    Chip, Dialog, TextInput,
    DialogHeader,
    DialogContent,
    DialogActions,
    Divider, FAB, IconButton
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

    const [refreshing, setRefreshing] = useState(false);




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

    const callDeletfromid = async (_id) => {
        console.log(`delete record in ${_id}`);
        console.log(await API.graphql(graphqlOperation(deletePatient, { input: { id: _id } })));
        return null;
    }

    const renderItem = ({ item }) => {
        return (
            <>

                <Box  >
                    <HStack>
                        <Box w={30} />
                        <Text variant='h4'>{item.id}</Text>
                        <Box w={20} />

                        <Text variant='h4'>{item.name}</Text>
                        <Spacer />
                        <IconButton icon={props => <MaterialCommunityIcons name="delete" {...props} />}
                            onLongPress={() => {
                                callDeletfromid(item.id);
                            }}
                        />
                    </HStack>
                </Box>

                <Box h={5} />
                <Divider />
                <Box h={5} />
            </>
        );
    }

    return (

        showForm ?

            <>
                <AddForm />
                <Box h={30} />
                <Button onPress={toggleForm} title='Back' />
            </>
            :
            <>
                <FlatList
                    data={patients}
                    keyExtractor={({ id }) => id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={() => fetchLog()}
                    style={{ alignSelf: 'stretch' }}
                />
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