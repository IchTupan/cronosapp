import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, Check, Settings, Bell } from "lucide-react";

export function AppSidebar({streak, cycles, todayCycles, todayMinutes, onResetCycles, darkMode, setDarkMode}) {
  return (
    <Sidebar className="hidden md:flex w-64 min-h-screen glass flex-col">
      <SidebarContent>
        {/* Branding */}
        <div className="flex flex-col gap-3 items-center py-8">
          <Bell className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl text-primary">FocoMente</span>
        </div>
        {/* Grupo de progresso */}
        <SidebarGroup>
          <SidebarGroupLabel>Progresso</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>
                    <Check className="inline w-5 h-5 mr-2 text-green-600" />
                    Streak: <b>{streak}</b>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>
                    <Calendar className="inline w-5 h-5 mr-2 text-blue-700" />
                    Ciclos hoje: <b>{todayCycles}</b>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>
                    ⏳ Foco: <b>{todayMinutes}</b> min
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Grupo de ações */}
        <SidebarGroup>
          <SidebarGroupLabel>Ações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="hover:underline" onClick={onResetCycles}>
                    Limpar contadores
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>
                    <Settings className="inline w-5 h-5 mr-2" />
                    Modo escuro
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={e => setDarkMode(e.target.checked)}
                      className="ml-2 scale-125"
                    />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-5 text-xs text-center text-muted-foreground">
        © {new Date().getFullYear()} FocoMente
      </SidebarFooter>
    </Sidebar>
  );
}
