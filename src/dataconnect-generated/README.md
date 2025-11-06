# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllEvents*](#listallevents)
  - [*ListPremiumPhrasebookEntries*](#listpremiumphrasebookentries)
- [**Mutations**](#mutations)
  - [*CreateNewTag*](#createnewtag)
  - [*UpdateTrendDescription*](#updatetrenddescription)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllEvents
You can execute the `ListAllEvents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllEvents(): QueryPromise<ListAllEventsData, undefined>;

interface ListAllEventsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllEventsData, undefined>;
}
export const listAllEventsRef: ListAllEventsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllEvents(dc: DataConnect): QueryPromise<ListAllEventsData, undefined>;

interface ListAllEventsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllEventsData, undefined>;
}
export const listAllEventsRef: ListAllEventsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllEventsRef:
```typescript
const name = listAllEventsRef.operationName;
console.log(name);
```

### Variables
The `ListAllEvents` query has no variables.
### Return Type
Recall that executing the `ListAllEvents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllEventsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllEventsData {
  events: ({
    id: UUIDString;
    title: string;
    description: string;
    eventDate: DateString;
    location: string;
    isPremium?: boolean | null;
    imageUrl?: string | null;
    creator?: {
      id: UUIDString;
      username: string;
      email: string;
    } & AdminUser_Key;
  } & Event_Key)[];
}
```
### Using `ListAllEvents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllEvents } from '@dataconnect/generated';


// Call the `listAllEvents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllEvents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllEvents(dataConnect);

console.log(data.events);

// Or, you can use the `Promise` API.
listAllEvents().then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

### Using `ListAllEvents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllEventsRef } from '@dataconnect/generated';


// Call the `listAllEventsRef()` function to get a reference to the query.
const ref = listAllEventsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllEventsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.events);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.events);
});
```

## ListPremiumPhrasebookEntries
You can execute the `ListPremiumPhrasebookEntries` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPremiumPhrasebookEntries(): QueryPromise<ListPremiumPhrasebookEntriesData, undefined>;

interface ListPremiumPhrasebookEntriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPremiumPhrasebookEntriesData, undefined>;
}
export const listPremiumPhrasebookEntriesRef: ListPremiumPhrasebookEntriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPremiumPhrasebookEntries(dc: DataConnect): QueryPromise<ListPremiumPhrasebookEntriesData, undefined>;

interface ListPremiumPhrasebookEntriesRef {
  ...
  (dc: DataConnect): QueryRef<ListPremiumPhrasebookEntriesData, undefined>;
}
export const listPremiumPhrasebookEntriesRef: ListPremiumPhrasebookEntriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPremiumPhrasebookEntriesRef:
```typescript
const name = listPremiumPhrasebookEntriesRef.operationName;
console.log(name);
```

### Variables
The `ListPremiumPhrasebookEntries` query has no variables.
### Return Type
Recall that executing the `ListPremiumPhrasebookEntries` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPremiumPhrasebookEntriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPremiumPhrasebookEntriesData {
  phrasebookEntries: ({
    id: UUIDString;
    koreanPhrase: string;
    frenchTranslation: string;
    pronunciationGuide?: string | null;
    creator?: {
      id: UUIDString;
      username: string;
      email: string;
    } & AdminUser_Key;
  } & PhrasebookEntry_Key)[];
}
```
### Using `ListPremiumPhrasebookEntries`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPremiumPhrasebookEntries } from '@dataconnect/generated';


// Call the `listPremiumPhrasebookEntries()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPremiumPhrasebookEntries();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPremiumPhrasebookEntries(dataConnect);

console.log(data.phrasebookEntries);

// Or, you can use the `Promise` API.
listPremiumPhrasebookEntries().then((response) => {
  const data = response.data;
  console.log(data.phrasebookEntries);
});
```

### Using `ListPremiumPhrasebookEntries`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPremiumPhrasebookEntriesRef } from '@dataconnect/generated';


// Call the `listPremiumPhrasebookEntriesRef()` function to get a reference to the query.
const ref = listPremiumPhrasebookEntriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPremiumPhrasebookEntriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.phrasebookEntries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.phrasebookEntries);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewTag
You can execute the `CreateNewTag` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewTag(vars: CreateNewTagVariables): MutationPromise<CreateNewTagData, CreateNewTagVariables>;

interface CreateNewTagRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewTagVariables): MutationRef<CreateNewTagData, CreateNewTagVariables>;
}
export const createNewTagRef: CreateNewTagRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewTag(dc: DataConnect, vars: CreateNewTagVariables): MutationPromise<CreateNewTagData, CreateNewTagVariables>;

interface CreateNewTagRef {
  ...
  (dc: DataConnect, vars: CreateNewTagVariables): MutationRef<CreateNewTagData, CreateNewTagVariables>;
}
export const createNewTagRef: CreateNewTagRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewTagRef:
```typescript
const name = createNewTagRef.operationName;
console.log(name);
```

### Variables
The `CreateNewTag` mutation requires an argument of type `CreateNewTagVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewTagVariables {
  name: string;
  slug: string;
}
```
### Return Type
Recall that executing the `CreateNewTag` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewTagData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewTagData {
  tag_insert: Tag_Key;
}
```
### Using `CreateNewTag`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewTag, CreateNewTagVariables } from '@dataconnect/generated';

