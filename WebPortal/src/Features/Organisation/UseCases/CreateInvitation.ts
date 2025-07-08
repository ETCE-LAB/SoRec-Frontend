import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function createInvitation(userProfileId: string, organisationId: string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const invitationsResponse = await apiClient.post(
        BackendUrl + "/invitations",
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        {
            organisationId: organisationId,
            userProfileId: userProfileId
        }

    )

    return await invitationsResponse.json()
}