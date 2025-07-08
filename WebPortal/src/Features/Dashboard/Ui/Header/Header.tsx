import {AppShell, Button, Flex, Group, Loader, Text, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {useAppSelector} from "../../../../Hooks";
import {selectGetOwnUserProfileEvent} from "../../../UserProfile/State/UserProfileSlice";
import {Settings} from "./Settings/Settings";
import {UserProfile} from "../../../UserProfile/Models/UserProfile";
import {GetOwnUserProfile} from "../../../UserProfile/UseCases/GetOwnUserProfile";

export const Header = () => {

    const auth = useAuth()
    const getOwnUserProfileEvent = useAppSelector(selectGetOwnUserProfileEvent)

    const [ownUserProfile, setOwnUserProfile] = useState<UserProfile | null>(null)
    const [loadingUser, setLoadingUser] = useState(false)

    useEffect(() => {
        setOwnUserProfile(null)
        setLoadingUser(true)
        GetOwnUserProfile()
            .then(userProfile => setOwnUserProfile(userProfile))
            .catch(Error => console.log(Error))
            .finally(() => setLoadingUser(false))
    }, [getOwnUserProfileEvent]);

    return <AppShell.Header p="md">
        <Flex h={"100%"} justify={"space-between"} align={"center"} direction={"row"}>
            {ownUserProfile && <Title order={4}>Hello, {ownUserProfile.email}</Title>}
            {loadingUser && <Loader></Loader>}
            <Flex align={"center"}>
                <Settings></Settings>
            </Flex>
        </Flex>
    </AppShell.Header>
}