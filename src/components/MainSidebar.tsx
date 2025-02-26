
import {
  Home,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  Briefcase,
  GraduationCap,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Discussions", icon: MessageSquare, url: "/discussions" },
  { title: "Events", icon: Calendar, url: "/events" },
  { title: "Clubs", icon: Users, url: "/clubs" },
  { title: "Announcements", icon: Bell, url: "/announcements" },
  { title: "Career", icon: Briefcase, url: "/career" },
  { title: "Alumni", icon: GraduationCap, url: "/alumni" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-primary">UniSync</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
