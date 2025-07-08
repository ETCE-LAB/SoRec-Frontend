import {UserProfile} from "../../UserProfile/Models/UserProfile";

export interface Membership{
    id: string,
    userProfileId: string,
    organisationId: string,
    userProfile: UserProfile
}