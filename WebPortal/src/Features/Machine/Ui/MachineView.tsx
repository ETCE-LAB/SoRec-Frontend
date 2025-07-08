import React, {useEffect, useRef, useState} from 'react';
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Box, Cylinder, Edges, Html, OrbitControls} from '@react-three/drei';
import {Box as MantineBox, Checkbox, Flex, Title, Text, Select, Button, Modal, Table} from "@mantine/core"
import * as THREE from 'three';
import {useLocation} from "react-router-dom";
import {getMachine} from "../UseCases/GetMachine";
import {Machine} from "../Models/Machine";
import * as signalR from "@microsoft/signalr";
import { MeasurementChart } from "./MeasurementChart"; 
import { Stream } from './Stream'; 
import { EmergencyStop } from './EmergencyStop'; // Importiere die EmergencyStop-Komponente
import { EditParameters } from './EditParameters';

export const MachineView = () => {
    
    interface DataState {
        SpeedOfBelt: { measurementTime: Date; value: number }[];
        SpeedOfDrum: { measurementTime: Date; value: number }[];
        ThroughPut: { measurementTime: Date; value: number }[];
        SpeedOfVibration: { measurementTime: Date; value: number }[];
        SortingQuality: { measurementTime: Date; value: number }[];
    }

    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [machine, setMachine] = useState<Machine | null>(null)
    const location = useLocation()

    const [selectedCamera, setSelectedCamera] = useState<string>('camera1');
    const [cameraOptions] = useState([
        { value: 'camera1', label: 'Camera 1' },
        { value: 'camera2', label: 'Camera 2' },
    ]);

    const [data, setData] = useState<DataState>({
        SpeedOfBelt: [],
        SpeedOfDrum: [],
        ThroughPut: [],
        SpeedOfVibration: [],
        SortingQuality: [],
    });

    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {

        const machineId = location.pathname.slice(location.pathname.lastIndexOf("/") , location.pathname.length).slice(1);

        setData({
            SpeedOfBelt: [],
            SpeedOfDrum: [],
            ThroughPut: [],
            SpeedOfVibration: [],
            SortingQuality: [],
        });

        getMachine(machineId)
            .then(machine => setMachine(machine))
            .catch(error => console.log(error));
    }, [location]);

    useEffect(() => {
        if (!machine) return;

        const connection = new signalR.HubConnectionBuilder()
            //.withUrl("https://localhost:44385/locationhub")
            .withUrl("https://dev-sorec-management-backend-aacgbja0evada2cm.northeurope-01.azurewebsites.net/locationhub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                if (machine.locationId) {
                    console.log("try to subscribe to location", machine.locationId);
                    connection.invoke("SubscribeToLocation", machine.locationId);
                }
            })
            .catch(err => console.error(err));

        connection.on("ReceiveMachineUpdate", (machineData) => {
            const parsedData = JSON.parse(machineData);
            console.log("Received Machine Data:", parsedData);
            if (parsedData.MachineId === machine.id) {
                setData({
                    SpeedOfBelt: [{ measurementTime: new Date(), value: parsedData.SpeedOfBelt }],
                    SpeedOfDrum: [{ measurementTime: new Date(), value: parsedData.SpeedOfDrum }],
                    ThroughPut: [{ measurementTime: new Date(), value: parsedData.ThroughPut }],
                    SpeedOfVibration: [{ measurementTime: new Date(), value: parsedData.SpeedOfVibration }],
                    SortingQuality: [{ measurementTime: new Date(), value: parsedData.SortingQuality }],
                });
            }
        });

        return () => {
            connection.stop();
        };
    }, [machine]);


    return (

        <Flex direction={"column"}>
            {/* EmergencyStop-Komponente */}
            <EmergencyStop 
                modalOpened={modalOpened} 
                setModalOpened={setModalOpened} 
                machineId={machine?.id || ""}      
                />

        <Flex direction={"column"}>
            <Title order={1}>Machine Data</Title>
    
            {/* Main Content Section */}
            <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                <Flex direction={"column"}>
                    <Text>Machine Id: {machine?.id}</Text>
                    <Text>Machine name: {machine?.name}</Text>
                    <Text>Machine modelnumber: {machine?.modelNumber}</Text>
                    <Text>Machine url: {machine?.url}</Text>


                     <Title order={2} style={{ marginTop: '20px', marginBottom: '20px' }}>Machine Monitor</Title>
                        <Table striped highlightOnHover>
                            <thead>
                                <tr>
                                <th style={{ textAlign: 'left' }}>Parameter</th>
                                <th style={{ textAlign: 'left' }}>Aktueller Wert</th>
                                <th style={{ textAlign: 'left' }}>Neuer Wert</th>
                                </tr>
                            </thead>
                                <tr>
                                    <td>Speed of Belt</td>
                                    <td>{data.SpeedOfBelt.length > 0 ? `${data.SpeedOfBelt[data.SpeedOfBelt.length - 1].value} m/s` : "No data"}</td>
                                    <td>
                                <EditParameters machineId={machine?.id || ""} parameter="SpeedOfBelt" />
                            </td>
                                </tr>
                                <tr>
                                    <td>Speed of Drum</td>
                                    <td>{data.SpeedOfDrum.length > 0 ? `${data.SpeedOfDrum[data.SpeedOfDrum.length - 1].value} RPM` : "No data"}</td>
                                </tr>
                                <tr>
                                    <td>Throughput</td>
                                    <td>{data.ThroughPut.length > 0 ? `${data.ThroughPut[data.ThroughPut.length - 1].value} kg/h` : "No data"}</td>
                                </tr>
                                <tr>
                                    <td>Sorting Quality</td>
                                    <td>{data.SortingQuality.length > 0 ? `${data.SortingQuality[data.SortingQuality.length - 1].value} %` : "No data"}</td>
                                </tr>
                                <tr>
                                    <td>Speed of Vibration</td>
                                    <td>{data.SpeedOfVibration.length > 0 ? `${data.SpeedOfVibration[data.SpeedOfVibration.length - 1].value} m/s²` : "No data"}</td>
                                </tr>
                        </Table>
                    </Flex>
    
                {/* Livestream Section */}
                <Flex direction="column" align="center" style={{ width: '30%' }}>
    <Stream cameraId={selectedCamera} />
    <Select
        value={selectedCamera}
        onChange={(value) => value && setSelectedCamera(value)}
        data={cameraOptions}
        style={{ marginTop: 10 }}
    />
</Flex>

    
                {/* Animation Section */}
                <MantineBox h={"500px"} bd={"1px solid red"} style={{ marginLeft: 20 }}>
                    <Checkbox
                        label={"Show legend"}
                        checked={checked}
                        onChange={(event) => setChecked(event.currentTarget.checked)}
                    />
                    <Canvas>
                        <InnerComponent
                            selectedBox={selectedBox}
                            setSelectedBox={setSelectedBox}
                            checkedLegend={checked}
                            setSelectedCamera={setSelectedCamera}
                        />
                    </Canvas>
                    <div style={{ textAlign: 'center' }}>
                        {selectedBox ? `Sensor ${selectedBox} clicked` : 'Click a box'}
                    </div>
                </MantineBox>
            </Flex>
    
            {/* Diagram Section - zweite Reihe */}
            <Flex direction={"row"} justify={"space-between"} mt="lg">
                <MeasurementChart data={data} />
            </Flex>
        </Flex>
        </Flex>
    );
}    





