import Home from './_home'

export { getStaticProps } from './_home'

export default function IndexPage(props) {
  return <Home {...props} />
}
