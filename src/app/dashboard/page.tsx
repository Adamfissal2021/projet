import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EquationSolver from "@/components/math-tools/equation-solver";
import ChartPanel from "@/components/data-visualization/chart-panel";
import CSVUpload from "@/components/data-import/csv-upload";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Math & Statistics Analysis Dashboard
            </h1>
            <p className="text-muted-foreground">
              Perform mathematical calculations and visualize data with
              interactive tools
            </p>
          </header>

          <Tabs defaultValue="math" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="math">Math Tools</TabsTrigger>
              <TabsTrigger value="visualization">
                Data Visualization
              </TabsTrigger>
              <TabsTrigger value="import">Data Import</TabsTrigger>
            </TabsList>

            <TabsContent value="math" className="space-y-4">
              <EquationSolver />
            </TabsContent>

            <TabsContent value="visualization" className="space-y-4">
              <ChartPanel />
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <CSVUpload />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
