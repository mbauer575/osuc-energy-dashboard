'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllRecords() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const data = await prisma.resData.findMany({
        orderBy: {
            dateTime: 'asc'
        },
    })
    // Format the data for the AreaChart
    const chartData = data.map(record => {
        const timeParts = record.dateTime.toISOString().split('T')[1].split(':');
        let hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        const formattedTime = hours + ':' + minutes + ' ' + ampm;

        return {
            date: formattedTime,
            First_Floor: record.First_Floor,
            Second_Floor: record.Second_Floor,
            Third_Floor: record.Third_Floor,
            Fourth_Floor: record.Fourth_Floor
        };
    });

    return chartData;
}