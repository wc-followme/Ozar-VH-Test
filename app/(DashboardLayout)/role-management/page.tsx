"use client";

import { HelmetIcon } from "@/components/icons/HelmetIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { PeopleGroupIcon } from "@/components/icons/PeopleGroupIcon";
import { UserCardIcon } from "@/components/icons/UserCardIcon";
import { RoleCard } from "@/components/shared/cards/RoleCard";
import { Button } from "@/components/ui/button";
import { roles } from "@/constants/dummy-data";
import { Edit2, Trash } from "iconsax-react";
import React from "react";
const menuOptions:any = [
    { label: "Edit", action: "edit",icon:Edit2 },
    { label: "Delete", action: "delete",icon:Trash},
  ];
const RoleManagement = () => {
 

  return (
    <section className="flex flex-col w-full items-start gap-8 p-6 overflow-y-auto">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium text-[var(--text-dark)]">
          Role and Permissions Management
        </h2>

        <Button className="h-[42px] px-6 bg-[#34AD44] rounded-full font-semibold text-white px-6">
          Create Role
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {roles.map((role, index) => (
            <React.Fragment key={index}>
                <RoleCard onToggle={() => {}}
              menuOptions={menuOptions} iconSrc={role.iconSrc} iconBgColor={role.iconBgColor} title={role.title} description={role.description} permissionCount={role.permissionCount} iconColor={role.color}/>
            </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default RoleManagement;