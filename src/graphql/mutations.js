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
      nurse
      updatedAt
      createdAt
    }
  }
`;
