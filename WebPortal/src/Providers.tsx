import {AuthProvider} from "react-oidc-context";
import {Router} from "./Router";

import {createTheme, MantineProvider} from "@mantine/core";
import '@mantine/nprogress/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';

import {Provider} from "react-redux";
import {store} from "./Store";
import {WebStorageStateStore} from "oidc-client-ts";


export const oidcConfig = {
    authority: "https://development-isse-identityserver.azurewebsites.net",
    client_id: "interactive",
    redirect_uri: window.location.origin + "/auth/callback",
    post_logout_redirect_uri: window.location.origin + "/auth/signout-callback",
    scopes: "profile openId offline_access",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true
    // ...
};

const theme = createTheme({
    /** Put your mantine theme override here */
});


export const Providers = () => {

    return (
    <AuthProvider {...oidcConfig}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <Provider store={store}>
                <Router />
            </Provider>
        </MantineProvider>
    </AuthProvider>
    )
}