import { API, graphqlOperation } from 'aws-amplify';
import { callsByUpdate, listCalls } from '../graphql/queries';
import { onCreateCall } from '../graphql/subscriptions'
import { Pressable, View, Text, ListItem, Box, Surface, ActivityIndicator, Flex, Stack, HStack, Spacer, VStack } from "@react-native-material/core";
import { FlatList } from 'react-native'
import React, { useState, useEffect } from 'react';

let subscription;



const CallList = () => {

    const [calls, setCalls] = useState([]);

    useEffect(() => {
        fetchLog();
        subscription
    }, []);

    async function fetchLog() {
        try {
            const apiData = await API.graphql(graphqlOperation(callsByUpdate,{
                version:'v1',
                sortField: "updatedAt", 
                sortDirection: "DESC"
            }));
            setCalls(apiData.data.callsByUpdate.items);
            console.log(calls);
        } catch (error) {
            console.log(error);
        }

    }


    const renderItem = ({ item }) => {
        console.log(item);
        return (
            <Surface elevation={6} category="medium"
                style={{
                    marginHorizontal: 12,
                    marginBottom: 10,
                    padding: 10,
                    backgroundColor: item.calltype === "Help" ? "dodgerblue" : "tomato"
                }}
            >
                <Pressable>
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

                    </VStack>
                </Pressable>
            </Surface>

        );
    }

    return (
        calls.length === 0 ?
            <Stack fill center >
                <ActivityIndicator size="large" color="#00ff00" />
            </Stack>

            :
            <FlatList
                data={calls}
                keyExtractor={({ id }) => id}
                renderItem={renderItem}
            />
    );
}

export default CallList;