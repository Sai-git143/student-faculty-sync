
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Users } from "lucide-react";

const QuickActions = [
  {
    title: "Join Discussion",
    description: "Engage with peers in academic discussions",
    icon: MessageSquare,
    href: "/discussions",
  },
  {
    title: "View Calendar",
    description: "Check upcoming events and schedules",
    icon: Calendar,
    href: "/events",
  },
  {
    title: "Browse Clubs",
    description: "Discover and join student organizations",
    icon: Users,
    href: "/clubs",
  },
];

const Index = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to UniSync
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your central hub for university discussions, events, and collaboration.
          </p>
          <div>
            <Button asChild>
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-8">
          {QuickActions.map((action) => (
            <div
              key={action.title}
              className="group relative overflow-hidden rounded-xl bg-background/50 p-6 border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <action.icon className="w-8 h-8 text-accent" />
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
                <Button variant="secondary" asChild>
                  <a href={action.href}>Get Started</a>
                </Button>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>
          <div className="bg-background/50 rounded-xl p-6 border">
            <p className="text-muted-foreground">
              Stay tuned for the latest university updates and announcements.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Index;
