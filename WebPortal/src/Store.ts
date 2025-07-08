import { configureStore } from '@reduxjs/toolkit'
import userProfileSlice from "./Features/UserProfile/State/UserProfileSlice";
import organisationSlice from "./Features/Organisation/State/OrganisationSlice";
import userProfilesSlice from "./Features/UserProfile/State/UserProfilesSlice";

export const store = configureStore({
    reducer: {
        userProfile: userProfileSlice,
        userProfiles: userProfilesSlice,
        organisation: organisationSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;