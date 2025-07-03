"use client"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sun } from "./icons/Sun"
import { Moon, Sun1 } from "iconsax-react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button size="icon" className="[&_svg]:size-[32px] px-0" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Moon
      size="32"
      color="#2D2D2D"
      variant="Outline" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Sun1
      size="62"
      color="#FFF"
      variant="Outline"
      className="absolute h-8 w-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
