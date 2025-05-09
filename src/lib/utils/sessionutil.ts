import {SignJWT, jwtVerify} from 'jose'
import Session from '@/models/Session'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET_KEY
const secret = new TextEncoder().encode(secretKey!)
const alg = 'HS256'
const exp = '2h' // 2 hours expiration time

export const encrypt = async (payload:{
    userId: string,
    email: string,
    names: string,
    role: string,
}) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(secret)
}


export const decrypt = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: [alg],  
        })
        return payload
    } catch (error) {
        console.error('JWT decryption failed:', error)
        return null
    }
}


export const createSession = async (userId: string, email: string, names: string, role: string)  => {
    try {
        const session = {
            userId,
            email,
            names,
            role,
            token: await encrypt({ userId, email, names, role }),
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            createdAt: new Date(),
        }
           
        const cookieSession = await encrypt({
            userId: session.userId,
            email: session.email,
            names: session.names,
            role: session.role,
        })

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 2, // 2 hours
            sameSite: 'lax' as const,
        }

        ;(await cookies()).set('session', cookieSession, cookieOptions)

        await Session.create(session)
        return session
    } catch (error) {
        console.error('Error creating session:', error)
        throw new Error('Session creation failed')
    }
}

export const getSession = async () => {
    try {
        const token = (await cookies()).get('session')?.value
        if (!token) return null
        const session = await decrypt(token)
        if (!session) return null
        return session
    } catch (error) {
        console.error('Error getting session:', error)
        return null
    }
}
export const deleteSession = async () => {
    try {
        (await cookies()).delete('session')
        // await Session.delete
//         return true
    } catch (error) {
        console.error('Error deleting session:', error)
        return false
    }
}
