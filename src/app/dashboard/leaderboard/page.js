// leaderboard page 

export const dynamic = 'force-dynamic'

import { Card, Grid, BarChart, Text, Metric, Flex, BadgeDelta, AreaChart, Title, DonutChart, Divider } from "@tremor/react";
import { getKwhSum_Day, getKwhSum_Custom } from '../../api/db';


async function calcKwh(date) {
    const total = await getKwhSum_Day(date);
    return total;
}

async function calcKwhCustom(start, end) {
    const total = await getKwhSum_Custom(start, end);
    return total;
}




export default async function Page() {

    const today = new Date();

    const dates = [];
    for (let i = 0; i < 4; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        dates.push(formattedDate);
    }

    const today_data = await calcKwh(dates[0]);
    const day_1_data = await calcKwh(dates[1]);
    const day_2_data = await calcKwh(dates[2]);
    const day_3_data = await calcKwh(dates[3]);




    const chartdata_3day = [
        {
            name: 'First Floor',
            [dates[0]]: today_data[0].First_Floor_Sum,
            [dates[1]]: day_1_data[0].First_Floor_Sum,
            [dates[2]]: day_2_data[0].First_Floor_Sum,
            [dates[3]]: day_3_data[0].First_Floor_Sum
        },
        {
            name: 'Second Floor',
            [dates[0]]: today_data[0].Second_Floor_Sum,
            [dates[1]]: day_1_data[0].Second_Floor_Sum,
            [dates[2]]: day_2_data[0].Second_Floor_Sum,
            [dates[3]]: day_3_data[0].Second_Floor_Sum
        },
        {
            name: 'Third Floor',
            [dates[0]]: today_data[0].Third_Floor_Sum,
            [dates[1]]: day_1_data[0].Third_Floor_Sum,
            [dates[2]]: day_2_data[0].Third_Floor_Sum,
            [dates[3]]: day_3_data[0].Third_Floor_Sum
        },
        {
            name: 'Fourth Floor',
            [dates[0]]: today_data[0].Fourth_Floor_Sum,
            [dates[1]]: day_1_data[0].Fourth_Floor_Sum,
            [dates[2]]: day_2_data[0].Fourth_Floor_Sum,
            [dates[3]]: day_3_data[0].Fourth_Floor_Sum
        }

    ]
    const chartdata_week = [
        {
            name: 'First Floor',
            [dates[0]]: today_data[0].First_Floor_Sum,
            [dates[1]]: day_1_data[0].First_Floor_Sum,
            [dates[2]]: day_2_data[0].First_Floor_Sum,
            [dates[3]]: day_3_data[0].First_Floor_Sum
        },
        {
            name: 'Second Floor',
            [dates[0]]: today_data[0].Second_Floor_Sum,
            [dates[1]]: day_1_data[0].Second_Floor_Sum,
            [dates[2]]: day_2_data[0].Second_Floor_Sum,
            [dates[3]]: day_3_data[0].Second_Floor_Sum
        },
        {
            name: 'Third Floor',
            [dates[0]]: today_data[0].Third_Floor_Sum,
            [dates[1]]: day_1_data[0].Third_Floor_Sum,
            [dates[2]]: day_2_data[0].Third_Floor_Sum,
            [dates[3]]: day_3_data[0].Third_Floor_Sum
        },
        {
            name: 'Fourth Floor',
            [dates[0]]: today_data[0].Fourth_Floor_Sum,
            [dates[1]]: day_1_data[0].Fourth_Floor_Sum,
            [dates[2]]: day_2_data[0].Fourth_Floor_Sum,
            [dates[3]]: day_3_data[0].Fourth_Floor_Sum
        }

    ]

    return (
        <Grid>
            <Card>
                <Grid numItems={2} className="gap-6" style={{ display: 'flex' }}>
                    <Card style={{ flex: 2 }}>
                        <Title>Energy Trends -- Last 3 days</Title>
                        <Divider />
                        <BarChart className="mt-6" data={chartdata_3day} index="name" categories={dates} colors={['blue', 'teal', 'amber', 'rose', 'indigo', 'emerald']} yAxisWidth={48} />
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <Title>Leaderboard -- Week</Title>
                    </Card>
                </Grid>
                <div className="mt-6" />
                <Grid numItems={2} className="gap-6" style={{ display: 'flex' }}>
                    <Card style={{ flex: 2 }}>
                        <Title>Energy Trends -- Week to Week</Title>
                        <Divider />
                        <BarChart className="mt-6" data={chartdata_week} index="name" categories={dates} colors={['blue', 'teal', 'amber', 'rose', 'indigo', 'emerald']} yAxisWidth={48} />
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <Title>Leaderboard -- Month</Title>
                    </Card>
                </Grid>

            </Card>
        </Grid >
    );
}