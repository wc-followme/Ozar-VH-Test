"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVerticalIcon } from "lucide-react"
import Image from "next/image"
import { IconDotsVertical } from '@tabler/icons-react';
import React from "react"

export interface RoleCardProps {
  iconSrc: any
  iconBgColor: string
  title: string
  description?: string
  permissionCount?: number
  iconColor?:string
}

export const RoleCard: React.FC<RoleCardProps> = ({
  iconSrc,
  iconBgColor,
  title,
  description = "Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
  permissionCount = 0,
  iconColor
}) => {
  return (
    <Card className="flex flex-col items-start gap-4 p-6 bg-[var(--card-background)] rounded-[24px] border border-[var(--border-dark)]">
      <div className="flex items-start justify-between w-full">
        <div
          className={`flex items-center justify-center w-[60px] h-[60px] ${iconBgColor} rounded-[16px] mb-2`}
          style={{color:iconColor}}
        >
          {React.createElement(iconSrc, {
  size: 30,
  color: iconColor,
})}
        </div>

        <Button variant="ghost" className="p-0">
          <IconDotsVertical
         className="!w-6 !h-6"
                strokeWidth={2}
                color="var(--text)"
            />
        </Button>
      </div>

      <CardContent className="flex flex-col items-start gap-4 p-0 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>

          <p className="text-base text-[var(--text-secondary)] leading-tight">{description}</p>
        </div>

        <div className="flex w-full items-center justify-between px-4 py-2 bg-[var(--border-light)] rounded-[30px]">
          <span className="text-xs font-medium text-[var(--text)]">Permissions</span>
          <span className="text-xs font-medium text-[var(--text)]">
            {permissionCount}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}