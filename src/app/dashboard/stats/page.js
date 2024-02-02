// Stats Page displaying todays energy usage so far. 
import react from 'react';
import { Card, Grid, Text, Metric, Flex, BadgeDelta, AreaChart, Title } from "@tremor/react";
import { getAllRecords } from '../../api/db';


async function getData() {
    const data = await getAllRecords();


    console.log(data);
    return data;
}

export default async function Page() {
    const chartData = await getData();
    return (
        <div>
            <Card>
                <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mt-6">
                    <Card decoration="left" decorationColor="indigo">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>First Floor</Text>
                            <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true} size="xs">
                                +12.3%
                            </BadgeDelta>
                        </Flex>
                        <Metric>63 KWh</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="cyan">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>Second Floor</Text>
                            <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true} size="xs">
                                +12.3%
                            </BadgeDelta>
                        </Flex>
                        <Metric>63 KWh</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="indigo">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>Third Floor</Text>
                            <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true} size="xs">
                                +12.3%
                            </BadgeDelta>
                        </Flex>
                        <Metric>63 KWh</Metric>
                    </Card>
                    <Card decoration="left" decorationColor="indigo">
                        <Flex justifyContent="between" alignItems="center">
                            <Text>Fourth Floor</Text>
                            <BadgeDelta deltaType="moderateIncrease" isIncreasePositive={true} size="xs">
                                +12.3%
                            </BadgeDelta>
                        </Flex>
                        <Metric>63 KWh</Metric>
                    </Card>
                </Grid>
                <div className="mt-6">
                    <Card>
                        <Title>Energy Consumption -- last 24hrs</Title>
                        <AreaChart
                            className="h-[500px] mt-4"
                            data={chartData}
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
                </div>
            </Card>

        </div>
    );

}