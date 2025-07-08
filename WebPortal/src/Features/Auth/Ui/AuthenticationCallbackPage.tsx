import {useAuth} from "react-oidc-context";
import {Navigate} from "react-router-dom";
import {AppRoutes} from "../../../Router";
import React from "react";
import {Flex, Loader, Text} from "@mantine/core";

export const AuthenticationCallbackPage = () => {

    const auth = useAuth();
    console.log(auth.user?.url_state)
    return <Flex h={"100vh"} align={"center"} justify={"center"} direction={"column"}>
        <Loader></Loader>
        <Text>You are being signed in</Text>
        {!auth.isLoading &&<Navigate to={auth.user?.url_state ? auth.user?.url_state : AppRoutes.base}></Navigate>}
    </Flex>
}