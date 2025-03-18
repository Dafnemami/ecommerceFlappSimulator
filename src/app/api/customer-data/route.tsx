import { NextRequest, NextResponse } from 'next/server';

// Endpoint: /api/customer-data

// Post customer data (ingresar datos)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json({ message: 'Datos ingresados correctamente' });
  }
  catch (error) {
    return NextResponse.json({ message: `Error al ingresar datos ${error}` }, { status: 500 });
  }

}


