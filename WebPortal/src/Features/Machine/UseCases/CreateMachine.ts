import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function createMachine(name: string, modelNumber: string, url: string, locationId: string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const invitationsResponse = await apiClient.post(
        BackendUrl + "/machines",
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        {
           name: name,
            modelNumber: modelNumber,
            url: url,
            locationId: locationId
        }
    )

    return await invitationsResponse.json()
}