// openssl rand -base64 32
import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

//session payload
export interface SessionPayload extends JWTPayload  {
  userId: string;
  email: string;
  name: string;
  role: string; // e.g., "user" or "admin"
}

const secretKey = process.env.SESSION_SECRET
if (!secretKey) {
  throw new Error('SESSION_SECRET must be set in production environment')
}
const encodedKey = new TextEncoder().encode(secretKey)
 

  // Encrypts the session payload into a JWT token.
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS512' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(encodedKey)
}
 
// decrypting the session
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS512'],
    })
    return payload
  } catch {
    console.log('Failed to verify session')
  }
}

// creating session
export async function createSession(userId: string, email: string, name: string, role: string) {
    const expiresAt = new Date(Date.now() +  24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, email, name, role, exp: Math.floor(expiresAt.getTime() / 1000) })
    const cookieStore = await cookies()
   
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })
  }

//   update session when refreshed
export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)
   
    if (!session || !payload) {
      return null
    }
   
    const expires = new Date(Date.now() +  24 * 60 * 60 * 1000)
   
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
    })
  }

//   deleting session
export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
  }
