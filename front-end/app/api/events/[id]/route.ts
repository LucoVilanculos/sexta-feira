import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return new NextResponse(error, { status: response.status });
    }

    return new NextResponse('Event deleted successfully', { status: 200 });
  } catch (error) {
    console.error('[EVENT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 