/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCall = /* GraphQL */ `
  mutation CreateCall(
    $input: CreateCallInput!
    $condition: ModelCallConditionInput
  ) {
    createCall(input: $input, condition: $condition) {
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
export const updateCall = /* GraphQL */ `
  mutation UpdateCall(
    $input: UpdateCallInput!
    $condition: ModelCallConditionInput
  ) {
    updateCall(input: $input, condition: $condition) {
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
export const deleteCall = /* GraphQL */ `
  mutation DeleteCall(
    $input: DeleteCallInput!
    $condition: ModelCallConditionInput
  ) {
    deleteCall(input: $input, condition: $condition) {
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
export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $input: CreatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    createPatient(input: $input, condition: $condition) {
      id
      name
      age
      blood
      condition
      symptoms
      bed
      createdAt
      updatedAt
    }
  }
`;
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $input: UpdatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    updatePatient(input: $input, condition: $condition) {
      id
      name
      age
      blood
      condition
      symptoms
      bed
      createdAt
      updatedAt
    }
  }
`;
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $input: DeletePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    deletePatient(input: $input, condition: $condition) {
      id
      name
      age
      blood
      condition
      symptoms
      bed
      createdAt
      updatedAt
    }
  }
`;
