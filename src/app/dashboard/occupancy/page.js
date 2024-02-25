export const dynamic = 'force-dynamic'

import { Card, CategoryBar, DeltaBar, MarkerBar, ProgressBar, Grid, BarList, Text, Metric, Flex, BadgeDelta, AreaChart, Title, DonutChart, Divider } from "@tremor/react";
import { getKwhSum_Day, getKwhSum_Custom, getKwhSum_Day_Current, getAllRecords, getKwhSum_Week } from '../../api/db';


async function calcKwh(date, floor_occupancy) {
    const totalKwh = await getKwhSum_Day(date);
    let floor_occupancy_total = []
    let ff = (totalKwh[0].First_Floor_Sum / floor_occupancy[0]).toFixed(2)
    let sf = (totalKwh[0].Second_Floor_Sum / floor_occupancy[1]).toFixed(2)
    let tf = (totalKwh[0].Third_Floor_Sum / floor_occupancy[2]).toFixed(2)
    let fo = (totalKwh[0].Fourth_Floor_Sum / floor_occupancy[3]).toFixed(2)

    floor_occupancy_total.push(ff, sf, tf, fo)
    return floor_occupancy_total;
}
async function getKwhSum(date) {
    const data = await getKwhSum_Day(date);
    return data;
}
async function getKwhSum_adjusted(date) {
    const data = await getKwhSum_Day_Current(date);
    return data;
}
async function getData(timeFrame) {
    const data = await getKwhSum_Week();
    return data;
}

