import {getUser} from "../../../Util/getUser";
import {UserProfile} from "../Models/UserProfile";
import {ApiClient} from "../../../Util/ApiClient";
import {BackendUrl} from "../../../Util/Urls";

export async function GetOwnUserProfile() : Promise<UserProfile> {

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    console.log(token)

    var userProfileResponse = await apiClient.get(
        BackendUrl + '/identityUsers/' + user?.profile.sub + "/userprofile",
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    )

    if(userProfileResponse && userProfileResponse.status === 404 && (await userProfileResponse.text()) === "user not registered"){
        userProfileResponse = await apiClient.post(
               BackendUrl + "/userprofiles",
               {
                   'Content-Type': 'application/json',
                   Authorization: `Bearer ${token}`,
               },
               {
                   email: user?.profile.email,
                   identityUserId: user?.profile.sub
               })
    }
    
    return await userProfileResponse.json()
}