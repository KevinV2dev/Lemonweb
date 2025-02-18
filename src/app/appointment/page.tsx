import { AppointmentForm } from '../components/ui/forms/appointment-form'

export default function AppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8 my-16 ">
      <h1 className="text-2xl font-bold mb-6 items-center flex justify-center">Schedule Appointment</h1>
      <div className="max-w-md mx-auto">
        <AppointmentForm />
      </div>
    </div>
  )
} 