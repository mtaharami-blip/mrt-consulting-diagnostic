'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type {
  DiagnosticState,
  DiagnosticAction,
  DiagnosticOutput,
  CategoryId,
  ContextAnswers,
} from '@/diagnostic/types'
import { getQuestionsForFlow } from '@/diagnostic/config/questions'

const initialState: DiagnosticState = {
  step: 'intro',
  contactInfo: null,
  context: {},
  focusAreas: [],
  answers: {},
  questionIndex: 0,
  sessionId: null,
  output: null,
}

function reducer(state: DiagnosticState, action: DiagnosticAction): DiagnosticState {
  switch (action.type) {
    case 'RESTORE_STATE':
      return action.state
    case 'SET_CONTACT_INFO':
      return { ...state, contactInfo: action.info }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_CONTEXT':
      return {
        ...state,
        context: { ...state.context, [action.field]: action.value },
      }
    case 'NEXT_STEP': {
      // Focus step removed — all questions are universal in the new architecture.
      // 'focus' is kept in DiagnosticStep type for backward compat with stored sessions
      // but is never entered in new flows.
      const stepOrder: DiagnosticState['step'][] = [
        'intro', 'context', 'questions', 'contact', 'processing', 'done',
      ]
      const current = stepOrder.indexOf(state.step)
      if (current === -1) {
        // State from an old session that had 'focus' — skip to questions
        return { ...state, step: 'questions', questionIndex: 0 }
      }
      const next = stepOrder[current + 1] ?? 'done'
      return { ...state, step: next, questionIndex: 0 }
    }
    case 'SET_FOCUS_AREAS':
      return { ...state, focusAreas: action.areas }
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answerId },
      }
    case 'NEXT_QUESTION':
      return { ...state, questionIndex: state.questionIndex + 1 }
    case 'PREV_QUESTION':
      return { ...state, questionIndex: Math.max(0, state.questionIndex - 1) }
    case 'SET_PROCESSING':
      return { ...state, step: 'processing' }
    case 'SET_DONE':
      return { ...state, step: 'done', sessionId: action.sessionId, output: action.output }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface DiagnosticContextValue {
  state: DiagnosticState
  dispatch: React.Dispatch<DiagnosticAction>
  currentQuestions: ReturnType<typeof getQuestionsForFlow>
  totalQuestions: number
  isLastQuestion: boolean
  progressPercent: number
}

const DiagnosticContext = createContext<DiagnosticContextValue | null>(null)

const STORAGE_KEY = 'arpus_diagnostic_state'

export function DiagnosticProvider({ children }: { children: React.ReactNode }) {
  // Always start from initialState so the server render and first client render match.
  // Restoring from sessionStorage happens in a useEffect, after hydration, to avoid
  // the "server/client HTML mismatch" hydration error.
  const [state, dispatch] = useReducer(reducer, initialState)

  // Restore persisted state after hydration (runs once, client-only)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as DiagnosticState
        dispatch({ type: 'RESTORE_STATE', state: parsed })
      }
    } catch {
      // ignore corrupt or missing storage
    }
  }, [])

  // Persist to sessionStorage on every subsequent change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const currentQuestions = getQuestionsForFlow(state.focusAreas)
  const totalQuestions = currentQuestions.length
  const isLastQuestion = state.questionIndex >= totalQuestions - 1

  // Progress: context (10%) → questions (15–80%) → contact (85%) → processing (92%)
  let progressPercent = 0
  if (state.step === 'intro') progressPercent = 0
  else if (state.step === 'context') progressPercent = 10
  else if (state.step === 'focus') progressPercent = 15  // legacy state compat
  else if (state.step === 'questions') {
    const qProgress = totalQuestions > 0 ? state.questionIndex / totalQuestions : 0
    progressPercent = 15 + Math.round(qProgress * 65)
  } else if (state.step === 'contact') progressPercent = 85
  else if (state.step === 'processing') progressPercent = 92
  else if (state.step === 'done') progressPercent = 100

  return (
    <DiagnosticContext.Provider
      value={{
        state,
        dispatch,
        currentQuestions,
        totalQuestions,
        isLastQuestion,
        progressPercent,
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  )
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext)
  if (!ctx) throw new Error('useDiagnostic must be used within DiagnosticProvider')
  return ctx
}
