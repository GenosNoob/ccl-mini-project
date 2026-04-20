import React from "react";
import styled from "styled-components";
import Profile from "../components/Profile";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;

const ProfilePage = () => {
  return <Container><Wrapper><Profile /></Wrapper></Container>;
};

export default ProfilePage;