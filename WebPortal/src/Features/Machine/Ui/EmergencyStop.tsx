import React from 'react';
import { Button, Modal, Text, Flex } from '@mantine/core';
import { ApiClient } from "../../../Util/ApiClient";
import { getUser } from "../../../Util/getUser";
import { BackendUrl } from "../../../Util/Urls";

interface EmergencyStopProps {
    modalOpened: boolean;
    setModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
    machineId: string;
    
}

export const EmergencyStop: React.FC<EmergencyStopProps> = ({ modalOpened, setModalOpened, machineId }) => {
    const handleStopMachine = async () => {
        try {
            const apiClient = new ApiClient();
            const user = getUser();
            const token = user?.access_token;

            const response = await apiClient.post(
                `${BackendUrl}/machines/stop/${machineId}`,
                {},
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            console.log("Machine stopped successfully");
        } catch (error) {
            console.error("Error stopping the machine:", error);
        } finally {
            setModalOpened(false);
        }
    };

    return (
        <>
            <Button
                color="red"
                size="md"
                style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
                onClick={() => setModalOpened(true)}
            >
                Emergency Stop
            </Button>

            {/* Confirmation Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Not-Halt bestätigen"
            >
                <Text>Sind Sie sicher, dass Sie die Maschine anhalten möchten?</Text>
                <Flex justify="space-between" mt="md">
                    <Button color="red" onClick={handleStopMachine}>
                        Maschine anhalten
                    </Button>
                    <Button onClick={() => setModalOpened(false)}>
                        Abbrechen
                    </Button>
                </Flex>
            </Modal>
        </>
    );
}
