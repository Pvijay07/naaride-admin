import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse bg-asphalt/10 border-1 border-dashed border-asphalt/20', className)}
      {...props}
    />
  );
}
