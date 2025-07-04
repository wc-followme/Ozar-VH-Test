import { HelmetIcon } from "@/components/icons/HelmetIcon";
import { PeopleGroupIcon } from "@/components/icons/PeopleGroupIcon";
import { UserCardIcon } from "@/components/icons/UserCardIcon";
import { HomeIcon } from "lucide-react";

 export const roles = [
    {
      title: "Admin",
      iconSrc: UserCardIcon,
      iconBgColor: "#34AD4426",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'',
    },
    {
      title: "Contractor",
      iconSrc: HelmetIcon,
      iconBgColor: "#1A57BF1A",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'',
    },
    {
      title: "Project Manager",
      iconSrc: PeopleGroupIcon,
      iconBgColor: "#D4323226",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#D43232',
    },
    {
      title: "Estimator",
      iconSrc:PeopleGroupIcon,
      iconBgColor: "#90C91D26",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#90C91D',
    },
    {
      title: "Employee",
      iconSrc:PeopleGroupIcon,
      iconBgColor: "#EBB40226",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#90C91D',
    },
    {
      title: "Home Owner",
      iconSrc: HomeIcon,
      iconBgColor: "#00A8BF26",
      description:"Enhance outdoor spaces including roofing, siding, painting, landscaping, or fencing work.",
      permissionCount:30,
      color:'#00A8BF',
    },
  ];