'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Navbar } from '@/app/components/ui/navbar';
import { Calendar, MapPin, Send, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createAppointment } from '@/services/appointments';

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timePreference: '',
    location: '',
    message: ''
  });

  const timeOptions = [
    { value: 'morning', label: 'Morning' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validación específica para el teléfono
    if (name === 'phone') {
      // Solo permitir números y limitar a 20 caracteres
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 20);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone) {
          toast.error('Please fill in all fields before proceeding');
          return false;
        }
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        // Validar teléfono (solo números)
        if (!/^\d+$/.test(formData.phone)) {
          toast.error('Phone number must contain only numbers');
          return false;
        }
        return true;

      case 2:
        if (!formData.date || !formData.timePreference || !formData.location) {
          toast.error('Please fill in all fields before proceeding');
          return false;
        }
        // Validar fecha
        const selectedDate = new Date(formData.date);
        if (selectedDate < new Date()) {
          toast.error('Please select a future date');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validaciones básicas
      if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.timePreference || !formData.location) {
        toast.error('Por favor, completa todos los campos requeridos');
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor, ingresa un email válido');
        return;
      }

      // Validar teléfono (solo números y longitud mínima)
      if (!/^\d{10,}$/.test(formData.phone)) {
        toast.error('Por favor, ingresa un número de teléfono válido (mínimo 10 dígitos)');
        return;
      }

      // Validar fecha
      const selectedDate = new Date(formData.date);
      if (selectedDate < new Date()) {
        toast.error('La fecha debe ser futura');
        return;
      }

      toast.loading('Enviando solicitud...');

      // Preparar los datos para el servicio de citas
      const appointmentData = {
        client_name: formData.name,
        client_email: formData.email,
        phone: formData.phone,
        appointment_date: selectedDate,
        preferred_contact_time: formData.timePreference as 'morning' | 'afternoon' | 'evening',
        address: formData.location,
        notes: formData.message || ''
      };

      console.log('Enviando datos:', appointmentData);

      await createAppointment(appointmentData);
      
      toast.dismiss();
      toast.success('¡Cita agendada con éxito!');
      
      // Resetear el formulario
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        timePreference: '',
        location: '',
        message: ''
      });

    } catch (error) {
      console.error('Error detallado:', error);
      toast.dismiss();
      toast.error('Error al agendar la cita. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar alwaysShowBackground />
      
      {/* Hero Section con Parallax */}
      <div className="relative h-[50vh] overflow-hidden bg-night-lemon">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-[1920px] mx-auto px-4 sm:px-[50px] flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Let's Get in Touch
            </h1>
            <p className="text-lg text-white/90">
              Schedule a consultation with our experts and start transforming your space into something extraordinary.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-[50px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Columna del Formulario */}
          <div className="relative">
            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Indicador de Pasos estilo Stories */}
              <div className="flex items-center gap-2 mb-12 h-1">
                {[1, 2, 3].map((number) => (
                  <motion.div
                    key={number}
                    className={`h-full cursor-pointer ${step === number ? 'bg-night-lemon' : 'bg-gray-200'}`}
                    style={{
                      width: step === number ? '50%' : '25%',
                    }}
                    animate={{
                      width: step === number ? '50%' : '25%'
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setStep(number)}
                  />
                ))}
              </div>

              {/* Paso 1: Información Personal */}
              <motion.div 
                className={`space-y-6 ${step === 1 ? 'block' : 'hidden'}`}
                initial={false}
                animate={{ opacity: step === 1 ? 1 : 0 }}
              >
                <h2 className="text-2xl font-semibold text-night-lemon">Personal Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                      placeholder="(123) 456-7890"
                      maxLength={20}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Paso 2: Fecha y Hora */}
              <motion.div 
                className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}
                initial={false}
                animate={{ opacity: step === 2 ? 1 : 0 }}
              >
                <h2 className="text-2xl font-semibold text-night-lemon">Schedule Your Visit</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Preferred Time</label>
                    <select
                      name="timePreference"
                      value={formData.timePreference}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                    >
                      <option value="">Select a time preference</option>
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-night-lemon">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                        placeholder="Enter your address"
                      />
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Paso 3: Mensaje y Envío */}
              <motion.div 
                className={`space-y-6 ${step === 3 ? 'block' : 'hidden'}`}
                initial={false}
                animate={{ opacity: step === 3 ? 1 : 0 }}
              >
                <h2 className="text-2xl font-semibold text-night-lemon">Additional Details</h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-night-lemon">Your Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-night-lemon focus:border-transparent"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-night-lemon text-white h-12 flex items-center justify-center gap-2 group hover:bg-night-lemon/90 transition-colors"
                >
                  Send Request
                  <Send size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

              {/* Botones de Navegación */}
              <div className="flex justify-between mt-12">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-night-lemon font-medium"
                  >
                    Previous Step
                  </button>
                )}
                
                {step < 3 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto bg-night-lemon text-white px-6 h-12 flex items-center gap-2 group hover:bg-night-lemon/90 transition-colors"
                  >
                    Next Step
                    <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </motion.form>
          </div>

          {/* Columna de Información */}
          <div className="lg:sticky lg:top-[120px] space-y-8 self-start">
            <div className="bg-gray-50 p-8">
              <h3 className="text-xl font-semibold text-night-lemon mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="relative w-6 h-6 flex-shrink-0 mt-1">
                    <div className="absolute inset-0 bg-night-lemon/20 animate-ping" />
                    <div className="relative w-6 h-6 bg-night-lemon/10 flex items-center justify-center">
                      <span className="w-2 h-2 bg-night-lemon" />
                    </div>
                  </div>
                  <p className="text-silver-lemon">Expert consultation with our professional designers</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="relative w-6 h-6 flex-shrink-0 mt-1">
                    <div className="absolute inset-0 bg-night-lemon/20 animate-ping" />
                    <div className="relative w-6 h-6 bg-night-lemon/10 flex items-center justify-center">
                      <span className="w-2 h-2 bg-night-lemon" />
                    </div>
                  </div>
                  <p className="text-silver-lemon">Customized solutions tailored to your needs</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="relative w-6 h-6 flex-shrink-0 mt-1">
                    <div className="absolute inset-0 bg-night-lemon/20 animate-ping" />
                    <div className="relative w-6 h-6 bg-night-lemon/10 flex items-center justify-center">
                      <span className="w-2 h-2 bg-night-lemon" />
                    </div>
                  </div>
                  <p className="text-silver-lemon">Premium materials and exceptional craftsmanship</p>
                </li>
              </ul>
            </div>

            <div className="bg-night-lemon p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Need Immediate Assistance?</h3>
              <p className="text-white/90 mb-6">
                Our team is ready to help you with any questions you might have.
              </p>
              <a 
                href="tel:+18016618481"
                className="flex items-center gap-2 text-lg font-medium group"
              >
                <span className="group-hover:animate-phone-ring">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                    <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
                  </svg>
                </span>
                +1-801-661-8481
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 