import React from "react";
import styled, { useTheme } from "styled-components";
import { PieChart } from "@mui/x-charts/PieChart";

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

const CategoryChart = ({ data }) => {
  const theme = useTheme();
  const palette = [
    theme.primary,
    theme.secondary,
    theme.green,
    theme.yellow,
    theme.cyan,
    theme.red,
  ];
  return (
    <Card>
      <Title>Workout Category Distribution</Title>
      {data?.pieChartData && (
        <PieChart
          series={[
            {
              data: data?.pieChartData,
              innerRadius: 30,
              outerRadius: 120,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          colors={palette}
          height={300}
          sx={{
            "& .MuiChartsLegend-label": {
              fill: theme.text_primary,
            },
            "& .MuiChartsPie-sliceLabel": {
              fill: theme.text_primary,
            },
          }}
        />
      )}
    </Card>
  );
};

export default CategoryChart;
