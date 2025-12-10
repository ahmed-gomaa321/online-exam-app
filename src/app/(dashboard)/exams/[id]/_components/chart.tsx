"use client";

import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { ExamResult } from "@/lib/types/questions-results";

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

export function Chart() {
  const [results, setResults] = useState<ExamResult | null>(null);

  useEffect(() => {
    const results = localStorage.getItem("exam-results");
    if (results) setResults(JSON.parse(results));
  }, []);

  const correct = results?.correct ?? 0;
  const inCorrect = results?.wrong ?? 0;
  const total = correct + inCorrect;
  const chartData = [
    { name: "Correct", value: total > 0 ? (correct / total) * 100 : 0 },
    { name: "Incorrect", value: total > 0 ? (inCorrect / total) * 100 : 0 },
  ];

  return (
    <Card className="flex flex-col">
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
