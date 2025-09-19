import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase server environment variables")
}

// Server-side client with service role key for reliable connections
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Helper function to verify user session server-side
export async function verifyUserSession(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "No authorization header" }
  }

  const token = authHeader.split(" ")[1]

  try {
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(token)
    return { user, error }
  } catch (error) {
    return { user: null, error: "Invalid token" }
  }
}
