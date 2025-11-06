import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AdminUser_Key {
  id: UUIDString;
  __typename?: 'AdminUser_Key';
}

export interface CreateNewTagData {
  tag_insert: Tag_Key;
}

export interface CreateNewTagVariables {
  name: string;
  slug: string;
}

export interface EventTag_Key {
  eventId: UUIDString;
  tagId: UUIDString;
  __typename?: 'EventTag_Key';
}

export interface Event_Key {
  id: UUIDString;
  __typename?: 'Event_Key';
}

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

export interface PhrasebookEntryTag_Key {
  phrasebookEntryId: UUIDString;
  tagId: UUIDString;
  __typename?: 'PhrasebookEntryTag_Key';
}

export interface PhrasebookEntry_Key {
  id: UUIDString;
  __typename?: 'PhrasebookEntry_Key';
}

export interface Tag_Key {
  id: UUIDString;
  __typename?: 'Tag_Key';
}

export interface TrendTag_Key {
  trendId: UUIDString;
  tagId: UUIDString;
  __typename?: 'TrendTag_Key';
}

export interface Trend_Key {
  id: UUIDString;
  __typename?: 'Trend_Key';
}

export interface UpdateTrendDescriptionData {
  trend_update?: Trend_Key | null;
}

export interface UpdateTrendDescriptionVariables {
  id: UUIDString;
  description: string;
}

interface CreateNewTagRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewTagVariables): MutationRef<CreateNewTagData, CreateNewTagVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewTagVariables): MutationRef<CreateNewTagData, CreateNewTagVariables>;
  operationName: string;
}
export const createNewTagRef: CreateNewTagRef;

export function createNewTag(vars: CreateNewTagVariables): MutationPromise<CreateNewTagData, CreateNewTagVariables>;
export function createNewTag(dc: DataConnect, vars: CreateNewTagVariables): MutationPromise<CreateNewTagData, CreateNewTagVariables>;

interface ListAllEventsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllEventsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllEventsData, undefined>;
  operationName: string;
}
export const listAllEventsRef: ListAllEventsRef;

export function listAllEvents(): QueryPromise<ListAllEventsData, undefined>;
export function listAllEvents(dc: DataConnect): QueryPromise<ListAllEventsData, undefined>;

interface UpdateTrendDescriptionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTrendDescriptionVariables): MutationRef<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTrendDescriptionVariables): MutationRef<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
  operationName: string;
}
export const updateTrendDescriptionRef: UpdateTrendDescriptionRef;

export function updateTrendDescription(vars: UpdateTrendDescriptionVariables): MutationPromise<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
export function updateTrendDescription(dc: DataConnect, vars: UpdateTrendDescriptionVariables): MutationPromise<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;

interface ListPremiumPhrasebookEntriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPremiumPhrasebookEntriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPremiumPhrasebookEntriesData, undefined>;
  operationName: string;
}
export const listPremiumPhrasebookEntriesRef: ListPremiumPhrasebookEntriesRef;

export function listPremiumPhrasebookEntries(): QueryPromise<ListPremiumPhrasebookEntriesData, undefined>;
export function listPremiumPhrasebookEntries(dc: DataConnect): QueryPromise<ListPremiumPhrasebookEntriesData, undefined>;

