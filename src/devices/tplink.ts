import fz from '../converters/fromZigbee';
import * as exposes from '../lib/exposes';
import * as reporting from '../lib/reporting';
import {DefinitionWithExtend} from '../lib/types';

const e = exposes.presets;

const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ['MS100'],
        model: 'MS100',
        vendor: 'TP-Link',
        description: 'Smart motion sensor',
        fromZigbee: [fz.ias_occupancy_alarm_1, fz.battery, fz.illuminance],
        toZigbee: [],
        exposes: [e.occupancy(), e.battery_low(), e.tamper(), e.battery(), e.illuminance()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            const endpoint2 = device.getEndpoint(2);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genPowerCfg']);
            await reporting.batteryPercentageRemaining(endpoint);
            await reporting.bind(endpoint2, coordinatorEndpoint, ['msIlluminanceMeasurement']);
            await reporting.illuminance(endpoint2);
            device.powerSource = 'Battery';
            device.save();
        },
    },
    {
        zigbeeModel: ['CS100'],
        model: 'CS100',
        vendor: 'TP-Link',
        description: 'Contact sensor',
        fromZigbee: [fz.ias_contact_alarm_1, fz.battery],
        toZigbee: [],
        exposes: [e.contact(), e.battery_low(), e.battery()],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['genPowerCfg']);
            await reporting.batteryPercentageRemaining(endpoint);
            device.powerSource = 'Battery';
            device.save();
        },
    },
];

export default definitions;
module.exports = definitions;
