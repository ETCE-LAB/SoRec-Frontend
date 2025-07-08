import {createSlice} from '@reduxjs/toolkit'
import {UserProfile} from "../Models/UserProfile";
import {RootState} from "../../../Store";

interface UserProfilesState {

    status: "idle" | "loading" | "failed"
}

const initialState : UserProfilesState = {

    status: "idle"
}

const userProfilesSlice = createSlice({
    name: 'userProfilesSlice',
    initialState,
    reducers: {

    },

})

export const selectProfilesStatus = (state: RootState) => state.userProfiles.status


export default userProfilesSlice.reducer