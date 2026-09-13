"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

const chartConfig = {
  correct: {
    label: "Correct",
    color: "#10B981",
  },
  incorrect: {
    label: "Incorrect",
    color: "#EF4444",
  },
} satisfies ChartConfig;

type ChartProps = {
  correct: number;
  wrong: number;
};

export function Chart({ correct, wrong }: ChartProps) {
  const total = correct + wrong;

  const chartData = [
    { name: "Correct", value: total > 0 ? (correct / total) * 100 : 0 },
    { name: "Incorrect", value: total > 0 ? (wrong / total) * 100 : 0 },
  ];

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "Correct"
                      ? chartConfig.correct.color
                      : chartConfig.incorrect.color
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
