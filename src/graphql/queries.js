/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCall = /* GraphQL */ `
  query GetCall($id: ID!) {
    getCall(id: $id) {
      id
      version
      date
      time
      bed
      room
      calltype
      answered
      reason
      nurse
      updatedAt
      createdAt
    }
  }
`;
export const listCalls = /* GraphQL */ `
  query ListCalls(
    $filter: ModelCallFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCalls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        version
        date
        time
        bed
        room
        calltype
        answered
        reason
        nurse
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      id
      name
      age
      blood
      condition
      symptoms
      room
      createdAt
      updatedAt
    }
  }
`;
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        age
        blood
        condition
        symptoms
        room
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const callsByUpdate = /* GraphQL */ `
  query CallsByUpdate(
    $version: String!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCallFilterInput
    $limit: Int
    $nextToken: String
  ) {
    callsByUpdate(
      version: $version
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        version
        date
        time
        bed
        room
        calltype
        answered
        reason
        nurse
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