export default async function Page() {
    const floor_occupancy = [32, 83, 83, 57, 0]
    // Get today's date
    let today = new Date();
    // Format today's date
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    // Get yesterday's date
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // Format yesterday's date
    dd = String(yesterday.getDate()).padStart(2, '0');
    mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = yesterday.getFullYear();
    yesterday = yyyy + '-' + mm + '-' + dd;

    // Call calcKwh 
    let todayKwh = await calcKwh(today, floor_occupancy);
    let yesterdayKwh = await calcKwh(yesterday, floor_occupancy)

    let todayKwhTotal = await getKwhSum(today);
    let yesterdayKwhTotal = await getKwhSum_adjusted(yesterday);

    const chartData_week = await getData('week_avg');



    const Deltas = [
        {
            name: 'First Floor',
            value: todayKwh[0] - yesterdayKwh[0],
            percentage: ((todayKwh[0] - yesterdayKwh[0]) / yesterdayKwh[0]).toFixed(2)
        },
        {
            name: 'Second Floor',
            value: todayKwh[1] - yesterdayKwh[1],
            percentage: ((todayKwh[1] - yesterdayKwh[1]) / yesterdayKwh[1]).toFixed(2)
        },
        {
            name: 'Third Floor',
            value: todayKwh[2] - yesterdayKwh[2],
            percentage: ((todayKwh[2] - yesterdayKwh[2]) / yesterdayKwh[2]).toFixed(2)
        },
        {
            name: 'Fourth Floor',
            value: todayKwh[3] - yesterdayKwh[3],
            percentage: ((todayKwh[3] - yesterdayKwh[3]) / yesterdayKwh[3]).toFixed(2)
        }
    ]
    const leaderboard = [
        {
            name: 'First Floor',
            value: (todayKwhTotal[0].First_Floor_Sum - yesterdayKwhTotal[0].First_Floor_Sum).toFixed(2),
            color: 'indigo'
        },
        {
            name: 'Second Floor',
            value: (todayKwhTotal[0].Second_Floor_Sum - yesterdayKwhTotal[0].Second_Floor_Sum).toFixed(2),
            color: 'cyan'
        },
        {
            name: 'Third Floor',
            value: (todayKwhTotal[0].Third_Floor_Sum - yesterdayKwhTotal[0].Third_Floor_Sum).toFixed(2),
            color: 'red'
        },
        {
            name: 'Fourth Floor',
            value: (todayKwhTotal[0].Fourth_Floor_Sum - yesterdayKwhTotal[0].Fourth_Floor_Sum).toFixed(2),
            color: 'green'
        }
    ]

    // sort the leaderboard by value
    leaderboard.sort((a, b) => a.value - b.value);

    return (
        <div>
            <Card>

                <Grid numItems={2} className="gap-6" style={{ display: 'flex' }}>
                    <Card style={{ flex: 2 }}>
                        <Title>Energy Trends -- This Week</Title>
                        <p>Last Updated:</p>
                        <Divider />
                        <AreaChart
                            data={chartData_week}
                            index="hour"
                            yAxisWidth={65}
                            categories={["First_Floor_Avg", "Second_Floor_Avg", "Third_Floor_Avg", "Fourth_Floor_Avg"]}
                            colors={["indigo", "cyan", "red", "green"]}
                            showLegend={true}
                            showGridLines={true}
                            showGradient={true}
                            curveType='monotone'
                            tickGap={15}
                        />
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <Title>Leaderboard -- Day</Title>
                        <Divider />
                        <Card className="mt-2" decoration="left" decorationColor={leaderboard[0].color}>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                                <Title>1st: {leaderboard[0].name}</Title>
                                <span className="flex items-center space-x-1">
                                    <span>{leaderboard[0].value}</span>
                                </span>
                            </p>
                            <DeltaBar value={leaderboard[0].value} isIncreasePositive={false} className="mt-3" />
                        </Card>
                        <Card className="mt-2" decoration="left" decorationColor={leaderboard[1].color}>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                                <Title>2. {leaderboard[1].name}</Title>
                                <span className="flex items-center space-x-1">
                                    <span>{leaderboard[1].value}</span>
                                </span>
                            </p>
                            <DeltaBar value={leaderboard[1].value} isIncreasePositive={false} className="mt-3" />
                        </Card>
                        <Card className="mt-2" decoration="left" decorationColor={leaderboard[2].color}>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                                <Title>3. {leaderboard[2].name}</Title>
                                <span className="flex items-center space-x-1">
                                    <span>{leaderboard[2].value}</span>
                                </span>
                            </p>
                            <DeltaBar value={leaderboard[2].value} isIncreasePositive={false} className="mt-3" />
                        </Card>
                        <Card className="mt-2" decoration="left" decorationColor={leaderboard[3].color}>
                            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
                                <Title>4. {leaderboard[3].name}</Title>
                                <span className="flex items-center space-x-1">
                                    <span>{leaderboard[3].value}</span>
                                </span>
                            </p>
                            <DeltaBar value={leaderboard[3].value} isIncreasePositive={false} className="mt-3" />
                        </Card>
                    </Card>
                </Grid>
                <div className="mt-6" />
                {/* <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mt-6">
                    <Card decoration="left" decorationColor="indigo">
                        <Flex justifyContent="between" alignItems="center">
                            <Title>First Floor</Title>
                            <BadgeDelta deltaType={Deltas[0].percentage > 0 ? "increase" : "decrease"} isIncreasePositive={false} size="xs">
                                {Deltas[0].percentage}%
                            </BadgeDelta>
                        </Flex>
                        <Metric>{todayKwh[0]} kWh/Person</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="cyan">
                        <Flex justifyContent="between" alignItems="center">
                            <Title>Second Floor</Title>
                            <BadgeDelta deltaType={Deltas[1].percentage > 0 ? "increase" : "decrease"} isIncreasePositive={false} size="xs">
                                {Deltas[1].percentage}%</BadgeDelta>
                        </Flex>
                        <Metric>{todayKwh[1]} kWh/Person</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="red">
                        <Flex justifyContent="between" alignItems="center">
                            <Title>Third Floor</Title>

                            <BadgeDelta deltaType={Deltas[2].percentage > 0 ? "increase" : "decrease"} isIncreasePositive={false} size="xs">
                                {Deltas[2].percentage}%</BadgeDelta>
                        </Flex>
                        <Metric>{todayKwh[2]} kWh/Person</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="green">
                        <Flex justifyContent="between" alignItems="center">
                            <Title>Fourth Floor</Title>
                            <BadgeDelta deltaType={Deltas[3].percentage > 0 ? "increase" : "decrease"} isIncreasePositive={false} size="xs">
                                {Deltas[3].percentage}%</BadgeDelta>
                        </Flex>
                        <Metric>{todayKwh[3]} kWh/Person</Metric>
                    </Card>

                </Grid> */}
            </Card >
        </div >

    );
}