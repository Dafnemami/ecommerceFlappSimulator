import { NextRequest, NextResponse } from 'next/server';

// Endpoint: /api/customer-data


// Post customer data (ingresar datos)
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = await request.json();
    // p. guardar datos 
    return NextResponse.json({ message: 'Datos ingresados correctamente' });
  }
  catch (error) {
    return NextResponse.json({ message: `Error al ingresar datos ${error}` }, { status: 500 });
  }

}


