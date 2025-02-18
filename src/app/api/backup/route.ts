import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticación de admin
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    // Obtener todas las citas
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return new NextResponse(JSON.stringify(appointments, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=backup-${new Date().toISOString().split('T')[0]}.json`
      }
    })
  } catch (error) {
    return new NextResponse('Error generating backup', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verificar autenticación
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const data = await request.json()

    // Restaurar datos
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .not('id', 'is', null)

    if (deleteError) throw deleteError

    const { error: insertError } = await supabase
      .from('appointments')
      .insert(data)

    if (insertError) throw insertError

    return new NextResponse('Backup restored successfully')
  } catch (error) {
    return new NextResponse('Error restoring backup', { status: 500 })
  }
} 