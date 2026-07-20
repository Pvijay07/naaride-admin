import { NextResponse } from 'next/server';

export async function GET() {
  // Returns mock metrics matching the dashboard visual requirements
  const metrics = {
    ridesToday: 1420,
    gmv: 184500.50, // INR
    activeCaptains: 423,
    completionRate: 88.5, // %
    cancellationRate: 11.5, // %
    chartData: [
      { date: '07-02', rides: 1100 },
      { date: '07-03', rides: 1150 },
      { date: '07-04', rides: 1210 },
      { date: '07-05', rides: 980 },
      { date: '07-06', rides: 1050 },
      { date: '07-07', rides: 1300 },
      { date: '07-08', rides: 1410 },
      { date: '07-09', rides: 1380 },
      { date: '07-10', rides: 1450 },
      { date: '07-11', rides: 1520 },
      { date: '07-12', rides: 1120 },
      { date: '07-13', rides: 1290 },
      { date: '07-14', rides: 1390 },
      { date: '07-15', rides: 1420 },
    ],
  };

  return NextResponse.json({ success: true, data: metrics });
}
