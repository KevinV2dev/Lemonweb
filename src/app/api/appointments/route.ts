import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'
import { Resend } from 'resend'
import { z } from 'zod'

const appointmentSchema = z.object({
  client_name: z.string().min(1, 'El nombre es requerido'),
  client_email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  appointment_date: z.string().min(1, 'La fecha es requerida'),
  preferred_contact_time: z.enum(['morning', 'afternoon', 'evening']),
  address: z.string().min(1, 'La dirección es requerida'),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending')
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Datos recibidos:', body)
    
    // Validar los datos
    const validatedData = appointmentSchema.parse(body)
    console.log('Datos validados:', validatedData)
    
    const supabase = createClient()

    // Insertar cita en Supabase
    const { data: appointmentData, error: dbError } = await supabase
      .from('appointments')
      .insert([{
        ...validatedData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Error de base de datos:', dbError)
      return NextResponse.json(
        { error: 'Error al guardar la cita en la base de datos', details: dbError },
        { status: 500 }
      )
    }

    console.log('Cita creada:', appointmentData)

    // Enviar email de confirmación
    try {
      await resend.emails.send({
        from: 'Lemon <onboarding@resend.dev>',
        to: [validatedData.client_email],
        subject: 'Confirmación de cita - Lemon',
        html: `
          <h1>¡Gracias por agendar tu cita!</h1>
          <p>Detalles de tu cita:</p>
          <ul>
            <li>Nombre: ${validatedData.client_name}</li>
            <li>Fecha: ${new Date(validatedData.appointment_date).toLocaleString()}</li>
            <li>Horario preferido: ${validatedData.preferred_contact_time}</li>
            <li>Dirección: ${validatedData.address}</li>
          </ul>
          <p>Nos pondremos en contacto contigo pronto para confirmar los detalles.</p>
        `
      })
    } catch (emailError) {
      console.error('Error al enviar email:', emailError)
      // No retornamos error aquí porque la cita ya se guardó
    }

    return NextResponse.json({ 
      success: true, 
      data: appointmentData 
    })
  } catch (error) {
    console.error('Error general:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de cita inválidos', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al procesar la cita', details: error },
      { status: 500 }
    )
  }
}
