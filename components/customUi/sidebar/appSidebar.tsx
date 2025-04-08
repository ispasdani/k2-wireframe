"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "../../ui/sidebar";
import SidebarItemsMenu from "./sidebarItemsMenu";
import Logo from "@/svgs/logo";

const AppSidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-start">
          <Logo className="w-[24px] h-[24px] m-2" />
          {open && (
            <h1 className="text-2xl font-bold text-primary">K2-Frame</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarItemsMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
