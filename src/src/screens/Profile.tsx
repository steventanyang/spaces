import React, { useMemo } from "react";
import logo from "./logo.svg";
import { TGetVenueOptions, Mappedin, getVenue } from "@mappedin/mappedin-js";
import styled from "styled-components";

import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt } from "react-icons/fa";

const Main = styled.div`
  height: 100vh;
  width: 100vw;
`;

const BottomNavbar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: #323437;
  color: white;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.div`
  padding: 20px;
  background-color: #000;
  height: 20px;
  width: 20px;
`;

const Icon = styled.div`
  padding: 20px;
`;

const Profile = () => {
  const options = useMemo<TGetVenueOptions>(
    () => ({
      venue: "mappedin-demo-mall",
      clientId: "5eab30aa91b055001a68e996",
      clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1",
    }),
    []
  );

  return (
    <>
      <Icon>
        <CgProfile size={40} />
      </Icon>
    </>
  );
};

export default Profile;
