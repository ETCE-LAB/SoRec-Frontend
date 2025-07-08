import {Button, Flex, Loader, Modal, TextInput, Text} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../Hooks";
import {selectGetOwnUserProfileEvent} from "../../../UserProfile/State/UserProfileSlice";
import {UserProfile} from "../../../UserProfile/Models/UserProfile";
import {GetOwnUserProfile} from "../../../UserProfile/UseCases/GetOwnUserProfile";
import {createOrganisation} from "../../UseCases/CreateOrganisation";
import {getOwnOrganisationsEventReducer} from "../../State/OrganisationSlice";

export const CreateOrganisation = () => {

    const dispatch = useAppDispatch()

    const getOwnUserProfileEvent = useAppSelector(selectGetOwnUserProfileEvent)

    const[opened, {open, close}] = useDisclosure(false)

    const[name, setName] = useState<string>("")

    const [ownUserProfile, setOwnUserProfile] = useState<UserProfile | null>(null)

    const [loading, setLoading] = useState<boolean>(false); 

    useEffect(() => {
        setOwnUserProfile(null)
        GetOwnUserProfile().then(userProfile => setOwnUserProfile(userProfile))
    }, [getOwnUserProfileEvent]);

    async function handleCreateOrganisation() {
        setLoading(true);
        await createOrganisation(name, ownUserProfile!.id);
        dispatch(getOwnOrganisationsEventReducer());
        setLoading(false); 
        close()
    }

    return <>
        <Modal opened={opened} onClose={close} title="Create Organisation" centered>
            {ownUserProfile === null && <Loader></Loader>}
            {ownUserProfile && <Flex direction={"column"} gap={"15px"}>
                <Text>{ownUserProfile.email} will be admin</Text>
                <TextInput
                    label={"Organisation name"}
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                />
                <Flex direction={"row"} justify={"flex-end"}>
                <Button onClick={handleCreateOrganisation} disabled={loading}>
                        {loading ? <Loader size="sm" /> : "Create Organisation"}
                    </Button>
                </Flex>
            </Flex>}

        </Modal>
        <Button variant={"light"} onClick={open}>New Organisation</Button>
    </>
}