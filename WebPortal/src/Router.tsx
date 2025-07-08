import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";

import {ProtectedDashboard} from "./Features/Dashboard/Ui/Dashboard";

import {AuthenticationCallbackPage} from "./Features/Auth/Ui/AuthenticationCallbackPage";
import {AuthenticationSignoutCallbackPage} from "./Features/Auth/Ui/AuthenticationSignoutCallbackPage";
import {SignIn} from "./Features/Auth/Ui/SignIn";

import {OrganisationDashboard} from "./Features/Organisation/Ui/OrganisationDashboard";
import {EditProfile} from "./Features/Dashboard/Ui/Header/Settings/Components/EditProfile";
import {DetailOrganisation} from "./Features/Organisation/Ui/Components/DetailsOrganisation";
import {Organisations} from "./Features/Organisation/Ui/Components/Organisations";
import {Invitations} from "./Features/Dashboard/Ui/Header/Settings/Components/Invitations";
import {CreateLocation} from "./Features/Location/Ui/CreateLocation";
import {CreateMachine} from "./Features/Machine/Ui/CreateMachine";
import {MachineView} from "./Features/Machine/Ui/MachineView";


export class AuthRoutes {
    static callback = "auth/callback";
    static signout_callback = "auth/signout-callback"
    static signin = "auth/signin"
}

export class AppRoutes {
    static base = "/";
    static organisations = "/organisations";
    static machine = "/machine";
    static editProfile = "/editprofile"
    static invitations = "/invitations"
    static createLocation = "/locations/create"
    static createMachine = "/machines/create"
}

export const Router = () => {
    return <BrowserRouter>
        <Routes>
            <Route path={AppRoutes.base} element={<ProtectedDashboard />}>

                <Route path={AppRoutes.organisations} element={<OrganisationDashboard />}>
                    <Route path={AppRoutes.organisations + "/:id"} element={<DetailOrganisation />}></Route>
                    <Route path={AppRoutes.organisations + "/all"} element={<Organisations />}></Route>
                </Route>
                <Route path={AppRoutes.editProfile} element={<EditProfile />}></Route>
                <Route path={AppRoutes.invitations} element={<Invitations />}></Route>
                <Route path={AppRoutes.createLocation} element={<CreateLocation />}></Route>

                <Route path={AppRoutes.machine + "/:id"} element={<MachineView />}></Route>
                <Route path={AppRoutes.createMachine} element={<CreateMachine />}></Route>
                
            </Route>
            <Route path={AuthRoutes.callback} element={<AuthenticationCallbackPage/>}></Route>
            <Route path={AuthRoutes.signout_callback} element={<AuthenticationSignoutCallbackPage/>}></Route>
            <Route path={AuthRoutes.signin} element={<SignIn />}></Route>"
        </Routes>
    </BrowserRouter>
}


