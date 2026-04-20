import { CircularProgress } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Button = styled.div`
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: min-content;
  padding: 16px 26px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Lighter shadow for light theme */
  border: 1px solid ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    padding: 8px 12px;
  }

  ${({ $type, theme }) =>
    $type === "secondary"
      ? `
  background: ${theme.purple};
border: 1px solid ${({ theme }) => theme.purple};
  `
      : `
  background: ${theme.primary};
`}
  &:hover {
    transform: translateY(-1px); /* Subtle hover effect */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15); /* Slightly more pronounced hover shadow */
  }

  ${({ $isDisabled }) =>
    $isDisabled &&
    `
  opacity: 0.8;
  cursor: not-allowed;

  `}
  ${({ $isLoading }) =>
    $isLoading &&
    `
    opacity: 0.8;
  cursor: not-allowed;
`}
${({ $flex }) =>
    $flex &&
    `
    flex: 1;
`}

${({ $small }) =>
    $small &&
    `
padding: 10px 28px;
`}
  ${({ $outlined, theme }) =>
    $outlined &&
    `
background: transparent;
color: ${theme.primary};
  box-shadow: none;
`}
  ${({ $full }) =>
    $full &&
    `
  width: 100%;`}
`;

const ButtonComponent = ({
  text,
  isLoading,
  isDisabled,
  rightIcon,
  leftIcon,
  type,
  onClick,
  flex,
  small,
  outlined,
  full,
}) => {
  return (
    <Button
      onClick={() => !isDisabled && !isLoading && onClick()}
      $isDisabled={isDisabled}
      $type={type}
      $isLoading={isLoading}
      $flex={flex}
      $small={small}
      $outlined={outlined}
      $full={full}
    >
      {isLoading && (
        <CircularProgress
          style={{ width: "18px", height: "18px", color: "inherit" }}
        />
      )}
      {leftIcon}
      {text}
      {isLoading && <> . . .</>}
      {rightIcon}
    </Button>
  );
};

export default ButtonComponent;
