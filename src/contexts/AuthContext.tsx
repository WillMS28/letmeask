import { createContext, ReactNode, useState, useEffect } from "react"

import { auth, firebase } from '../services/firebase'

type user = {
  id: string
  name:string
  avater:string
}

type AuthContextType = {
  user: user | undefined
  signInWithGoogle:() => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<user>()

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged( user => {
      
      if (user) {
        const { displayName, photoURL, uid } = user
  
        if (!displayName || !photoURL) {
           throw new Error('Missing information from google account')
        }
  
        setUser({
          id: uid,
          name: displayName,
          avater: photoURL
        })
      }

      return() => {
        unsubcribe()
      }
    })
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
         throw new Error('Missing information from google account')
      }

      setUser({
        id: uid,
        name: displayName,
        avater: photoURL
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}