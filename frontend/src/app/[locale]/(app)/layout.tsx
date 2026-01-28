import { Sidebar } from '@/components/layout/sidebar'

type Props = {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
