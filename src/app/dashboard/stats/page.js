// Stats Page displaying live data for the current day. 

export const dynamic = 'force-dynamic'


import { Card, Grid, Text, Metric, Flex, BadgeDelta, AreaChart, Title, DonutChart, Divider } from "@tremor/react";
import { getAllRecords } from '../../api/db';


async function getData(timeFrame) {
    const data = await getAllRecords(timeFrame);
    return data;
}

function calcKwh(data, floor) {
    let sum = 0;
    data.forEach(record => {
        sum += record[floor];
    });
    sum = Math.round(sum)
    return sum;
}

function calcKwh_adjusted(data, floor, last) {
    let sum = 0;
    let last_time = new Date(last);
    last_time.setDate(last_time.getDate() - 1);
    data.forEach(record => {
        if (new Date(record.date_dateTime) <= (last_time)) {
            sum += record[floor];
        }
    });
    sum = Math.round(sum);
    console.log(`Final sum: ${sum}`);
    return sum;
}

// const valueFormatter = (number) => `${number} KWh`;


export default async function Page() {
    const chartData_today = await getData('today');
    const chartData_24hrs = await getData('24hrs');
    const chartData_yesterday = await getData('yesterday');
    const chartData_week = await getData('week');

    const last_time = chartData_today[chartData_today.length - 1].date_dateTime;
    const last_time_ampm = chartData_today[chartData_today.length - 1].date;

    const firstFloorKwh = calcKwh(chartData_today, 'First_Floor_Kwh');
    const secondFloorKwh = calcKwh(chartData_today, 'Second_Floor_Kwh');
    const thirdFloorKwh = calcKwh(chartData_today, 'Third_Floor_Kwh');
    const fourthFloorKwh = calcKwh(chartData_today, 'Fourth_Floor_Kwh');
    const utilitiesKwh = calcKwh(chartData_today, 'Utilities_Kwh');
    const TOTAL_Kwh = calcKwh(chartData_today, 'TOTAL_Kwh');

    const firstFloorKwh_week = calcKwh(chartData_week, 'First_Floor_Kwh');
    const secondFloorKwh_week = calcKwh(chartData_week, 'Second_Floor_Kwh');
    const thirdFloorKwh_week = calcKwh(chartData_week, 'Third_Floor_Kwh');
    const fourthFloorKwh_week = calcKwh(chartData_week, 'Fourth_Floor_Kwh');
    const utilitiesKwh_week = calcKwh(chartData_week, 'Utilities_Kwh');
    const TOTAL_Kwh_week = calcKwh(chartData_week, 'TOTAL_Kwh');


    const firstFloorKwh_yesterday = calcKwh(chartData_yesterday, 'First_Floor_Kwh');
    const secondFloorKwh_yesterday = calcKwh(chartData_yesterday, 'Second_Floor_Kwh');
    const thirdFloorKwh_yesterday = calcKwh(chartData_yesterday, 'Third_Floor_Kwh');
    const fourthFloorKwh_yesterday = calcKwh(chartData_yesterday, 'Fourth_Floor_Kwh');




    const ffkwh_yesterday = calcKwh_adjusted(chartData_yesterday, 'First_Floor_Kwh', last_time);
    const sfkwh_yesterday = calcKwh_adjusted(chartData_yesterday, 'Second_Floor_Kwh', last_time);
    const tfkwh_yesterday = calcKwh_adjusted(chartData_yesterday, 'Third_Floor_Kwh', last_time);
    const fofkwh_yesterday = calcKwh_adjusted(chartData_yesterday, 'Fourth_Floor_Kwh', last_time);

    const firstFloorDelta = ((firstFloorKwh - ffkwh_yesterday) / ffkwh_yesterday) * 100;
    const secondFloorDelta = ((secondFloorKwh - sfkwh_yesterday) / sfkwh_yesterday) * 100;
    const thirdFloorDelta = ((thirdFloorKwh - tfkwh_yesterday) / tfkwh_yesterday) * 100;
    const fourthFloorDelta = ((fourthFloorKwh - fofkwh_yesterday) / fofkwh_yesterday) * 100;




    const floors = [
        {
            name: "First Floor",
            usage: firstFloorKwh,
        },
        {
            name: "Second Floor",
            usage: secondFloorKwh,
        },
        {
            name: "Third Floor",
            usage: thirdFloorKwh,
        },
        {
            name: "Fourth Floor",
            usage: fourthFloorKwh,
        },
        {
            name: "Utilities",
            usage: utilitiesKwh,
        }
    ];
    const floors_week = [
        {
            name: "First Floor",
            usage: firstFloorKwh_week,
        },
        {
            name: "Second Floor",
            usage: secondFloorKwh_week,
        },
        {
            name: "Third Floor",
            usage: thirdFloorKwh_week,
        },
        {
            name: "Fourth Floor",
            usage: fourthFloorKwh_week,
        },
        {
            name: "Utilities",
            usage: utilitiesKwh_week,
        }
    ];


    return (
        <div>
            <Card>
                <Grid numItems={2} className="gap-6">
                    <Card>
                        <Title>OSU Cascades Res Hall Energy Consumption</Title>
                        <Text>Last Updated: {last_time_ampm}</Text>
                        <Divider></Divider>
                        <Flex flexDirection='row' justifyContent='center' alignItems='center'>
                            <div>
                                <Title>Day</Title>
                                <Metric>{TOTAL_Kwh} kWh</Metric>
                            </div>
                            <DonutChart
                                className="mt-6"
                                data={floors}
                                category="usage"
                                index="name"
                                //valueFormatter={valueFormatter}
                                colors={["indigo", "cyan", "red", "green"]}
                                showLabel={false}
                                variant='pie'
                            />
                            <div>
                                <Title>Week</Title>
                                <Metric>{TOTAL_Kwh_week} kWh</Metric>
                            </div>
                            <DonutChart
                                className="mt-6"
                                data={floors_week}
                                category="usage"
                                index="name"
                                //valueFormatter={valueFormatter}
                                colors={["indigo", "cyan", "red", "green"]}

                                variant='donut'
                            />
                        </Flex>
                    </Card>
                    <Card decoration="left" decorationColor="gray">
                        <Title>Utilities</Title>
                        <AreaChart
                            className="h-[270px]"
                            data={chartData_24hrs}
                            index="date"
                            yAxisWidth={65}
                            categories={["Utilities"]}
                            colors={["gray"]}
                            showLegend={false}
                            showGridLines={true}
                            showGradient={true}
                            curveType='monotone'
                            tickGap={15}
                            autoMinValue={true}
                        />
                    </Card>
                </Grid>
                <div className="mt-6">
                    <Card>
                        <Title>Energy Consumption by Floor</Title>
                        <Text>Today compared to Yesterday</Text>
                        <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mt-6">
                            <Card decoration="left" decorationColor="indigo">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>First Floor</Text>


                                    {/* <Text>Delta = {(firstFloorKwh - ffkwh_yesterday)}</Text>
                            <Text>Yesterday = {firstFloorKwh_yesterday}</Text>
                            <Text>Yesterday Adjusted = {ffkwh_yesterday}</Text> */}


                                    <BadgeDelta deltaType={firstFloorDelta > 0 ? "increase" : "decrease"} isIncreasePositive={true} size="xs">
                                        {firstFloorDelta.toFixed(2)}%
                                    </BadgeDelta>
                                </Flex>
                                <Metric>{firstFloorKwh} kWh</Metric>
                            </Card>
                            <Card decoration="left" decorationColor="cyan">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>Second Floor</Text>
                                    <BadgeDelta deltaType={secondFloorDelta > 0 ? "increase" : "decrease"} isIncreasePositive={true} size="xs">
                                        {secondFloorDelta.toFixed(2)}%
                                    </BadgeDelta>
                                </Flex>
                                <Metric>{secondFloorKwh} kWh</Metric>
                            </Card>
                            <Card decoration="left" decorationColor="red">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>Third Floor</Text>
                                    <BadgeDelta deltaType={thirdFloorDelta > 0 ? "increase" : "decrease"} isIncreasePositive={true} size="xs">
                                        {thirdFloorDelta.toFixed(2)}%
                                    </BadgeDelta>
                                </Flex>
                                <Metric>{thirdFloorKwh} kWh</Metric>
                            </Card>
                            <Card decoration="left" decorationColor="green">
                                <Flex justifyContent="between" alignItems="center">
                                    <Text>Fourth Floor</Text>
                                    <BadgeDelta deltaType={fourthFloorDelta > 0 ? "increase" : "decrease"} isIncreasePositive={true} size="xs">
                                        {fourthFloorDelta.toFixed(2)}%
                                    </BadgeDelta>
                                </Flex>
                                <Metric>{fourthFloorKwh} kWh</Metric>
                            </Card>
                        </Grid>
                    </Card>
                </div>


                <div className="mt-6">
                    <Card>
                        <Title>Energy Trends -- last 24hrs</Title>
                        <AreaChart
                            className="h-72 mt-4"
                            data={chartData_24hrs}
                            index="date"
                            yAxisWidth={65}
                            categories={["First_Floor", "Second_Floor", "Third_Floor", "Fourth_Floor"]}
                            colors={["indigo", "cyan", "red", "green"]}
                            showLegend={true}
                            showGridLines={true}
                            showGradient={true}
                            curveType='monotone'
                            tickGap={15}
                        />
                    </Card>
                    {/* <Card>
                        <Title>Energy Trends -- yesterday</Title>
                        <AreaChart
                            className="h-72 mt-4"
                            data={chartData_yesterday}
                            index="date"
                            yAxisWidth={65}
                            categories={["First_Floor", "Second_Floor", "Third_Floor", "Fourth_Floor"]}
                            colors={["indigo", "cyan", "red", "green"]}
                            showLegend={true}
                            showGridLines={true}
                            showGradient={true}
                            curveType='monotone'
                            tickGap={15}
                        />
                    </Card> */}
                </div>
            </Card>

        </div>
    );

}