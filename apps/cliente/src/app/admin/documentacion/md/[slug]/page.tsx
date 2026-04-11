import { readFile } from 'node:fs/promises'
import path from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpenText } from 'lucide-react'
import { AdminDocScroll } from '@/components/admin-doc-scroll'
import { getAdminDocBySlug } from '@/lib/admin-docs'

interface AdminDocMdPageProps {
  params: Promise<{ slug: string }>
}

function renderInlineMarkdown(text: string, keyBase: string) {
  const chunks: React.ReactNode[] = []
  const tokenPattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(text)) !== null) {
    const start = match.index
    if (start > lastIndex) {
      chunks.push(text.slice(lastIndex, start))
    }

    const [full] = match
    const linkLabel = match[1]
    const linkHref = match[2]
    const inlineCode = match[3]
    const bold = match[4]

    if (linkLabel && linkHref) {
      const safeHref = linkHref.trim()
      const isExternal = /^https?:\/\//i.test(safeHref)

      chunks.push(
        <a
          key={`${keyBase}-link-${start}`}
          href={safeHref}
          className="text-primary underline underline-offset-2 hover:text-primary/80"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
        >
          {linkLabel}
        </a>
      )
    } else if (inlineCode) {
      chunks.push(
        <code key={`${keyBase}-code-${start}`} className="rounded border border-white/10 bg-[rgba(255,255,255,0.06)] px-1 py-0.5 text-[12px] text-white">
          {inlineCode}
        </code>
      )
    } else if (bold) {
      chunks.push(
        <strong key={`${keyBase}-strong-${start}`} className="font-semibold text-white">
          {bold}
        </strong>
      )
    } else {
      chunks.push(full)
    }

    lastIndex = start + full.length
  }

  if (lastIndex < text.length) {
    chunks.push(text.slice(lastIndex))
  }

  return chunks
}

function pushParagraph(buffer: string[], keyBase: string, output: React.ReactNode[]) {
  const text = buffer.join(' ').trim()
  if (!text) return
  output.push(
    <p key={`${keyBase}-p`} className="text-sm leading-7 text-[var(--color-graylight)]">
      {renderInlineMarkdown(text, keyBase)}
    </p>
  )
  buffer.length = 0
}

function renderMarkdownBlocks(content: string) {
  const lines = content.split('\n')
  const output: React.ReactNode[] = []
  const paragraphBuffer: string[] = []

  let inCode = false
  let codeLang = ''
  let codeBuffer: string[] = []
  let listBuffer: string[] = []

  const flushList = (keyBase: string) => {
    if (!listBuffer.length) return
    output.push(
      <ul key={`${keyBase}-ul`} className="list-disc space-y-1 pl-6 text-sm leading-7 text-[var(--color-graylight)]">
        {listBuffer.map((item, index) => (
          <li key={`${keyBase}-li-${index}`}>{renderInlineMarkdown(item, `${keyBase}-li-${index}`)}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  const flushCode = (keyBase: string) => {
    if (!codeBuffer.length) return
    output.push(
      <div key={`${keyBase}-code-wrap`} className="space-y-2">
        {codeLang ? <p className="text-xs uppercase tracking-[0.12em] text-[var(--color-graylight)]">{codeLang}</p> : null}
        <pre className="overflow-auto border border-white/10 bg-[rgba(24,23,23,0.55)] p-4 text-xs leading-6 text-white">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      </div>
    )
    codeBuffer = []
    codeLang = ''
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.replace(/\r$/, '')
    const keyBase = `line-${index}`

    if (line.startsWith('```')) {
      if (inCode) {
        flushCode(keyBase)
        inCode = false
      } else {
        pushParagraph(paragraphBuffer, keyBase, output)
        flushList(keyBase)
        inCode = true
        codeLang = line.replace('```', '').trim()
      }
      return
    }

    if (inCode) {
      codeBuffer.push(line)
      return
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
    if (headingMatch) {
      pushParagraph(paragraphBuffer, keyBase, output)
      flushList(keyBase)
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()

      if (level === 1) {
        output.push(
          <h1 key={`${keyBase}-h1`} className="text-2xl font-semibold text-white">
            {renderInlineMarkdown(text, `${keyBase}-h1`)}
          </h1>
        )
        return
      }

      if (level === 2) {
        output.push(
          <h2 key={`${keyBase}-h2`} className="pt-2 text-xl font-semibold text-white">
            {renderInlineMarkdown(text, `${keyBase}-h2`)}
          </h2>
        )
        return
      }

      output.push(
        <h3 key={`${keyBase}-h3`} className="pt-1 text-base font-semibold text-white">
          {renderInlineMarkdown(text, `${keyBase}-h3`)}
        </h3>
      )
      return
    }

    if (/^\s*[-*]\s+/.test(line)) {
      pushParagraph(paragraphBuffer, keyBase, output)
      listBuffer.push(line.replace(/^\s*[-*]\s+/, '').trim())
      return
    }

    if (!line.trim()) {
      pushParagraph(paragraphBuffer, keyBase, output)
      flushList(keyBase)
      return
    }

    paragraphBuffer.push(line.trim())
  })

  pushParagraph(paragraphBuffer, 'end', output)
  flushList('end')
  if (inCode) flushCode('end')

  return output
}

export default async function AdminDocMdPage({ params }: AdminDocMdPageProps) {
  const { slug } = await params
  const doc = getAdminDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const filePath = path.resolve(process.cwd(), '..', '..', doc.path)
  const content = await readFile(filePath, 'utf-8').catch(() => null)

  if (!content) {
    notFound()
  }

  return (
    <section className="-mx-5 space-y-8 md:-mx-6">
      <div className="space-y-3 px-3 md:px-4">
        <Link href="/admin/documentacion" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
          <ArrowLeft size={14} aria-hidden="true" />
          Volver a documentacion
        </Link>
        <h2 className="section-title">{doc.title}</h2>
        <p className="text-sm text-[var(--color-graylight)]">Archivo: {doc.path}</p>
      </div>

      <div className="space-y-0">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 pb-2 text-sm text-[var(--color-graylight)] md:px-4">
          <BookOpenText size={15} className="text-primary" aria-hidden="true" />
          Lectura completa renderizada desde Markdown.
        </div>
        <AdminDocScroll footerText={`${doc.title} · ${doc.summary}`}>
          {renderMarkdownBlocks(content)}
        </AdminDocScroll>
      </div>
    </section>
  )
}