const InnerComponent = ({ selectedBox, setSelectedBox, checkedLegend, setSelectedCamera }: {
    selectedBox: number | null, 
    setSelectedBox: React.Dispatch<React.SetStateAction<number | null>>, 
    checkedLegend: boolean, 
    setSelectedCamera: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { camera } = useThree();


    camera.position.set(-5, 4, 4); // Move the camera to (-5, 3, 5)
    camera.lookAt(0, 0, 0);

    // Function to handle sensor click and update selected camera
    const handleSensorClick = (sensorNumber: number) => {
        setSelectedBox(sensorNumber);
        
        // Set the selected camera based on the sensor clicked
        if (sensorNumber === 1) {
            setSelectedCamera('camera1'); // Load stream from Camera 1
        } else if (sensorNumber === 2) {
            setSelectedCamera('camera2'); // Load stream from Camera 2
        }
    };
    return (
        <>
            <ambientLight />
            <OrbitControls />
            <pointLight position={[10, 10, 10]} />

            <group rotation={[0, 0, 0]}>
                {/* socket Output */}
                <Box
                    position={[-2.25, 0, 0]}
                    args={[0.5, 1, 1]}
                >
                    <meshStandardMaterial attach="material" color="grey" />
                    <Edges color="green" />
                </Box>

                {/* Socket Input */}
                <Box
                    position={[2.25, 0, 0]}
                    args={[0.5, 1, 1]}
                >
                    <meshStandardMaterial attach="material" color="grey" />
                    <Edges color="green" />
                </Box>

                {/* Conveyor Main Box */}
                <Box
                    position={[0, 0.75, 0]}
                    args={[5, 0.5, 1]}
                    onClick={() => setSelectedBox(3)}
                >
                    <meshStandardMaterial attach="material" color="grey" />
                    <Edges color="green" />
                </Box>

                {/* Conveyor Input Box */}
                <Box
                    position={[2.75, 0.75, 0]}
                    args={[0.5, 0.5, 1]}
                >
                    <meshStandardMaterial attach="material" color="grey" />
                    <Edges color="green" />
                    {checkedLegend && <Html position={[0, 0.25, 0]} center>
                        <div style={{ color: 'black', fontSize: '15px', textAlign: 'center' }}>
                            Material_Input
                        </div>
                    </Html>}

                </Box>

                {/* Conveyor Output Box */}
                <Box
                    position={[-2.75, 0.75, 0.25]}
                    args={[0.5, 0.5, 0.5]}
                >
                    <Edges color="grey" />
                    <meshStandardMaterial attach="material" color="lightgreen" />
                    {checkedLegend && <Html position={[0, 0.25, 0]} center>
                        <div style={{ color: 'black', fontSize: '15px', textAlign: 'center' }}>
                            Metall
                        </div>
                    </Html>}

                </Box>

                {/* Conveyor Output Box */}
                <Box
                    position={[-2.75, 0.75, -0.25]}
                    args={[0.5, 0.5, 0.5]}
                >
                    <Edges color="grey" />
                    <meshStandardMaterial attach="material" color="red" />
                    {checkedLegend && <Html position={[0, 0.25, 0]} center>
                        <div style={{ color: 'black', fontSize: '15px', textAlign: 'center' }}>
                            Trash
                        </div>
                    </Html>}

                </Box>

                {/* Sensor one Box */}
                <Box
                    position={[-2.5, 2.5, 0]}
                    args={[0.25, 0.25, 0.25]}
                    onClick={() => handleSensorClick(1)} // Update to new click handler
                >
                    <meshStandardMaterial attach="material" color={selectedBox === 1 ? "green" : "grey"} />
                    <Edges color="green" />
                    {checkedLegend && <Html position={[0, 0.25, 0]} center>
                        <div style={{ color: 'black', fontSize: '15px', textAlign: 'center' }}>
                            Sensor_1
                        </div>
                    </Html>}

                </Box>

                <Box
                    position={[2, 2.5, 0]}
                    args={[0.25, 0.25, 0.25]}
                    onClick={() => handleSensorClick(2)} // Update to new click handler
                >
                    <meshStandardMaterial attach="material" color={selectedBox === 2 ? "green" : "grey"} />
                    <Edges color="green" />
                    {checkedLegend && <Html position={[0, 0.25, 0]} center>
                        <div style={{ color: 'black', fontSize: '15px', textAlign: 'center' }}>
                            Sensor_2
                        </div>
                    </Html>}
                </Box>
                <RotatingCylinder />
                <Metall />
                <Trash />

            </group>
        </>
    );
}

function MovingMetallBox({ startX, startZ, color }: {startX: number, startZ: number, color: string}) {
    const [position, setPosition] = useState({ x: startX, z: startZ });

    useFrame(() => {
        setPosition((prev) => {
            let newX = prev.x - 0.005;
            let newZ = prev.z;

            if (newX <= -2.5) {
                newX = 2.5;
                newZ = -0.4;
            } else if (newX < 0 && newZ < 0.4) {
                newZ += 0.005;
            }

            return { x: newX, z: newZ };
        });
    });

    return (
        <Box position={[position.x, 1, position.z]} args={[0.1, 0.1, 0.1]}>
            <meshStandardMaterial attach="material" color={color} />
        </Box>
    );
}

function Metall() {
    const boxPositions = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

    return (
        <>
            {boxPositions.map((x, index) => (
                <MovingMetallBox key={index} startX={x} startZ={-0.4} color={"lightgreen"} />
            ))}
        </>
    );
}

function MovingTrashBox({ startX, color }: {startX: number, color: string}) {
    const [xPosition, setXPosition] = useState(startX);

    useFrame(() => {
        setXPosition((prev) => {
            let newX = prev - 0.005;
            if (newX <= -2.5) {
                newX = 2.5;
            }
            return newX;
        });
    });

    return (
        <Box position={[xPosition, 1, -0.4]} args={[0.1, 0.1, 0.1]}>
            <meshStandardMaterial attach="material" color={color} />
        </Box>
    );
}

function Trash() {
    const boxPositions = [-2.25, -1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25, 1.75, 2.25];

    return (
        <>
            {boxPositions.map((x, index) => (
                <MovingTrashBox key={index} startX={x} color="red" />
            ))}
        </>
    );
}

function getRandomColorBasedOnPercentage(percentage: number) {
    if (percentage < 0 || percentage > 100) {
        throw new Error("Percentage must be between 0 and 100.");
    }

    // Generate a random number between 0 and 100
    const randomValue = Math.random() * 100;

    // Return 'green' if the random value is less than the input percentage, else 'red'
    return randomValue < percentage ? "green" : "red";
}

function RotatingCylinder() {
    // Explicitly type the ref as a Mesh
    const cylinderRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (cylinderRef.current) {
            // Increment the rotation around the y-axis
            cylinderRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group rotation={[0, Math.PI / -4, 0]}> {/* Rotate 45 degrees on y-axis first */}
            <Cylinder
                ref={cylinderRef}
                args={[0.3, 0.3, 2.5, 32]} // [radiusTop, radiusBottom, height, radialSegments]
                position={[-0.3, 0, 0.3]}
                rotation={[Math.PI / 2, 0, 0]} // Rotate 90 degrees on x-axis
            >
                <Edges color="green" dashed={true} dashSize={0.1} gapSize={0.1}/>
                <meshStandardMaterial attach="material" color="grey" />
                <Html>
                    <p>
                        Magnet
                    </p>
                </Html>
            </Cylinder>
        </group>
    );
}