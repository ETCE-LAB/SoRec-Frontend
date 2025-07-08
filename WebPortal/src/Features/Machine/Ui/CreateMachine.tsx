import {Badge, Button, Flex, Loader, NativeSelect, TextInput, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {Organisation} from "../../Organisation/Models/Organisation";
import {getActiveOrganisation} from "../../Organisation/UseCases/GetActiveOrganisation";
import {useAppDispatch, useAppSelector} from "../../../Hooks";
import {
    getActiveOrganisationEventReducer,
    selectActiveOrganisationEvent
} from "../../Organisation/State/OrganisationSlice";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../Router";
import {Location} from "../../Location/Models/Location";
import {createMachine} from "../UseCases/CreateMachine";


export const CreateMachine = () => {


    const [activeOrganisation, setActiveOrganisation] = useState<Organisation | null>(null)

    const refreshActiveOrganisationEvent = useAppSelector(selectActiveOrganisationEvent)

    const [name, setName] = useState("")

    const [modelNumber, setModelNumber] = useState("")

    const [url, setUrl] = useState("")

    const [selectedLocation, setSelectedLocation] = useState<undefined | Location>(undefined);

    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    useEffect(() => {

        setActiveOrganisation(null)

        getActiveOrganisation()
            .then(organisation => {setActiveOrganisation(organisation)})
            .catch(Error => {console.log(Error)})

    }, [refreshActiveOrganisationEvent]);

    function handleCreateMachine(){
        setLoading(true); 
        createMachine(name, modelNumber, url, selectedLocation!.id)
            .then(() => {
                navigate(AppRoutes.organisations + "/" + activeOrganisation?.id)
                dispatch(getActiveOrganisationEventReducer())
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }

    function handleLocationChange(locationId: string) {
        if(locationId !== ""){
            const selectedLocationId = locationId;
            const foundLocation = activeOrganisation?.locations.find(location => location.id === selectedLocationId);
            setSelectedLocation(foundLocation);
        }
        if(locationId === ""){
            setSelectedLocation(undefined)
        }

    }

    return <>
        <Flex direction={"row"} align={"center"} gap={"10px"} mb={"15px"}>
            <Title order={5}>Create new Machine at</Title>
            {activeOrganisation && <NativeSelect
                onChange={e => handleLocationChange(e.currentTarget.value)}
            >
                <option>Select Location</option>
                <hr />
                <optgroup label={activeOrganisation.locations.length > 0 ? "Available Locations" : "No Available Locations"}>
                    {activeOrganisation.locations.map(location => {
                        return <option value={location.id} >{location.name}</option>
                    })}
                </optgroup>

            </NativeSelect>}

            <Title order={5}>for </Title>
            <Badge color={"green"}>{activeOrganisation?.name}</Badge>
        </Flex>
        <TextInput
            label="Machine Name"
            description="Please type in the Machines Name"
            value={name} onChange={e => setName(e.target.value)}></TextInput>

        <TextInput
            label="Machine Modelnumber"
            description="Please type in the Machines Modelnumber"
            value={modelNumber} onChange={e => setModelNumber(e.target.value)}></TextInput>

        <TextInput
            label="Machine Url"
            description="Please type in the Machines Url"
            value={url} onChange={e => setUrl(e.target.value)}></TextInput>

        <Flex justify={"flex-end"} mt={"15px"}>
            {
                selectedLocation !== undefined &&
                name !== "" &&
                modelNumber !== "" &&
                url !== "" &&
                <Button onClick={handleCreateMachine} disabled={loading}>Create Machine</Button>}

        </Flex>
        {loading && <Loader size="lg" />}
    </>
}