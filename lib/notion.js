// https://developers.notion.com/reference/rich-text
//
// Rich Text Renderer for Notion API
//
// Usage examples:
//
// 1. Render rich text as React component:
//    import { RichText } from '@/lib/notion'
//    <RichText richText={page.properties.title.rich_text} />
//
// 2. Render with a wrapper element (string or component):
//    <RichText
//      richText={page.properties.description.rich_text}
//      wrapper="p"
//      className="my-class"
//    />
//    // or with a custom component:
//    <RichText
//      richText={page.properties.description.rich_text}
//      wrapper={MyCustomComponent}
//      className="my-class"
//    />
//
// 3. Get plain text only:
//    import { getPlainText } from '@/lib/notion'
//    const title = getPlainText(page.properties.title.rich_text)

import React from 'react'
import { Link } from '@/components/link'

// function addUtmSource(url) {
//   if (!url) return url
//   const separator = url.includes('?') ? '&' : '?'
//   return `${url}${separator}utm_source=lenis.dev`
// }

/**
 * Renders a single rich text object with all annotations and formatting
 * @param {Object} richText - A single rich text object from Notion API
 * @param {number} index - Index for React keys
 * @returns {React.ReactElement}
 */
function RichTextElement({ richText }) {
  const { type, plain_text, href } = richText
  //   const { bold, italic, strikethrough, underline, code, color } = annotations

  // Build className for annotations
  //   const annotationClasses = cn({
  //     'rich-text-bold': bold,
  //     'rich-text-italic': italic,
  //     'rich-text-strikethrough': strikethrough,
  //     'rich-text-underline': underline,
  //     'rich-text-code': code,
  //     [`rich-text-color-${color}`]: color && color !== 'default',
  //   })

  // Render based on type
  let content = null

  switch (type) {
    //   case 'text': {
    //     const textContent = (richText.text?.content || plain_text).trim()
    //     //   const link = richText.text?.link
    //     // Use top-level href if available, otherwise use link.url
    //     const href = richText.href

    //     if (href) {
    //       content = textContent && (
    //         <Link href={`${href}?utm_source=lenis.dev/showcase`}>
    //           {textContent}
    //         </Link>
    //       )
    //     } else {
    //       content = textContent && <span>{textContent}</span>
    //     }
    //     break
    //   }

    //   case 'mention': {
    //     const mention = richText.mention
    //     let mentionContent = plain_text

    //     switch (mention.type) {
    //       case 'user':
    //         mentionContent = mention.user?.name || '@Anonymous'
    //         break
    //       case 'page':
    //         mentionContent = plain_text || 'Untitled'
    //         break
    //       case 'database':
    //         mentionContent = plain_text || 'Untitled'
    //         break
    //       case 'date': {
    //         const date = mention.date
    //         if (date.end) {
    //           mentionContent = `${date.start} → ${date.end}`
    //         } else {
    //           mentionContent = date.start
    //         }
    //         break
    //       }
    //       case 'link_preview':
    //         mentionContent = mention.link_preview?.url || plain_text
    //         break
    //       case 'template_mention': {
    //         const template = mention.template_mention
    //         if (template.type === 'template_mention_date') {
    //           mentionContent =
    //             template.template_mention_date === 'today' ? '@Today' : '@Now'
    //         } else if (template.type === 'template_mention_user') {
    //           mentionContent = '@Me'
    //         }
    //         break
    //       }
    //       default:
    //         mentionContent = plain_text
    //     }

    //     if (href) {
    //       content = mentionContent && (
    //         <Link href={`${href}?utm_source=lenis.dev/showcase`}>
    //           {mentionContent}
    //         </Link>
    //       )
    //     } else {
    //       content = mentionContent && <span>{mentionContent}</span>
    //     }
    //     break
    //   }

    //   case 'equation': {
    //     const expression = richText.equation?.expression || plain_text
    //     // For equations, you might want to use a library like KaTeX or MathJax
    //     // For now, we'll render it as a code block with LaTeX
    //     if (href) {
    //       content = expression && (
    //         <Link href={`${href}?utm_source=lenis.dev/showcase`}>
    //           {expression}
    //         </Link>
    //       )
    //     } else {
    //       content = expression && <span>{expression}</span>
    //     }
    //     break
    //   }

    default:
      // Fallback to plain text
      if (href) {
        content = plain_text && (
          <Link
            href={
              href.includes('?aff=') ? href : `${href}?utm_source=lenis.dev`
            }
          >
            {plain_text}
          </Link>
        )
      } else {
        content = plain_text.trim(' ') ? (
          <span>,{plain_text}</span>
        ) : (
          <span>,&nbsp;</span>
        )
      }
  }

  return content
}

/**
 * Renders an array of rich text objects from Notion API
 * @param {Object} props - Component props
 * @param {Array} props.richText - Array of rich text objects from Notion API
 * @returns {React.ReactElement}
 */
export function RichText({ richText }) {
  if (!(richText && Array.isArray(richText)) || richText.length === 0) {
    return null
  }

  const elements = richText.map((text, index) => (
    <RichTextElement key={index} richText={text} index={index} />
  ))

  // Otherwise, it's a React component
  return elements
}

/**
 * Simple function that returns plain text from rich text array
 * @param {Array} richText - Array of rich text objects
 * @returns {string}
 */
export function renderRichText(richText) {
  if (!(richText && Array.isArray(richText))) {
    return ''
  }
  console.log('richText', richText)
  return richText.map((text) => text.plain_text || '').join('')
}

/**
 * Extract plain text from rich text array
 * @param {Array} richText - Array of rich text objects
 * @returns {string}
 */
export function getPlainText(richText) {
  return renderRichText(richText)
}
