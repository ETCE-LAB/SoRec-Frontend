import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function createOrganisation (organisationId: string, name: string, address: string) {

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const newOrgansitionResponse = await apiClient.post(
        BackendUrl + "/locations",
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        {
            name: name,
            address: address,
            organisationId: organisationId
        }
    )

    return await newOrgansitionResponse.json()
}