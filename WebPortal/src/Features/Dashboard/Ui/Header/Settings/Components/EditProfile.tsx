import {Button, Card, Flex, TextInput, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../../../../Hooks";
import {
    getOwnUserProfileEventReducer,
    selectGetOwnUserProfileEvent
} from "../../../../../UserProfile/State/UserProfileSlice";
import {UserProfile} from "../../../../../UserProfile/Models/UserProfile";
import {GetOwnUserProfile} from "../../../../../UserProfile/UseCases/GetOwnUserProfile";
import {updateOwnUserProfile} from "../../../../../UserProfile/UseCases/UpdateOwnUserProfile";

export const EditProfile = () => {

    const dispatch = useAppDispatch()

    const [name, setName] = useState("")

    const getOwnUserProfileEvent = useAppSelector(selectGetOwnUserProfileEvent)

    const [ownUserProfile, setOwnUserProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        setOwnUserProfile(null)
        GetOwnUserProfile().then(userProfile => setOwnUserProfile(userProfile))
    }, [getOwnUserProfileEvent]);

    useEffect(() => {
        if(ownUserProfile && ownUserProfile.name){
            setName(ownUserProfile.name)
        }
    }, [ownUserProfile]);

    async function handleUpdate(){
        if(ownUserProfile?.id){
            await updateOwnUserProfile(ownUserProfile.id, name)
            dispatch(getOwnUserProfileEventReducer())
        }
    }

    return <>
        <Title order={4} mb={"25px"}>Your Userprofile</Title>
        <Card shadow="sm" padding="lg" radius="md" withBorder>

            <Flex direction={"column"} gap={"20px"}>
                <TextInput
                    label="Email"
                    description="You cant change your email address"
                    value={ownUserProfile?.email} disabled></TextInput>

                <TextInput
                    id={"usernameInput"}
                    label="Username"
                    description="Please type in your new Username"
                    value={name} onChange={e => setName(e.target.value)}></TextInput>

                <Flex justify={"flex-end"}>
                    {ownUserProfile?.name === name || (name === "" && ownUserProfile?.name === null) ?
                        <Button disabled>Save</Button> :
                        <Button onClick={handleUpdate}>Save</Button>
                    }
                </Flex>
            </Flex>

        </Card>


    </>

}