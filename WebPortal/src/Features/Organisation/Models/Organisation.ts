import {Membership} from "./Membership";
import {Invitation} from "./Invitation";
import {Location} from "../../Location/Models/Location"

export interface Organisation {
    id: string,
    name : string,
    memberships: Membership[],
    invitations: Invitation[],
    locations: Location[]
}

export interface OrganisationKey{
    id: string,
    name: string
}