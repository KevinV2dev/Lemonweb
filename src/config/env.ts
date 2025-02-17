type EnvWindow = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

const getEnvVar = (key: keyof EnvWindow) => {
  if (typeof window !== 'undefined') {
    // Estamos en el cliente
    return process.env[key] || ''
  }
  
  // Estamos en el servidor
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? '',
  },
} 