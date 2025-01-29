import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HelpCircle } from "lucide-react"

interface NavbarProps {
  toolName: string
}

export function Navbar({ toolName }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-2xl font-bold">{toolName}</h1>
      </div>
      <div>
        <Button variant="default" about="Heyy"><HelpCircle /></Button>
      </div>
    </nav>
  )
}

