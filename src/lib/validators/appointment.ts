import { z } from 'zod';

export const appointmentSchema = z.object({
  client_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  client_email: z.string().email('Email inválido'),
  appointment_date: z.date().min(new Date(), 'La fecha debe ser futura'),
  service: z.string().min(1, 'Debe seleccionar un servicio'),
  notes: z.string().optional()
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
