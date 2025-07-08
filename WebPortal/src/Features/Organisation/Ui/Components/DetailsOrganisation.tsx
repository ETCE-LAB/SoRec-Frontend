import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../Hooks";
import {
    selectDetailsOrganisationEvent,
    selectOrganisationsStatus
} from "../../State/OrganisationSlice";
import {Button, Card, Divider, Flex, Loader, Text, Title} from "@mantine/core";
import {IconChevronLeft} from "@tabler/icons-react";
import {AppRoutes} from "../../../../Router";

import {getOrganisation} from "../../UseCases/GetOrganisation";
import {Organisation} from "../../Models/Organisation";
import {InviteMember} from "./InviteMember";

export const DetailOrganisation = () => {

    const location = useLocation()
    const naviagte = useNavigate()
    const dispatch = useAppDispatch()

    const organisationsStatus = useAppSelector(selectOrganisationsStatus)

    const detailsOrganisationChangeEvent = useAppSelector(selectDetailsOrganisationEvent)

    const [organisation, setOrganisation] = useState<Organisation | null>(null)

    useEffect(() => {
        const organisationId = location.pathname.slice(location.pathname.lastIndexOf("/") , location.pathname.length).slice(1)
        getOrganisation(organisationId).then(organisation => {
            setOrganisation(organisation)
            console.log(organisation)
        })
    }, [location, detailsOrganisationChangeEvent]);

    return<>
        <Flex direction={"column"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"} mb={"15px"}>
                <Flex direction={"row"} align={"center"} gap={"15px"}>
                    <Button variant={"subtle"} onClick={() => naviagte(AppRoutes.organisations + "/all")}><IconChevronLeft></IconChevronLeft></Button>
                    <Title order={4}>Manage Organisation</Title>
                    {organisationsStatus === "loading" && <Loader></Loader>}
                </Flex>
            </Flex>

            {organisationsStatus  === "idle" && organisation && <Card  shadow="sm" padding="sm" radius="md" mb={"15px"} withBorder>
                <Text>Name</Text>
                <Title order={4}>{organisation.name}</Title>
                <Divider mb={"15px"} mt={"15px"}></Divider>

                <Flex justify={"space-between"}>
                    <Flex direction={"column"}>

                        <Flex justify={"space-between"} align={"center"} direction={"row"} mb={"15px"}>
                            <Title order={4}>Locations</Title>
                        </Flex>
                        {organisation.locations.map(location => {
                            return <Card shadow="sm" padding="sm" radius="md" mb={"15px"} bd={"1px solid grey"}>
                                <Text>{location.name}</Text>
                                <Text>{location.address}</Text>
                                <Text>Number of Machines: {location.machineKeys?.length}</Text>
                            </Card>
                        })}

                    </Flex>

                    <Flex direction={"column"} w={"400px"}>
                        <Flex justify={"space-between"} align={"center"} direction={"row"} mb={"15px"}>
                            <Title order={4}>Member</Title>
                            <InviteMember></InviteMember>
                        </Flex>
                        {organisation.memberships.map(membership => {
                            return <Card shadow="sm" padding="xs" radius="md" mb={"15px"} bd={"1px solid grey"}>
                                <Flex justify={"flex-start"} direction={"row"} gap={"25px"}>
                                    <Flex direction={"column"}>
                                        <Text>Name</Text>
                                        <Title order={6}>{membership.userProfile.name}</Title>
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Text>Email</Text>
                                        <Title order={6}>{membership.userProfile.email}</Title>
                                    </Flex>
                                </Flex>
                            </Card>
                        })}
                        <Flex justify={"space-between"} align={"center"} direction={"row"} mb={"15px"}>
                            <Title order={4}>Open Invitations</Title>
                        </Flex>
                        {organisation.invitations.map(invitation => {
                            return <Card shadow="sm" padding="sm" radius="md" mb={"15px"} bd={"1px solid grey"}>
                                <Flex justify={"flex-start"} direction={"row"} gap={"25px"}>
                                    <Flex direction={"column"}>
                                        <Text>Name</Text>
                                        <Title order={6}>{invitation.userProfile.name}</Title>
                                    </Flex>
                                    <Flex direction={"column"}>
                                        <Text>Email</Text>
                                        <Title order={6}>{invitation.userProfile.email}</Title>
                                    </Flex>
                                </Flex>
                            </Card>
                        })}
                    </Flex>
                </Flex>
            </Card>}
        </Flex>
    </>
}