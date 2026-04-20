import React from "react";
import styled, { useTheme } from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "20"};
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const WeeklyStatCard = ({ data }) => {
  const theme = useTheme();
  return (
    <Card>
      <Title>Weekly Stats</Title>
      {data && (
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: data?.weeks,
            },
          ]}
          series={[
            { data: data?.caloriesBurned, label: "Burned", color: theme.primary },
            { data: data?.caloriesConsumed, label: "Consumed", color: theme.secondary },
          ]}
          height={300}
          sx={{
            "& .MuiChartsAxis-directionY .MuiChartsAxis-label": {
              transform: "translateX(-10px)",
              fill: theme.text_primary,
            },
            "& .MuiChartsAxis-tickLabel": {
              fill: theme.text_primary,
            },
            "& .MuiChartsLegend-label": {
              fill: theme.text_primary,
            },
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: theme.text_secondary + "60",
            },
            "& .MuiChartsGrid-line": {
              stroke: theme.text_secondary + "30",
            },
          }}
        />
      )}
    </Card>
  );
};

export default WeeklyStatCard;
