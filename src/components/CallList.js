import { API, graphqlOperation, Auth } from 'aws-amplify';
import { callsByUpdate, listCalls } from '../graphql/queries';
import { onUpdateCall, onCreateCall } from '../graphql/subscriptions';
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



const CallList = () => {

    const [calls, setCalls] = useState([]);
    const [nurseName, setNurseName] = useState();
    const [refreshing, setRefreshing] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [detailedModel, setDetailedModel] = useState(null);

    useEffect(() => {
        getNurseName();
        fetchLog();
        const subscription = API.graphql(graphqlOperation(onUpdateCall)).subscribe({
            next: () => {
                fetchLog();
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
                fetchLog();
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

    async function getNurseName() {
        const user = await Auth.currentAuthenticatedUser();
        setNurseName(user.attributes.name);
    }

    function gotoDetailed(item) {
        console.log("window for ", item.id);
        setDetailedModel(item)
        setShowDetails(true)
        return null
    }

    const renderItem = ({ item }) => {
        return (

            <Pressable onPress={() => gotoDetailed(item)}>
                <Surface elevation={6} category="small"
                    style={{
                        marginHorizontal: 12,
                        marginTop: 5,
                        marginBottom: 5,
                        padding: 10,
                        backgroundColor: item.calltype === "Help" ? "dodgerblue" : "tomato"
                    }}
                >

                    <VStack>
                        <HStack pl={10} pr={10}>
                            <HStack w={180} >
                                <Text variant='h5' >Room </Text>
                                <Text variant='h2' color='white'>{item.room}</Text>
                            </HStack>
                            <Spacer />
                            <HStack w={180}>
                                <Text variant='h5'>Bed </Text>
                                <Text variant='h2' color='white'>{item.bed}</Text>
                            </HStack>
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
        calls.length === 0 ?
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
                                            <Text variant='h6' color='black'>Your assistance require at room <Text variant='h5' color='white'>{detailedModel.room} </Text> bed <Text variant='h5' color='white'>{detailedModel.bed} </Text></Text>
                                            :
                                            <Text variant='h6' color='black'>Emergency situation in room <Text variant='h5' color='white'>{detailedModel.room} </Text> bed <Text variant='h5' color='white'>{detailedModel.bed} </Text></Text>
                                    }
                                </Box>
                                <VStack spacing={4} p={10}>
                                    <Text variant='h6'>Patient</Text>
                                    <Divider></Divider>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Name</Text>
                                        <Text variant='h6'>: M.D.chamara gayan</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Age</Text>
                                        <Text variant='h6'>: 25 years</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Blood</Text>
                                        <Text variant='h6'>: B+</Text>
                                    </HStack>
                                    <HStack>
                                        <Text variant='h6' style={{ width: 90 }}>Condition</Text>
                                        <Text variant='h6'>: Good</Text>
                                    </HStack>
                                    <Box h={5} />
                                    <Text variant='h6' >Symptoms</Text>
                                    <Divider />
                                    <ScrollView style={{ height: 200 }}>
                                        <Text variant='h6'>
                                            fever, cough, tiredness, loss of taste or smell
                                            Seek immediate medical attention if you have serious symptoms. Always call before visiting your doctor or health facility.
                                            People with mild symptoms who are otherwise healthy should manage their symptoms at home.
                                            On average it takes 5–6 days from when someone is infected with the virus for symptoms to show, however it can take up to 14 days.
                                        </Text>
                                    </ScrollView>
                                    <HStack justify='evenly'>
                                        <Button title='Go Back' onPress={() => { setShowDetails(false) }} />
                                        <Button title='Go Back' onPress={() => { setShowDetails(false) }} />
                                    </HStack>
                                </VStack>
                            </Box>
                        </Flex>
                    :
                    <FlatList
                        data={calls}
                        keyExtractor={({ id }) => id}
                        renderItem={renderItem}
                        refreshing={refreshing}
                        onRefresh={() => fetchLog()}

                    />

                }

            </>
    );
}


export default CallList;