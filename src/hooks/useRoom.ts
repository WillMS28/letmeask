import { useState, useEffect } from 'react'
import { database } from '../services/firebase'

type firebaseQuestions = Record<string, {
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighligted: boolean
  isAnswered: boolean
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
}

export function useRoom(roomId: string) {
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
          isAnswered: value.isAnswered
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  return { questions, title }
}