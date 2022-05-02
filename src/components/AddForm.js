import { Box, Button, TextInput, VStack } from "@react-native-material/core";
import React, { useState, useEffect } from 'react';

const AddForm = () => {

    const [name, setname] = useState();
    const [age, setAge] = useState();
    const [blood, setBlood] = useState();
    const [condition, setCondition] = useState();
    const [symptoms, setSymptoms] = useState();
    const [bed, setBed] = useState();

    return (<>
        <Box style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
            <VStack spacing={5}>
            <TextInput variant="outlined" placeholder="Name"
             onChangeText={(v) => {
                console.log(v);
                setId(v);
            }}/><TextInput variant="outlined" placeholder="Name"
            onChangeText={(v) => {
               console.log(v);
               setId(v);
           }}/><TextInput variant="outlined" placeholder="Name"
           onChangeText={(v) => {
              console.log(v);
              setId(v);
          }}/><TextInput variant="outlined" placeholder="Name"
          onChangeText={(v) => {
             console.log(v);
             setId(v);
         }}/><TextInput variant="outlined" placeholder="Name"
         onChangeText={(v) => {
            console.log(v);
            setId(v);
        }}/><TextInput variant="outlined" placeholder="Name"
        onChangeText={(v) => {
           console.log(v);
           setId(v);
       }}/>
            </VStack>
            
        </Box>

    </>);
}

export default AddForm;