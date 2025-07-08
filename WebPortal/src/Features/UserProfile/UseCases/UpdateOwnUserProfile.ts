import {getUser} from "../../../Util/getUser";
import {UserProfile} from "../Models/UserProfile";
import {ApiClient} from "../../../Util/ApiClient";
import {BackendUrl} from "../../../Util/Urls";

export async function updateOwnUserProfile(id: string, name: string){

    const apiClient = new ApiClient()

    const user = getUser()
    const token = user?.access_token;

    const userProfile : UserProfile = {
        id: id,
        identityUserId: user!.profile.sub,
        email: user!.profile.email!,
        name: name
    }
    const url =

    await apiClient.put(
        BackendUrl + '/userprofiles/' + id,
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        userProfile
    )

    return
}