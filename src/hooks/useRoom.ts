import { useState, useEffect } from 'react'
import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type firebaseQuestions = Record<string, {
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighligted: boolean
  isAnswered: boolean
  likes: Record<string , {
    authorId: string
  }>
}>

type questionType = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighligted: boolean
  isAnswered: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<questionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: firebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map( ([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighligted: value.isHighligted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { questions, title }
}