import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl md:text-3xl font-bold tracking-tight'>
          Analytics
        </h2>
        <p className='text-sm md:text-base text-muted-foreground'>
          Detailed analytics and insights for your business.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Total page views this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>45,231</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate</CardTitle>
            <CardDescription>Percentage of single-page visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>23.5%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
