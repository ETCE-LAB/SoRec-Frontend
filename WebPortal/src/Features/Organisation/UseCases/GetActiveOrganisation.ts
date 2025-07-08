import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";
import {StorageKeys} from "../../../Util/StorageKeys";

export async function getActiveOrganisation(){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const acticeEventId = window.localStorage.getItem(StorageKeys.ActiveEventId)

    const organisationResponse = await apiClient.get(
        BackendUrl + '/organisations/' + acticeEventId,
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    )

    console.log(organisationResponse.ok)
    if(!organisationResponse.ok){

        throw Error(organisationResponse.statusText)
    }

    return await organisationResponse.json()
}