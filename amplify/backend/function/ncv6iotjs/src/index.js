

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

var v = 'v1';

function dt(yourDate) {
    // offset <= +5.30 <= 5*60 + 30 <= 330 <= in minus
    const offset = yourDate.getTimezoneOffset()
    // console.log(offset);
    yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
    date = yourDate.toISOString().split('T')[0]
    time = yourDate.toISOString().split('T')[1]
    return { date, time }
}

async function callGraphql(data) {
    var axios = require('axios');

    var config = {
        method: 'post',
        url: 'https://kg6h4jrzrreehmrq633j2nrdsa.appsync-api.us-west-2.amazonaws.com/graphql',
        headers: {
            'x-api-key': 'da2-fic5vcbxf5dxtlp2pa3a47j6im',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let res = "";

    await axios(config)
        .then(function (response) {
            res = response.data
            return {
                statusCode: 200,
                //  Uncomment below to enable CORS requests
                // headers: {
                //     "Access-Control-Allow-Origin": "*",
                //     "Access-Control-Allow-Headers": "*"
                // },
                body: JSON.stringify(res),
            };
        })
        .catch(function (error) {
            res = error;
            return {
                statusCode: 400,
                //  Uncomment below to enable CORS requests
                // headers: {
                //     "Access-Control-Allow-Origin": "*",
                //     "Access-Control-Allow-Headers": "*"
                // },
                body: JSON.stringify(res),
            };
        });
    return res;
}

async function saveToAmplify(event) {
    datetime = dt(new Date());

    var data = JSON.stringify({
        query: `mutation MyMutation {
        createCall(
          input: {version: "${v}", answered: false, bed: ${event["bed"]}, calltype: "${event["calltype"]}", date: "${datetime["date"]}", id: "${new Date().getTime()}", nurse: "Not Responded", room: ${event["room"]}, time: "${datetime["time"]}"}
        ) {
          id
          nurse
          room
          time
          updatedAt
          version
          date
          createdAt
          calltype
          bed
          answered
        }
      }`,
        variables: {}
    });

    console.log(data);
    return await callGraphql(data);
}

async function updateAmplify(id) {
    datetime = dt(new Date());

    var data = JSON.stringify({
        query: `mutation MyMutation {
        updateCall(
          input: {id: ${id}, date: "${datetime["date"]}", time: "${datetime["time"]}"}
        ) {
          date
          time
        }
      }`,
        variables: {}
    });

    console.log(data);
    return callGraphql(data);
}

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    var data = JSON.stringify({
        query: `query MyQuery {
        callsByUpdate(
          version: "${v}"
          sortDirection: DESC
          filter: {bed: {eq: ${event["bed"]}}, room: {eq: ${event["room"]}}, calltype: {eq: "${event["calltype"]}"}, answered: {eq: false}}
        ) {
          items {
            id
          }
        }
      }`,
        variables: {}
    });

    res = await callGraphql(data);
    console.log('Record available at ', res.data.callsByUpdate.items);

    if (res.data.callsByUpdate.items.length != 0) {
        id = res.data.callsByUpdate.items[0].id;
        console.log(`updating not responded record at ${id}`);
        //update
        await updateAmplify(id);
    } else {
        console.log("adding new record");
        //add new
        await saveToAmplify(event);
    }

};
