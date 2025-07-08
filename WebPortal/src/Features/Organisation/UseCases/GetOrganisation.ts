import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function getOrganisation(id: string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const organisationResponse = await apiClient.get(
        BackendUrl + "/organisations/" + id,
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    )

    if(!organisationResponse.ok){
        throw Error(organisationResponse.statusText)
    }

    return await organisationResponse.json()
}