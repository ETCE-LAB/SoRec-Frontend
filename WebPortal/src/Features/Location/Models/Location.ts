import {MachineKey} from "../../Machine/Models/Machine";

export interface Location{
    id: string,
    name: string,
    address: string,
    organisationId: string,
    machineKeys?: MachineKey[]
}