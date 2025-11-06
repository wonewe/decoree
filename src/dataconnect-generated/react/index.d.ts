import { CreateNewTagData, CreateNewTagVariables, ListAllEventsData, UpdateTrendDescriptionData, UpdateTrendDescriptionVariables, ListPremiumPhrasebookEntriesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewTag(options?: useDataConnectMutationOptions<CreateNewTagData, FirebaseError, CreateNewTagVariables>): UseDataConnectMutationResult<CreateNewTagData, CreateNewTagVariables>;
export function useCreateNewTag(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewTagData, FirebaseError, CreateNewTagVariables>): UseDataConnectMutationResult<CreateNewTagData, CreateNewTagVariables>;

export function useListAllEvents(options?: useDataConnectQueryOptions<ListAllEventsData>): UseDataConnectQueryResult<ListAllEventsData, undefined>;
export function useListAllEvents(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllEventsData>): UseDataConnectQueryResult<ListAllEventsData, undefined>;

export function useUpdateTrendDescription(options?: useDataConnectMutationOptions<UpdateTrendDescriptionData, FirebaseError, UpdateTrendDescriptionVariables>): UseDataConnectMutationResult<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;
export function useUpdateTrendDescription(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTrendDescriptionData, FirebaseError, UpdateTrendDescriptionVariables>): UseDataConnectMutationResult<UpdateTrendDescriptionData, UpdateTrendDescriptionVariables>;

export function useListPremiumPhrasebookEntries(options?: useDataConnectQueryOptions<ListPremiumPhrasebookEntriesData>): UseDataConnectQueryResult<ListPremiumPhrasebookEntriesData, undefined>;
export function useListPremiumPhrasebookEntries(dc: DataConnect, options?: useDataConnectQueryOptions<ListPremiumPhrasebookEntriesData>): UseDataConnectQueryResult<ListPremiumPhrasebookEntriesData, undefined>;
