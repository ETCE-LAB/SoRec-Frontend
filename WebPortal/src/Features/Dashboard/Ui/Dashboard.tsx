import {useDisclosure} from "@mantine/hooks";
import {withAuthenticationRequired} from "react-oidc-context";
import React, {useEffect} from "react";
import {AppShell, Flex, Loader, Text} from "@mantine/core";
import {Outlet} from "react-router-dom";
import {Navigation} from "./Navigation/Navigation";
import {Header} from "./Header/Header";

const DashboardComponent = () => {

    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <Header></Header>
            <Navigation></Navigation>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export const ProtectedDashboard = withAuthenticationRequired(DashboardComponent, {
    OnRedirecting: () => <Flex align={"center"} justify={"center"} direction={"column"} h={"100vh"}>
        <Loader></Loader>
        <Text>Redirecting to the login page...</Text>
    </Flex>,
    signinRedirectArgs: { url_state: window.location.pathname }
},);