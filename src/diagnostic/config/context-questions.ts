import type { ContextQuestion } from '../types'

export const contextQuestions: ContextQuestion[] = [
  {
    id: 'C1',
    field: 'sector',
    text: 'Which best describes your business?',
    options: [
      { id: 'professional_services', text: 'B2B Professional Services — consulting, legal, accounting, or advisory' },
      { id: 'technology', text: 'B2B Technology or Software' },
      { id: 'industrial', text: 'Industrial, Manufacturing, or Infrastructure' },
      { id: 'financial_services', text: 'Financial Services or Capital Markets' },
      { id: 'healthcare', text: 'Healthcare or Life Sciences' },
      { id: 'consumer', text: 'Consumer, Retail, or Hospitality' },
      { id: 'other', text: 'Other' },
    ],
  },
  {
    id: 'C2',
    field: 'scale',
    text: 'What is your approximate annual revenue?',
    options: [
      { id: 'under_10m', text: 'Under $10 million' },
      { id: '10_50m', text: '$10 million – $50 million' },
      { id: '50_150m', text: '$50 million – $150 million' },
      { id: '150_500m', text: '$150 million – $500 million' },
      { id: 'over_500m', text: 'Over $500 million' },
    ],
  },
  {
    id: 'C3',
    field: 'situation',
    text: 'Which best describes your current business situation?',
    options: [
      { id: 'growing_under_pressure', text: 'Growing, but margins or execution are under pressure' },
      { id: 'plateaued', text: 'Growth has plateaued and we cannot identify the next lever' },
      { id: 'declining', text: 'Performance is declining and the root cause is unclear' },
      { id: 'sensing_risk', text: 'Performance is adequate but leadership senses a risk ahead' },
      { id: 'transition', text: 'Preparing for a significant transition — exit, acquisition, or restructure' },
    ],
  },
  {
    id: 'C4',
    field: 'role',
    text: 'What is your primary role?',
    options: [
      { id: 'ceo', text: 'CEO, Managing Director, or Owner' },
      { id: 'coo', text: 'COO or Chief of Operations' },
      { id: 'cfo', text: 'CFO or Chief Financial Officer' },
      { id: 'commercial', text: 'Commercial, Sales, or Marketing Leader' },
      { id: 'board', text: 'Board Member or Investor' },
      { id: 'other', text: 'Other Senior Leader' },
    ],
  },
]
