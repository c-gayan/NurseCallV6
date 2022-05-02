import { Box, Button, TextInput } from "@react-native-material/core";
import { API, graphqlOperation } from "aws-amplify";
import React, { useState, useEffect } from 'react';
import { deleteCall } from "../graphql/mutations";

const CallDelete = () => {

    const [Id, setId] = useState('');

    const callDeletfromid = async () => {
        console.log(`delete record in ${Id}`);
        console.log(await API.graphql(graphqlOperation(deleteCall, { input: { id: Id } })));
        return null;
    }

    return (
        <>
            <Box style={{ paddingHorizontal: 12 , paddingBottom:10 }}>
                <TextInput variant="outlined" onChangeText={(v) => {
                    console.log(v);
                    setId(v);
                }}
                >

                </TextInput>
                <Button onPress={callDeletfromid} title='delete' />
            </Box>

        </>
    );
}

export default CallDelete;