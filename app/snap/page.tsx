import type { Metadata } from 'next'
import SnapClient from './client'

export const metadata: Metadata = {
  title: 'Lenis – Get smooth or die trying',
  description: 'A smooth scroll library fresh out of darkroom.engineering.',
}

export default function SnapPage() {
  return <SnapClient />
}
