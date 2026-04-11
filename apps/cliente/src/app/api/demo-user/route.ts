import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      message: 'Demo access disabled',
    },
    { status: 410 }
  )
}

export async function POST() {
  return NextResponse.json(
    {
      message: 'Demo access disabled',
    },
    { status: 410 }
  )
}