// The `CreateNewTag` mutation requires an argument of type `CreateNewTagVariables`:
const createNewTagVars: CreateNewTagVariables = {
  name: ..., 
  slug: ..., 
};

// Call the `createNewTag()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewTag(createNewTagVars);
// Variables can be defined inline as well.
const { data } = await createNewTag({ name: ..., slug: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewTag(dataConnect, createNewTagVars);

console.log(data.tag_insert);

// Or, you can use the `Promise` API.
createNewTag(createNewTagVars).then((response) => {
  const data = response.data;
  console.log(data.tag_insert);
});
```

### Using `CreateNewTag`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewTagRef, CreateNewTagVariables } from '@dataconnect/generated';

// The `CreateNewTag` mutation requires an argument of type `CreateNewTagVariables`:
const createNewTagVars: CreateNewTagVariables = {
  name: ..., 
  slug: ..., 
};

// Call the `createNewTagRef()` function to get a reference to the mutation.
const ref = createNewTagRef(createNewTagVars);
// Variables can be defined inline as well.
const ref = createNewTagRef({ name: ..., slug: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewTagRef(dataConnect, createNewTagVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.tag_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.tag_insert);
});
```

## UpdateTrendDescription
You can execute the `UpdateTrendDescription` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTrendDescription(vars: UpdateTrendDescriptionVariables): MutationPromise<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;

interface UpdateTrendDescriptionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTrendDescriptionVariables): MutationRef<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
}
export const updateTrendDescriptionRef: UpdateTrendDescriptionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTrendDescription(dc: DataConnect, vars: UpdateTrendDescriptionVariables): MutationPromise<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;

interface UpdateTrendDescriptionRef {
  ...
  (dc: DataConnect, vars: UpdateTrendDescriptionVariables): MutationRef<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
}
export const updateTrendDescriptionRef: UpdateTrendDescriptionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTrendDescriptionRef:
```typescript
const name = updateTrendDescriptionRef.operationName;
console.log(name);
```

### Variables
The `UpdateTrendDescription` mutation requires an argument of type `UpdateTrendDescriptionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTrendDescriptionVariables {
  id: UUIDString;
  description: string;
}
```
### Return Type
Recall that executing the `UpdateTrendDescription` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTrendDescriptionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTrendDescriptionData {
  trend_update?: Trend_Key | null;
}
```
### Using `UpdateTrendDescription`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTrendDescription, UpdateTrendDescriptionVariables } from '@dataconnect/generated';

// The `UpdateTrendDescription` mutation requires an argument of type `UpdateTrendDescriptionVariables`:
const updateTrendDescriptionVars: UpdateTrendDescriptionVariables = {
  id: ..., 
  description: ..., 
};

// Call the `updateTrendDescription()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTrendDescription(updateTrendDescriptionVars);
// Variables can be defined inline as well.
const { data } = await updateTrendDescription({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTrendDescription(dataConnect, updateTrendDescriptionVars);

console.log(data.trend_update);

// Or, you can use the `Promise` API.
updateTrendDescription(updateTrendDescriptionVars).then((response) => {
  const data = response.data;
  console.log(data.trend_update);
});
```

### Using `UpdateTrendDescription`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTrendDescriptionRef, UpdateTrendDescriptionVariables } from '@dataconnect/generated';

// The `UpdateTrendDescription` mutation requires an argument of type `UpdateTrendDescriptionVariables`:
const updateTrendDescriptionVars: UpdateTrendDescriptionVariables = {
  id: ..., 
  description: ..., 
};

// Call the `updateTrendDescriptionRef()` function to get a reference to the mutation.
const ref = updateTrendDescriptionRef(updateTrendDescriptionVars);
// Variables can be defined inline as well.
const ref = updateTrendDescriptionRef({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTrendDescriptionRef(dataConnect, updateTrendDescriptionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.trend_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.trend_update);
});
```

