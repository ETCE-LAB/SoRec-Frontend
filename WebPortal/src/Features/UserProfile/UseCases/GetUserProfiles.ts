import {getUser} from "../../../Util/getUser";
import {ApiClient} from "../../../Util/ApiClient";
import {BackendUrl} from "../../../Util/Urls";

export async function getUserProfiles(searchterm : string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const userProfileResponse = await apiClient.get(
        BackendUrl + '/userprofiles?searchterm=' + searchterm,
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    )

    return  userProfileResponse.json()
}