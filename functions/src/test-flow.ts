import * as dotenv from 'dotenv';
import { updateEvents } from './updateEvents';

dotenv.config();

async function runTest() {
    console.log('Running test flow...');

    // Mock dates
    const startDate = '20240101';
    const endDate = '20240105';

    try {
        await updateEvents(startDate, endDate);
        console.log('Test completed successfully.');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTest();
