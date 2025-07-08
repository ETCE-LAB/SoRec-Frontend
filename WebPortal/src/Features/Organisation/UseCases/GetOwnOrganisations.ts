import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function getOwnOrganisations(){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const organisationsResponse = await apiClient.get(
        BackendUrl + "/organisations",
        {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    )

    if(!organisationsResponse.ok){
        throw Error(await organisationsResponse.text())
    }

    return await organisationsResponse.json()

}