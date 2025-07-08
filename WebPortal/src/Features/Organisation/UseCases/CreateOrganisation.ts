import {Organisation} from "../Models/Organisation";
import {ApiClient} from "../../../Util/ApiClient";
import {getUser} from "../../../Util/getUser";
import {BackendUrl} from "../../../Util/Urls";

export async function createOrganisation (name: string, userProfileId: string) {

    const apiClient = new ApiClient()

    const user = getUser();

    const token = user?.access_token;

    const newOrgansitionResponse = await apiClient.post(
        BackendUrl + "/Userprofiles/" + userProfileId + "/organisations",
        {
            'Content-Type': 'application/json',
        },
        {name: name}
    )

    return await newOrgansitionResponse.json()
}