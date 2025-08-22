import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AppSidebar 
        className="h-screen border-r"
      />
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          
          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartAreaInteractive />
          </div>
        </div>
      </main>
    </div>
  )
}