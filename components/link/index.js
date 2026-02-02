import NextLink from 'next/link'
import { useMemo } from 'react'

const SHALLOW_URLS = ['?demo=true']

/**
 * @param {Object} props
 * @param {string} [props.href]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {boolean} [props.scroll]
 * @param {boolean} [props.shallow]
 * @param {React.Ref} [props.ref]
 */
export function Link({
  href,
  children,
  className,
  scroll,
  shallow,
  ref,
  ...props
}) {
  const attributes = {
    ref,
    className,
    ...props,
  }

  const isProtocol = useMemo(
    () => href?.startsWith('mailto:') || href?.startsWith('tel:'),
    [href]
  )

  const needsShallow = useMemo(
    () => !!SHALLOW_URLS.find((url) => href?.includes(url)),
    [href]
  )

  const isAnchor = useMemo(() => href?.startsWith('#'), [href])
  const isExternal = useMemo(() => href?.startsWith('http'), [href])

  if (typeof href !== 'string') {
    return <button {...attributes}>{children}</button>
  }

  if (isProtocol || isExternal) {
    return (
      <a {...attributes} href={href} target="_blank">
        {children}
      </a>
    )
  }

  return (
    <NextLink
      href={href}
      passHref={isAnchor}
      shallow={needsShallow || shallow}
      scroll={scroll}
      {...attributes}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {children}
    </NextLink>
  )
}
