import {UserProfile} from "../../UserProfile/Models/UserProfile";
import {OrganisationKey} from "./Organisation";

export interface Invitation{
    id: string,
    userProfileId: string,
    organisationId: string,
    userProfile: UserProfile,
    organisationKey : OrganisationKey
}