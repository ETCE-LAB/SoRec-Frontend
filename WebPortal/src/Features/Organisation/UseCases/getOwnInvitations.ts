import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function getOwnInvitations(){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const invitationsResponse = await apiClient.get(
        BackendUrl + "/invitations",
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    )

    return await invitationsResponse.json()
}