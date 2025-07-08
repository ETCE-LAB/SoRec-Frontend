import {useAppDispatch, useAppSelector} from "../../../../Hooks";
import {
    getActiveOrganisationEventReducer,
    getDetailsOrganisationEventReducer,
    selectActiveOrganisationEvent,
    selectOwnOrganisationsEvent
} from "../../State/OrganisationSlice";
import {Badge, Button, Card, Flex, Loader, Text, Title} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../../Router";
import {CreateOrganisation} from "./CreateOrganisation";
import {useEffect, useState} from "react";
import {Organisation} from "../../Models/Organisation";
import {getOwnOrganisations} from "../../UseCases/GetOwnOrganisations";
import {getActiveOrganisation} from "../../UseCases/GetActiveOrganisation";
import {StorageKeys} from "../../../../Util/StorageKeys";


export const Organisations = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(true)

    const [organisations, setOrganisations] = useState<null | Organisation[]>(null)
    const [activeOrganisation, setActiveOrganisation] = useState<null | Organisation>(null)

    const refreshOwnOrganisationsEvent = useAppSelector(selectOwnOrganisationsEvent)
    const refreshActiveOrganisationEvent = useAppSelector(selectActiveOrganisationEvent)


    useEffect(() => {
        setOrganisations(null)
        setLoading(true)
        getOwnOrganisations()
            .then(organisations => setOrganisations(organisations))
            .catch(Error => console.log(Error))
            .finally(() => setLoading(false)
        )

    }, [refreshOwnOrganisationsEvent]);

    useEffect(() => {
        setActiveOrganisation(null)
        getActiveOrganisation().then(organisation => setActiveOrganisation(organisation)).catch(Error => console.log(Error))
    }, [refreshActiveOrganisationEvent]);

    function handleActiveOrganisationChange(id: string){
        window.localStorage.setItem(StorageKeys.ActiveEventId, id)
        dispatch(getActiveOrganisationEventReducer())
    }

    function handleDetailsOrganisationChange(id: string){
        window.localStorage.setItem(StorageKeys.DetailEventId, id)
        dispatch(getDetailsOrganisationEventReducer())
        navigate(AppRoutes.organisations + "/" + id)
    }

    return <>
        <Flex direction={"column"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"} mb={"15px"}>
                <Flex direction={"row"} align={"center"} gap={"15px"}>
                    <Title order={4}>Manage Organisations</Title>
                    {loading && <Loader></Loader>}
                </Flex>

                <CreateOrganisation />
            </Flex>

            {organisations?.map(organisation => {
                return <Card shadow="sm" padding="sm" radius="md" mb={"15px"} withBorder>
                    <Flex direction={"row"} align={"center"} justify={"space-between"}>
                        <Flex direction={"row"} justify={"space-between"} w={"60%"}>

                            <Flex direction={"column"}>
                                <Text>Name</Text>
                                <Title order={6}>{organisation.name}</Title>
                            </Flex>

                            <Flex direction={"column"}>
                                <Text>Member</Text>
                                <Title order={6}>{organisation.memberships.length}</Title>
                            </Flex>

                            <Flex direction={"column"}>
                                <Text>Locations</Text>
                                <Title order={6}>{organisation.locations.length}</Title>
                            </Flex>

                        </Flex>
                        <Flex align={"center"}>
                            {activeOrganisation?.id === organisation.id ? <Badge color={"green"} mr={"20px"}>Active</Badge> : <Button onClick={() => {handleActiveOrganisationChange(organisation.id)}} variant={"subtle"}>Switch active</Button>}
                            <Button variant={"outline"} onClick={() => handleDetailsOrganisationChange(organisation.id)}>Details</Button>
                        </Flex>

                    </Flex>
                </Card>
            })}
        </Flex>


    </>
}