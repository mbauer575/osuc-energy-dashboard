'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// This function retrieves the sum of energy consumption (in Kwh) for each floor and utilities for a specific date.
export async function getKwhSum_Day(date) {
    const data = await prisma.$queryRaw`SELECT 
    SUM(First_Floor_Kwh) AS First_Floor_Sum, 
    SUM(Second_Floor_Kwh) AS Second_Floor_Sum, 
    SUM(Third_Floor_Kwh) AS Third_Floor_Sum, 
    SUM(Fourth_Floor_Kwh) AS Fourth_Floor_Sum, 
    SUM(Utilities_Kwh) AS Utilities_Sum, 
    SUM(TOTAL_Kwh) AS Total_Sum 
    FROM EnergyData  WHERE CAST(dateTime AS DATE) = ${date};`
    return data;
}
// This function retrieves the sum of emergy consumption (in Kwh) for each floor and utilities for a specific date up to the current time. This will be used for getting a dates data up until the current time. 
export async function getKwhSum_Day_Current(date) {
    const data = await prisma.$queryRaw`SELECT 
    SUM(First_Floor_Kwh) AS First_Floor_Sum, 
    SUM(Second_Floor_Kwh) AS Second_Floor_Sum, 
    SUM(Third_Floor_Kwh) AS Third_Floor_Sum, 
    SUM(Fourth_Floor_Kwh) AS Fourth_Floor_Sum, 
    SUM(Utilities_Kwh) AS Utilities_Sum, 
    SUM(TOTAL_Kwh) AS Total_Sum 
    FROM EnergyData  WHERE CAST(dateTime AS DATE) = ${date} AND CAST(dateTime AS TIME) <= CAST(SYSDATETIMEOFFSET() AT TIME ZONE 'Pacific Standard Time' AS TIME);`
    return data;
}

// This function retrieves the sum of energy consumption (in Kwh) for each floor and utilities for a custom date range.
export async function getKwhSum_Custom(start, end) {
    const data = await prisma.$queryRaw`SELECT 
    SUM(First_Floor_Kwh) AS First_Floor_Sum, 
    SUM(Second_Floor_Kwh) AS Second_Floor_Sum, 
    SUM(Third_Floor_Kwh) AS Third_Floor_Sum, 
    SUM(Fourth_Floor_Kwh) AS Fourth_Floor_Sum, 
    SUM(Utilities_Kwh) AS Utilities_Sum, 
    SUM(TOTAL_Kwh) AS Total_Sum 
    FROM EnergyData  WHERE CAST(dateTime AS DATE) >= ${date};`
    return data;
}
// This function retrieves a week worth of data and agragates the data by hour.
export async function getKwhSum_Week() {
    let data = await prisma.$queryRaw`
        SELECT 
            CAST(dateTime AS DATE) as date,
            DATEPART(hour, dateTime) as hour,
            AVG(First_Floor_Kwh) as First_Floor_Avg,
            AVG(Second_Floor_Kwh) as Second_Floor_Avg,
            AVG(Third_Floor_Kwh) as Third_Floor_Avg,
            AVG(Fourth_Floor_Kwh) as Fourth_Floor_Avg,
            AVG(Utilities_Kwh) as Utilities_Avg,
            AVG(TOTAL_Kwh) as Total_Avg
        FROM EnergyData 
        WHERE CAST(dateTime AS DATE) >= DATEADD(day, -7, CAST(SYSDATETIMEOFFSET() AT TIME ZONE 'Pacific Standard Time' AS DATE))
        GROUP BY CAST(dateTime AS DATE), DATEPART(hour, dateTime)
        ORDER BY date, hour;`
    return data;
}

// This function retrieves all records from the EnergyData table based on the specified time frame (today, yesterday, week, or last 24 hours).
// The data is then formatted for use in an AreaChart.
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

