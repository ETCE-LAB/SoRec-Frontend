import {Badge, Button, Flex, Loader, TextInput, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {Organisation} from "../../Organisation/Models/Organisation";
import {getActiveOrganisation} from "../../Organisation/UseCases/GetActiveOrganisation";
import {useAppDispatch, useAppSelector} from "../../../Hooks";
import {
    getActiveOrganisationEventReducer,
    selectActiveOrganisationEvent
} from "../../Organisation/State/OrganisationSlice";
import {createOrganisation} from "../UseCases/CreateLocation";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../Router";

export const CreateLocation = () => {


    const [activeOrganisation, setActiveOrganisation] = useState<Organisation | null>(null)

    const refreshActiveOrganisationEvent = useAppSelector(selectActiveOrganisationEvent)

    const [name, setName] = useState("")

    const [address, setAddress] = useState("")

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setActiveOrganisation(null)

        getActiveOrganisation()
            .then(organisation => {setActiveOrganisation(organisation)})
            .catch(Error => {console.log(Error)})

    }, [refreshActiveOrganisationEvent]);

    function handleCreateLocation(){
        setLoading(true);
        createOrganisation(activeOrganisation!.id, name, address)
            .then(() => navigate(AppRoutes.organisations + "/" + activeOrganisation?.id))
            .catch(Error => console.log(Error))
            .finally(() => {
                setLoading(false);
                dispatch(getActiveOrganisationEventReducer())
            });
    }
    return <>
        <Flex direction={"row"} align={"center"} gap={"10px"} mb={"15px"}>
            <Title order={5}>Create new Location for </Title>
            <Badge color={"green"}>{activeOrganisation?.name}</Badge>
        </Flex>
        <TextInput
            label="Location Name"
            description="Please type in the Locations Name"
            value={name} onChange={e => setName(e.target.value)}></TextInput>

        <TextInput
            label="Location Address"
            description="Please type in the Locations Address"
            value={address} onChange={e => setAddress(e.target.value)}></TextInput>

        <Flex justify={"flex-end"} mt={"15px"}>
            <Button onClick={handleCreateLocation} disabled={loading}>Create Location</Button>
            {loading && <Loader />}
        </Flex>

    </>
}