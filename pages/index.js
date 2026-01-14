import Home from '@/components/pages/home'

export { getStaticProps } from '@/components/pages/home'

export default function IndexPage(props) {
  return <Home {...props} />
}
