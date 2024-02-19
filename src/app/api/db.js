'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllRecords(timeFrame) {
    let data;
    if (timeFrame === 'today') {
        data = await prisma.$queryRaw`SELECT * FROM EnergyData WHERE CAST(dateTime AS DATE) = CAST(SYSDATETIMEOFFSET() AT TIME ZONE 'Pacific Standard Time' AS DATE) ORDER BY dateTime`
    }
    else if (timeFrame === 'yesterday') {
        data = await prisma.$queryRaw`SELECT * FROM EnergyData WHERE CAST(dateTime AS DATE) = DATEADD(day, -1, CAST(SYSDATETIMEOFFSET() AT TIME ZONE 'Pacific Standard Time' AS DATE)) ORDER BY dateTime;`
    }
    else if (timeFrame === 'week') {
        data = await prisma.$queryRaw`SELECT * FROM EnergyData WHERE CAST(dateTime AS DATE) >= DATEADD(day, -7, CAST(SYSDATETIMEOFFSET() AT TIME ZONE 'Pacific Standard Time' AS DATE)) ORDER BY dateTime;`
    }
    else if (timeFrame === '24hrs') {
        data = await prisma.$queryRaw`SELECT TOP 288 * FROM EnergyData ORDER BY dateTime DESC;`
    }

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
            date_dateTime: record.dateTime,
            First_Floor: record.First_Floor,
            Second_Floor: record.Second_Floor,
            Third_Floor: record.Third_Floor,
            Fourth_Floor: record.Fourth_Floor,
            Utilities: record.Utilities,
            TOTAL: record.TOTAL,
            First_Floor_Kwh: record.First_Floor_Kwh,
            Second_Floor_Kwh: record.Second_Floor_Kwh,
            Third_Floor_Kwh: record.Third_Floor_Kwh,
            Fourth_Floor_Kwh: record.Fourth_Floor_Kwh,
            Utilities_Kwh: record.Utilities_Kwh,
            TOTAL_Kwh: record.TOTAL_Kwh
        };
    });

    return chartData;
}