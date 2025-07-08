import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function getMachine(id: string){

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const machineResponse = await apiClient.get(
        BackendUrl + "/machines/" + id,
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    )

    if(!machineResponse.ok){
        throw Error(machineResponse.statusText)
    }

    return await machineResponse.json()
}