"use client";

import { HelmetIcon } from "@/components/icons/HelmetIcon";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { PeopleGroupIcon } from "@/components/icons/PeopleGroupIcon";
import { UserCardIcon } from "@/components/icons/UserCardIcon";
import { RoleCard } from "@/components/layout/RoleCard";
import { Button } from "@/components/ui/button";
import React from "react";

const RoleManagement = () => {
  const roles = [
    {
      title: "Admin",
      iconSrc: UserCardIcon,
      iconBgColor: "bg-[#34AD4426]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'',
    },
    {
      title: "Contractor",
      iconSrc: HelmetIcon,
      iconBgColor: "bg-[#1A57BF1A]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'',
    },
    {
      title: "Project Manager",
      iconSrc: PeopleGroupIcon,
      iconBgColor: "bg-[#D4323226]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#D43232',
    },
    {
      title: "Estimator",
      iconSrc:PeopleGroupIcon,
      iconBgColor: "bg-[#90C91D26]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#90C91D',
    },
    {
      title: "Employee",
      iconSrc:PeopleGroupIcon,
      iconBgColor: "bg-[#EBB40226]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#90C91D',
    },
    {
      title: "Home Owner",
      iconSrc: HomeIcon,
      iconBgColor: "bg-[#00A8BF26]",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#00A8BF',
    },
  ];

  return (
    <section className="flex flex-col w-full items-start gap-8 p-6 overflow-y-auto">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-medium text-[var(--text-dark)]">
          Role and Permissions Management
        </h2>

        <Button className="h-[42px] px-6 bg-[#34ad44] rounded-full font-semibold text-white">
          Create Role
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {roles.map((role, index) => (
            <React.Fragment key={index}>
                <RoleCard iconSrc={role.iconSrc} iconBgColor={role.iconBgColor} title={role.title} description={role.description} permissionCount={role.permissionCount} iconColor={role.color}/>
            </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default RoleManagement;