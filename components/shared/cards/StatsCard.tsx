import { Card, CardContent } from '@/components/ui/card';
import { Icon } from 'iconsax-react';

interface StatsCardProps {
  icon: Icon | any;
  value: string;
  label: string;
  iconColor: string;
  bgColor: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  iconColor,
  bgColor,
}: StatsCardProps) {
  return (
    <Card className='border-1 border-[var(--border-dark)] bg-[var(--card-background)] shadow-0 rounded-[20px]'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-[18px] font-bold text-[var(--text-dark)] mb-2'>
              {value}
            </p>
            <p className='text-base text-[var(--text-secondary)]'>{label}</p>
          </div>
          <div
            className={`w-10 h-10 rounded-[16px] ${bgColor} ${iconColor} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 `} color='currentcolor' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
