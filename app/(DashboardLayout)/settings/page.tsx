import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings interface would go here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
