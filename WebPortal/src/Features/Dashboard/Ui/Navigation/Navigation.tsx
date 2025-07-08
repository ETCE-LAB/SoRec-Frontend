import {
    AppShell,
    Button,
    Text,
    Flex,
    Skeleton,
    Title,
    Divider,
    UnstyledButton,
    Badge,
    NativeSelect
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../../Router";
import {useAppDispatch, useAppSelector} from "../../../../Hooks";
import {
    selectActiveOrganisationEvent
} from "../../../Organisation/State/OrganisationSlice";
import {Organisation} from "../../../Organisation/Models/Organisation";
import {getActiveOrganisation} from "../../../Organisation/UseCases/GetActiveOrganisation";
import {Box} from "@react-three/drei";
import {Location} from "../../../Location/Models/Location";


export const Navigation = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const refreshActiveOrganisationEvent = useAppSelector(selectActiveOrganisationEvent);
    const [selectedLocation, setSelectedLocation] = useState<undefined | Location>(undefined);
    const [activeOrganisation, setActiveOrganisation] = useState<Organisation | null>(null);

    useEffect(() => {
        console.log(location.pathname);
    }, [location]);

    useEffect(() => {
        handleLocationChange("");
        setActiveOrganisation(null);
        getActiveOrganisation().then(organisation => {
            setActiveOrganisation(organisation);
            console.log(organisation);
        }).catch(error => {
            console.log(error);
        });
    }, [refreshActiveOrganisationEvent]);

    // Add useEffect to set location based on machineId
    useEffect(() => {
        if (location.pathname.startsWith('/machine') && id) {
            // Check if URL starts with "/machine" and an ID is existing
            const foundLocation = activeOrganisation?.locations.find(location => location.machineKeys?.some(machineKey => machineKey.id === id));
            if (foundLocation) {
                setSelectedLocation(foundLocation);
            }
        }
    }, [location.pathname, activeOrganisation, id]);

    function handleDetailsOrganisationChange() {
        navigate(AppRoutes.organisations + "/all");
    }

    interface TransformedData {
        label: string;
        value: string;
        disabled?: boolean;
    }

    function transformLocationsToData(locations: Location[]): TransformedData[] {
        return locations.map(location => ({
            label: location.name,
            value: location.id
        }));
    }

    function handleLocationChange(locationId: string) {
        if (locationId !== "") {
            const selectedLocationId = locationId;
            const foundLocation = activeOrganisation?.locations.find(location => location.id === selectedLocationId);
            setSelectedLocation(foundLocation);
        }
        if (locationId === "") {
            setSelectedLocation(undefined);
        }
    }

    return (
        <AppShell.Navbar p="md" style={{ maxHeight: "100vh", overflowY: "auto" }}>
            <Box onClick={() => handleDetailsOrganisationChange()}>
                <UnstyledButton mb={"15px"}>
                    <Flex direction={"column"}>
                        <Title mb={"5px"} order={4}>Active Organisation</Title>
                        {activeOrganisation && <Badge color={"green"}>{activeOrganisation?.name}</Badge>}
                        {!activeOrganisation && <Badge>Select Organisation</Badge>}
                    </Flex>
                </UnstyledButton>
            </Box>

            <Divider></Divider>
            {activeOrganisation && <Flex direction={"column"} mb={"15px"}>
                <Flex direction={"row"} justify={"space-between"} align={"center"} mt={"15px"}>
                    <Title order={5}>Locations</Title>
                    <Button variant={"outline"}
                            onClick={() => navigate(AppRoutes.createLocation)}
                    >New</Button>
                </Flex>
                <Flex mt={"10px"}>
                    <NativeSelect
                        w={"100%"}
                        value={selectedLocation?.id || ""}
                        onChange={e => handleLocationChange(e.currentTarget.value)}
                    >
                        <option>Select Location</option>
                        <optgroup label={activeOrganisation.locations.length > 0 ? "Available Locations" : "No Available Locations"}>
                            {activeOrganisation.locations.map(location => {
                                return <option key={location.id} value={location.id}>{location.name}</option>;
                            })}
                        </optgroup>
                    </NativeSelect>
                </Flex>
            </Flex>}
            {!activeOrganisation && <Text>Please select active Organisation</Text>}
            <Divider></Divider>

            <Flex mt={"15px"} direction={"column"} gap={"15px"}>
                <Flex justify="space-between" align="center">
                    <Flex direction="column" align="flex-start">
                        <Title order={5}>Machines for</Title>
                        {selectedLocation && <Title order={5}>{selectedLocation.name}</Title>}
                    </Flex>
                    <Button variant="outline" onClick={() => navigate(AppRoutes.createMachine)}>New</Button>
                </Flex>

                {selectedLocation && <Flex direction={"column"}>
                    {selectedLocation.machineKeys?.map(machineKey => {
                        return (
                            <React.Fragment key={machineKey.id}>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(AppRoutes.machine + "/" + machineKey.id)}
                                    mt="10px"
                                    p="10px"
                                    style={{ minHeight: "60px" }}
                                >
                                    <Flex direction="column" py="8px"> 
                                        <Title order={6}>Machine Name: {machineKey.name}</Title>
                                        <Text>Modelnumber: {machineKey.modelNumber}</Text>
                                    </Flex>
                                </Button>

                                <Divider></Divider>
                            </React.Fragment>
                        );
                    })}
                </Flex>}

                {!selectedLocation && <Text>Please select Location</Text>}
            </Flex>
        </AppShell.Navbar>
    );
}
