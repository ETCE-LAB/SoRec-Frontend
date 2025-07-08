import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function acceptInvitation( invitationId: string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const invitationsResponse = await apiClient.post(
        BackendUrl + "/Invitations/" + invitationId + "/Memberships",
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        {
        }

    )

    if(!invitationsResponse.ok){
        throw Error(invitationsResponse.statusText)
    }

    return await invitationsResponse.json()
}