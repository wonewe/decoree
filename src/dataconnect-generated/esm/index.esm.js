import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'decoree',
  location: 'asia-northeast3'
};

export const createNewTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewTag', inputVars);
}
createNewTagRef.operationName = 'CreateNewTag';

export function createNewTag(dcOrVars, vars) {
  return executeMutation(createNewTagRef(dcOrVars, vars));
}

export const listAllEventsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllEvents');
}
listAllEventsRef.operationName = 'ListAllEvents';

export function listAllEvents(dc) {
  return executeQuery(listAllEventsRef(dc));
}

export const updateTrendDescriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTrendDescription', inputVars);
}
updateTrendDescriptionRef.operationName = 'UpdateTrendDescription';

export function updateTrendDescription(dcOrVars, vars) {
  return executeMutation(updateTrendDescriptionRef(dcOrVars, vars));
}

export const listPremiumPhrasebookEntriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPremiumPhrasebookEntries');
}
listPremiumPhrasebookEntriesRef.operationName = 'ListPremiumPhrasebookEntries';

export function listPremiumPhrasebookEntries(dc) {
  return executeQuery(listPremiumPhrasebookEntriesRef(dc));
}

