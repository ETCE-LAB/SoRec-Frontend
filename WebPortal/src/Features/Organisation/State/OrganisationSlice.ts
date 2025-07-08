import {RootState} from "../../../Store";
import {createSlice} from '@reduxjs/toolkit'

interface OrganisationState {
    getOwnOrganisationsEvent: number,
    getActiveOrganisationEvent: number,
    getDetailsOrganisationEvent: number,
    status: "idle" | "loading" | "failed"
}

const initialState : OrganisationState = {
    getOwnOrganisationsEvent : 0,
    getActiveOrganisationEvent: 0,
    getDetailsOrganisationEvent: 0,
    status: "idle"
}

const organisationSlice = createSlice({
    name: 'organisationSlice',
    initialState,
    reducers:
        {
            getOwnOrganisationsEventReducer(state)
            {
                state.getOwnOrganisationsEvent += 1;
            },
            getActiveOrganisationEventReducer(state)
            {
                state.getActiveOrganisationEvent += 1;
            },
            getDetailsOrganisationEventReducer(state)
            {
                state.getDetailsOrganisationEvent += 1;
            }
        }
})

export const {
    getOwnOrganisationsEventReducer,
    getActiveOrganisationEventReducer,
    getDetailsOrganisationEventReducer} = organisationSlice.actions

export const selectOwnOrganisationsEvent = (state: RootState) => state.organisation.getOwnOrganisationsEvent

export const selectActiveOrganisationEvent = (state: RootState) => state.organisation.getActiveOrganisationEvent

export const selectDetailsOrganisationEvent = (state: RootState) => state.organisation.getDetailsOrganisationEvent

export const selectOrganisationsStatus = (state: RootState) => state.organisation.status

export default organisationSlice.reducer