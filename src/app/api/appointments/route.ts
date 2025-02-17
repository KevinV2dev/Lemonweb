import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Insertar cita en Supabase
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([data])

    if (dbError) throw dbError

    // Enviar email de confirmación
    await resend.emails.send({
      from: 'Lemon <onboarding@resend.dev>',
      to: [data.client_email],
      subject: 'Confirmación de cita - Lemon',
      html: `
        <h1>¡Gracias por agendar tu cita!</h1>
        <p>Detalles de tu cita:</p>
        <ul>
          <li>Fecha: ${new Date(data.appointment_date).toLocaleString()}</li>
          <li>Servicio: ${data.service}</li>
        </ul>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la cita' },
      { status: 500 }
    )
  }
}
