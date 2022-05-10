import { API, graphqlOperation, Auth } from 'aws-amplify';
import { callsByUpdate, getPatient, listCalls } from '../graphql/queries';
import { onUpdateCall, onCreateCall } from '../graphql/subscriptions';
import { updateCall } from '../graphql/mutations';
import {
    Pressable, View, Text, ListItem, Box, Surface, Button,
    ActivityIndicator, Flex, Stack, HStack, Spacer, VStack,
    Chip, Dialog,
    DialogHeader,
    DialogContent,
    DialogActions,
    Divider,
}
    from "@react-native-material/core";

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import CallDelete from './CallDelete';


import { Notifications } from 'react-native-notifications';


const CallList = () => {

    const [calls, setCalls] = useState([]);
    const [doneCalls, setDoneCalls] = useState([]);
    const [nurseName, setNurseName] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [detailedModel, setDetailedModel] = useState(null);

    const [sound, setSound] = React.useState();

    async function playSound() {

       
    }
    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    var initialPatient = {
        "age": 0,
        "blood": "No Data",
        "condition": "No Data",
        "id": "No Data",
        "name": "No Data",
        "room": 0,
        "symptoms": "No Data",
    }
    var loadingPatient = {
        "age": 0,
        "blood": "Loading ...",
        "condition": "Loading ...",
        "id": "Loading ...",
        "name": "Loading ...",
        "room": 0,
        "symptoms": "Loading ...",
    }



    const [patient, setPatient] = useState(initialPatient);

    useEffect(() => {
        getNurseName();
        fetchLog();
        fetchDoneLog();

        const subscription = API.graphql(graphqlOperation(onUpdateCall)).subscribe({
            next: () => {
                playSound();
                fetchLog();
                fetchDoneLog();
                console.log("Update detected");
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [calls]);

    useEffect(() => {
        const subscription = API.graphql(graphqlOperation(onCreateCall)).subscribe({
            next: () => {
                playSound();
                fetchLog();
                fetchDoneLog();
                console.log("New record detected");
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [calls]);

    async function fetchLog() {
        try {
            const apiData = await API.graphql(graphqlOperation(callsByUpdate, {
                version: 'v1',
                sortField: "updatedAt",
                sortDirection: "DESC"

            }));
            setCalls(apiData.data.callsByUpdate.items);
            // console.log(calls);
        } catch (error) {
            console.log(error);
        }

    }

    async function fetchDoneLog() {
        try {
            const apiData = await API.graphql(graphqlOperation(callsByUpdate, {
                version: 'v2',
                sortField: "updatedAt",
                sortDirection: "DESC"

            }));
            setDoneCalls(apiData.data.callsByUpdate.items);
            // console.log(doneCalls);
        } catch (error) {
            console.log(error);
        }

    }

    async function getNurseName() {
        const user = await Auth.currentAuthenticatedUser();
        setNurseName(user.attributes.name);
    }
    async function acceptCall(_id) {
        getNurseName();
        console.log('answered by ', nurseName);
        try {
            const apiData = await API.graphql(graphqlOperation(updateCall, { input: { id: _id, nurse: nurseName, answered: true, version: 'v2' } }));
            // console.log(apiData);
        } catch (error) {
            console.log(error);
        }
        setShowDetails(false)


    }

    async function gotoDetailed(item) {

        console.log("window for ", item.id);
        setPatient(loadingPatient)
        setDetailedModel(item)
        setShowDetails(true)
        try {
            const apiData = await API.graphql(graphqlOperation(getPatient, {
                id: item.bed

            }));

            apiData.data.getPatient != null ? setPatient(apiData.data.getPatient) : setPatient(initialPatient)


        } catch (error) {
            console.log(error);
        }


        return null
    }

    function addLeadingZeros(num, totalLength) {
        return String(num).padStart(totalLength, '0');
    }

    const renderItem = ({ item }) => {
        let c_date = new Date();
        let u_date = new Date(item.updatedAt);
        let diff = Math.abs(c_date - u_date);
        const hours = parseInt(diff / (1000 * 60 * 60) % 60);
        const minutes = parseInt(diff / (1000 * 60) % 60);
        const seconds = parseInt(diff / (1000) % 60);

        let card_color = item.calltype === "Help" ? "dodgerblue" : "tomato"

        if (item.answered) {
            card_color = "limegreen"
        }

        return (

            <Pressable onPress={() => gotoDetailed(item)}>
                <Surface elevation={6} category="small"
                    style={{
                        marginHorizontal: 12,
                        marginTop: 5,
                        marginBottom: 5,
                        padding: 10,
                        backgroundColor: card_color
                    }}
                >

                    <VStack>
                        <HStack pl={10} pr={10}>
                            {
                                item.answered ?
                                    <>
                                        <VStack w={180} >
                                            <Text variant='h6' >This call is </Text>
                                            <Text variant='h4' color='white'>Answered</Text>
                                        </VStack>
                                    </>
                                    :
                                    <>
                                        <VStack w={180} >
                                            <Text variant='h6' >Time passed </Text>
                                            <Text variant='h4' color='white'>{addLeadingZeros(hours, 2)}:{addLeadingZeros(minutes, 2)}:{addLeadingZeros(seconds, 2)}</Text>
                                        </VStack>
                                    </>
                            }
                            <Spacer />
                            <VStack w={90}>
                                <Text variant='h6' style={{ alignSelf: 'center' }}>Bed </Text>
                                <Spacer />
                                <Text variant='h4' color='white' style={{ alignSelf: 'center' }}>{item.bed}</Text>
                            </VStack>

                        </HStack>
                        <HStack  >
                            <HStack w={180}>
                                <Text variant='h6' >Date : </Text>
                                <Text variant='h6' color='white'>{item.date}</Text>
                            </HStack>
                            <Spacer />
                            <HStack w={180}>
                                <Text variant='h6'>Time : </Text>
                                <Text variant='h6' color='white'>{String(item.time).split(".")[0]}</Text>
                            </HStack>
                        </HStack>
                        <Box h={3}></Box>
                        {/* <Box h={15} p={10} style={{ backgroundColor: "white", borderRadius: 5 }} ></Box> */}
                        <HStack>
                            {
                                item.answered ?
                                    <Chip
                                        variant="filled"
                                        label="Ok"
                                        color="green"
                                        leading={props => <MaterialCommunityIcons name="help-rhombus" {...props} />}
                                    /> :
                                    <Chip
                                        variant="filled"
                                        label="Pending"
                                        color="red"
                                        leading={props => <MaterialCommunityIcons name="help-rhombus" {...props} />}
                                    />
                            }
                            <Box w={5}></Box>
                            <Flex fill center style={{ backgroundColor: "lightskyblue", borderRadius: 15 }} >
                                <Text style={{ fontSize: 20, color: 'darkblue' }}>{item.nurse}</Text>
                            </Flex>
                        </HStack>

                    </VStack>

                </Surface>

            </Pressable>


        );
    }

    return (
        calls.length + doneCalls.length == 0 ?
            <Stack fill center >
                <ActivityIndicator size="large" color="#00ff00" />
            </Stack>
            :
            <>
                {showDetails ?

                    detailedModel === null ?
                        <Flex center >
                            <Text variant='h3'>Something Wrong!</Text>
                            <Box h={100}></Box>
                            <Button title='Go Back' onPress={() => { setShowDetails(false) }} />
                        </Flex>
                        :
                        <Flex fill content='start' justify='center' p={10} style={{
                            backgroundColor: detailedModel.calltype === "Help" ? "dodgerblue" : "tomato", shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.34,
                            shadowRadius: 6.27, elevation: 10
                        }}>
                            <Box m={10} style={{ backgroundColor: 'white', borderRadius: 20 }}>
                                <Box fill p={5} mb={5} style={{ alignItems: 'center', backgroundColor: detailedModel.calltype === "Help" ? "#5273E2" : "#E25252", borderTopStartRadius: 20, borderTopEndRadius: 20 }}>
                                    {
                                        detailedModel.calltype === "Help" ?
                                            <Text variant='h6' color='black'>Room <Text variant='h3' color='white'>{patient.room} </Text> bed <Text variant='h3' color='white'>{detailedModel.bed} </Text></Text>
                                            :
                                            <Text variant='h6' color='black'>Room <Text variant='h3' color='white'>{patient.room} </Text> bed <Text variant='h3' color='white'>{detailedModel.bed} </Text></Text>
                                    }
                                </Box>
                                <VStack spacing={4} p={10}>
                                    <Text variant='h6'>Patient</Text>
                                    <Divider></Divider>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Name</Text>
                                        <Text variant='h6'>: {patient.name}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Age</Text>
                                        <Text variant='h6'>: {patient.age} years</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Blood</Text>
                                        <Text variant='h6'>: {patient.blood}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Condition</Text>
                                        <Text variant='h6'>: {patient.condition}</Text>
                                    </HStack>
                                    <Box h={5} />
                                    <Divider />
                                    <Text variant='h6' >Symptoms :</Text>

                                    <ScrollView style={{ height: 200 }}>
                                        <Text variant='h6'> {patient.symptoms}</Text>
                                    </ScrollView>
                                    <HStack justify='evenly'>
                                        <Button title='Go Back' onPress={() => { setShowDetails(false) }} />
                                        <Button disabled={detailedModel.answered} title='Accept Call' onPress={() => acceptCall(detailedModel.id)} />
                                    </HStack>
                                </VStack>
                            </Box>
                        </Flex>
                    :
                    <>
                        <Button onPress={playSound} title={"play"} />
                        <FlatList
                            data={[...calls, ...doneCalls]}
                            keyExtractor={({ id }) => id}
                            renderItem={renderItem}
                            refreshing={refreshing}
                            onRefresh={() => fetchLog()}

                        />
                        {/* <CallDelete /> */}
                    </>

                }

            </>
    );
}


export default CallList;