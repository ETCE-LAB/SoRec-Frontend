import {Button, Card, Flex, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {Invitation} from "../../../../../Organisation/Models/Invitation";
import {getOwnInvitations} from "../../../../../Organisation/UseCases/getOwnInvitations";
import {acceptInvitation} from "../../../../../Organisation/UseCases/AcceptInvitation";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../../../../Router";

export const Invitations = () => {

    const [invitations, setInvitations] = useState<Invitation[] | null>(null)

    const navigate = useNavigate();

    useEffect(() => {
        getOwnInvitations().then(invitations => setInvitations(invitations))
    }, []);

    function handleAccept(invitation: Invitation){
        acceptInvitation(invitation.id)
            .then(() => navigate(AppRoutes.organisations + "/" + invitation.organisationId))
            .catch(Error => console.log(Error))
            .finally(() => {})
    }

    return <>
        <Title order={4} mb={"25px"}>Your Invitations</Title>
        {invitations?.map(invitation => {
            return <Card shadow="sm" padding="xs" radius="md" mb={"15px"} bd={"1px solid grey"}>
                <Flex justify={"flex-start"} direction={"row"} gap={"25px"}>
                    <Flex direction={"column"}>
                        <Text>Name</Text>
                        <Title order={6}>{invitation.userProfile.name}</Title>
                    </Flex>
                    <Flex direction={"column"}>
                        <Text>Email</Text>
                        <Title order={6}>{invitation.userProfile.email}</Title>
                    </Flex>
                    <Flex direction={"column"}>
                        <Text>Organisation</Text>
                        <Title order={6}>{invitation.organisationKey.name}</Title>
                    </Flex>

                    <Button onClick={() => handleAccept(invitation)}>Accept</Button>
                </Flex>
            </Card>
        })}
    </>
}