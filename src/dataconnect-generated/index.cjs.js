const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'decoree',
  location: 'asia-northeast3'
};
exports.connectorConfig = connectorConfig;

const createNewTagRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewTag', inputVars);
}
createNewTagRef.operationName = 'CreateNewTag';
exports.createNewTagRef = createNewTagRef;

exports.createNewTag = function createNewTag(dcOrVars, vars) {
  return executeMutation(createNewTagRef(dcOrVars, vars));
};

const listAllEventsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllEvents');
}
listAllEventsRef.operationName = 'ListAllEvents';
exports.listAllEventsRef = listAllEventsRef;

exports.listAllEvents = function listAllEvents(dc) {
  return executeQuery(listAllEventsRef(dc));
};

const updateTrendDescriptionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTrendDescription', inputVars);
}
updateTrendDescriptionRef.operationName = 'UpdateTrendDescription';
exports.updateTrendDescriptionRef = updateTrendDescriptionRef;

exports.updateTrendDescription = function updateTrendDescription(dcOrVars, vars) {
  return executeMutation(updateTrendDescriptionRef(dcOrVars, vars));
};

const listPremiumPhrasebookEntriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPremiumPhrasebookEntries');
}
listPremiumPhrasebookEntriesRef.operationName = 'ListPremiumPhrasebookEntries';
exports.listPremiumPhrasebookEntriesRef = listPremiumPhrasebookEntriesRef;

exports.listPremiumPhrasebookEntries = function listPremiumPhrasebookEntries(dc) {
  return executeQuery(listPremiumPhrasebookEntriesRef(dc));
};
