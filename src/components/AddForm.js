import { Box, Button, TextInput, VStack, ScrollView, HStack } from "@react-native-material/core";
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'
import { createPatient } from "../graphql/mutations";
import { API, graphqlOperation } from 'aws-amplify';

const AddForm = () => {

    const [_name, setname] = useState("");
    const [_age, setAge] = useState("");
    const [_blood, setBlood] = useState("");
    const [_condition, setCondition] = useState("");
    const [_symptoms, setSymptoms] = useState("");
    const [_bed, setBed] = useState(0);
    const [_room, setroom] = useState(0);

    async function addPatient() {
        if (_name == '' || _age == '' || _blood == '' || _condition == '' || _symptoms == '' || _bed == 0 || _room == 0) {
            console.log('something missing');
            Alert.alert(
                "Empty Fields",
                "you need to fill all the fields.",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
        else {
            console.log(_name, _age, _blood, _condition, _symptoms, _bed, _room);
            try {
                const apiData = await API.graphql(graphqlOperation(createPatient, {
                    input: {
                        id: _bed,
                        name: _name,
                        age: _age,
                        blood: _blood,
                        condition: _condition,
                        symptoms: _symptoms,
                        room: _room
                    }
                }));
                console.log(apiData);
                
            } catch (error) {
                Alert.alert(
                    "Bed is already Occupied",
                    "Please select another bed.",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
                console.log(error);
            }


        }
    }


    return (

        <VStack spacing={5} style={{ width: 300 }} >
            <TextInput variant="outlined" placeholder="Name"
                onChangeText={(v) => {
                    setname(v);
                }} />
            <TextInput variant="outlined" placeholder="Age" keyboardType="number-pad"
                onChangeText={(v) => {
                    setAge(v)
                }} />
            <TextInput variant="outlined" placeholder="Blood Group"
                onChangeText={(v) => {
                    setBlood(v)
                }} />

            <TextInput variant="outlined" placeholder="Condition"
                onChangeText={(v) => {
                    setCondition(v)
                }} />
            <TextInput variant="outlined" placeholder="Symptoms"
                onChangeText={(v) => {
                    setSymptoms(v)
                }} />
            <HStack spacing={40}>
                <TextInput variant="outlined" placeholder="Bed" keyboardType="number-pad" style={{ width: 130 }}
                    onChangeText={(v) => {
                        setBed(v)
                    }} />
                <TextInput variant="outlined" placeholder="Room" keyboardType="number-pad" style={{ width: 130 }}
                    onChangeText={(v) => {
                        setroom(v)
                    }} />
            </HStack>

            <Button onPress={() => {
                addPatient();
            }} title='Add' />
        </VStack>
    );
}

export default AddForm;