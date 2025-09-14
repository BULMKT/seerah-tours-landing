import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, this would come from your database
    // For demo purposes, we'll return static data with some variation
    const baseMembers = 110;
    const variation = Math.floor(Math.random() * 5); // Random 0-4
    const currentMembers = baseMembers + variation;

    return NextResponse.json({
      currentMembers,
      totalGoal: 500,
      weeklyJoins: 23,
      cities: 15,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}