import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 22px; /* Adjusted border and shadow for light theme */
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 14px;
  display: flex;  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  gap: 6px;
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 600px) {
    gap: 6px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary}; /* Darker title for light theme */
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
const Value = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  align-items: end;
  gap: 8px; /* Darker value for light theme */
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;
const Unit = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;
const Span = styled.div`
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
  @media (max-width: 600px) {
    font-size: 12px;
  }
  ${({ positive, theme }) =>
    positive
      ? `
  color: ${theme.green};
  `
      : `
  color: ${theme.red};`}
`;
const Icon = styled.div`
  height: fit-content;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  ${({ color, bg, theme }) => `
  background: ${bg || theme.primary + "20"}; /* Keep accent colors */
  color: ${color};
  `}
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary}; /* Darker description for light theme */
  margin-bottom: 6px;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const CountsCard = ({ item, data, percentage }) => {
  const value = data?.[item.key];
  return (
    <Card>
      <Left>
        <Title>{item.name}</Title>
        <Value>
          {typeof value === "number" ? value.toFixed(2) : value || 0}
          <Unit>{item.unit}</Unit>
          {percentage && <Span positive>{`(${percentage}%)`}</Span>}
        </Value>
        <Desc>{item.desc}</Desc>
      </Left>
      <Icon color={item.color} bg={item.lightColor}>
        {item.icon}
      </Icon>
    </Card>
  );
};

export default CountsCard;
