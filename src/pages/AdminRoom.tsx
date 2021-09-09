import { useParams, useHistory } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import CheckImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Questions'

import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>()

  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswared(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })

  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighligted: true
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map( question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighligted={question.isHighligted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type='button'
                      onClick={() => handleCheckQuestionAsAnswared(question.id)}
                    >
                      <img src={CheckImg} alt="Marcar pergunta como respondida" />
                    </button>

                    <button
                      type='button'
                      onClick={() => handleHighLightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="dar destaque a pergunta" />
                    </button>
                  </>
                )}

                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Deletar mensagem" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
