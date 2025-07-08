import {Badge, Button, Divider, Flex, Loader, Modal, Text, TextInput} from "@mantine/core";
import {useDebouncedValue, useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../Hooks";
import {UserProfile} from "../../../UserProfile/Models/UserProfile";
import {Organisation} from "../../Models/Organisation";
import {getUserProfiles} from "../../../UserProfile/UseCases/GetUserProfiles";
import {getDetailsOrganisationEventReducer, selectDetailsOrganisationEvent} from "../../State/OrganisationSlice";
import {StorageKeys} from "../../../../Util/StorageKeys";
import {getOrganisation} from "../../UseCases/GetOrganisation";
import {createInvitation} from "../../UseCases/CreateInvitation";

export const InviteMember = () => {

    const dispatch = useAppDispatch()

    const [opened, { open, close }] = useDisclosure(false);
    const [searchString, setSearchString] = useState('');
    const [debounced] = useDebouncedValue(searchString, 200);

    const detailsOrganisationChangeEvent = useAppSelector(selectDetailsOrganisationEvent)

    const [detailsOrganisation, setDetailsOrganisation] = useState<Organisation |null>(null)

    const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(null)

    useEffect(() => {
        console.log("get user profiles effect")
        if(searchString.length > 0){
            setUserProfiles(null)
          getUserProfiles(searchString).then(userProfiles => setUserProfiles(userProfiles))
        }
        else setUserProfiles([])
    }, [debounced]);

    useEffect(() => {
        const detailsOrganisationId = window.localStorage.getItem(StorageKeys.DetailEventId)
        getOrganisation(detailsOrganisationId!).then(organisation => setDetailsOrganisation(organisation))
    }, [detailsOrganisationChangeEvent]);

    async function handleCreateInvite(userProfileId: string){
        await createInvitation(userProfileId, detailsOrganisation!.id)
        dispatch(getDetailsOrganisationEventReducer())
        close()
    }

    return <>
        <Modal opened={opened} onClose={() => {setSearchString(""); close();}} title="Invite member">
            <TextInput
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                placeholder="Search..."
                rightSection={userProfiles === null && <Loader size={20} />}
            />
            <Divider mb={"15px"} mt={"15px"}></Divider>
            <Text mb={"15px"}>Available User: {userProfiles === null && <Loader></Loader>}</Text>
            {userProfiles?.map(userProfile => {
                return <>
                    <Flex direction={"row"} align={"center"} gap={"15px"}>
                        {userIsInOrganisation(detailsOrganisation!, userProfile) && <Badge color={"green"}>member</Badge>}
                        {userIsInvited(detailsOrganisation!, userProfile) && <Badge>Invited</Badge>}
                        {!userIsInOrganisation(detailsOrganisation!, userProfile) && !userIsInvited(detailsOrganisation!, userProfile) &&
                            <Button variant={"subtle"} onClick={async () => {
                                handleCreateInvite(userProfile.id)
                            }}>Invite</Button>}
                        <Flex direction={"column"}>
                            <Text>{userProfile.name?.slice(0, 30)}</Text>
                            <Text>{userProfile.email.slice(0, 30)}</Text>
                        </Flex>
                    </Flex>
                    <Divider></Divider>
                </>
            })}
        </Modal>

        <Button variant={"subtle"} onClick={open}>Invite Member</Button></>
}

export function userIsInOrganisation(organisation: Organisation, user: UserProfile) : boolean{
    for(const membership of organisation.memberships){
        if(membership.userProfileId === user.id){
            return true
        }
    }
    return false
}

export function userIsInvited(organisation: Organisation, user: UserProfile) : boolean {
    for(const invitations of organisation.invitations){
        if(invitations.userProfileId === user.id){
            return true
        }
    }
    return false
}