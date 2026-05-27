import { DiagnosticProvider } from '@/components/diagnostic/DiagnosticProvider'
import { DiagnosticFlow } from '@/components/diagnostic/DiagnosticFlow'

export const metadata = {
  title: 'Business Diagnostic | MRT Consulting',
  description: 'Complete your structured business diagnostic assessment.',
}

export default function DiagnosticPage() {
  return (
    <DiagnosticProvider>
      <DiagnosticFlow />
    </DiagnosticProvider>
  )
}
