import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "@/components/common/MainNavbar";

const MainLayout = () => {
  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
