import React from 'react'

import { decrypt, deleteSession } from '@/lib/utils/sessionutil'
import { cookies } from 'next/headers'
import Dashboard from './page'

async function AdminLayout() {
    const cookieStore = cookies()
    const token = (await cookieStore).get('session')?.value
    const payload = await decrypt(token!)
    const role = payload?.role
    const isAdmin = role === 'admin'


    if (!isAdmin){
        // await deleteSession()
        // window.location.href = '/login'
        return null
    }

  return (
    <>
    <Dashboard />
    </>
  )
}

export default AdminLayout
