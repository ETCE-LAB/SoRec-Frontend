import {Button, Menu, rem} from "@mantine/core";
import {
    IconLogout2,
    IconUserCircle
} from '@tabler/icons-react';
import {useAuth} from "react-oidc-context";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../../../Router";

export const Settings = () => {

    const auth = useAuth()
    const navigate = useNavigate()

    return <>

        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant={"subtle"}>
                    {
                        //<IconChevronDown></IconChevronDown>
                    }
                    Menu
                    </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>

                <Menu.Item
                    leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => navigate(AppRoutes.editProfile)}
                >
                    Edit Profile
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => navigate(AppRoutes.invitations)}
                >
                    Invitations

                </Menu.Item>

                <Menu.Item
                    leftSection={<IconUserCircle style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => navigate(AppRoutes.organisations + "/all")}
                >
                    Organisations
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                    color="red"
                    leftSection={<IconLogout2 style={{ width: rem(14), height: rem(14) }} />}
                    onClick={() => {
                        void auth.signoutRedirect();
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>
}