import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "../../../Store";

interface UserProfileState {
    getOwnUserProfileEvent : number,

}
const initialState : UserProfileState = {
    getOwnUserProfileEvent: 0,
}

const userProfileSlice = createSlice({
    name: 'userProfileSlice',
    initialState,
    reducers: {
        getOwnUserProfileEventReducer(state) {
            state.getOwnUserProfileEvent += 1;
        }
    },
    extraReducers: (builder) => {

    }

})

export const selectGetOwnUserProfileEvent = (state: RootState) => state.userProfile.getOwnUserProfileEvent

export const { getOwnUserProfileEventReducer } = userProfileSlice.actions

export default userProfileSlice.reducer