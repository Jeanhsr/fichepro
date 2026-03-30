import { jsPDF } from 'jspdf'

interface Avis {
  nom: string
  note: number
  commentaire: string
  date: string
}

interface FaqItem {
  question: string
  reponse: string
}

interface FicheResult {
  titre_seo: string
  description_courte: string
  description_longue: string
  points_forts: string[]
  meta_description: string
  avis_clients: Avis[]
  tags_seo: string[]
  faq?: FaqItem[]
}

export function exportToPDF(result: FicheResult, productName: string, price: string, pricePromo: string | null, promoPercent: number) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 18
  const contentW = pageW - margin * 2
  let y = 0

  const orange = [255, 92, 0] as [number, number, number]
  const black = [10, 10, 10] as [number, number, number]
  const gray = [100, 100, 100] as [number, number, number]
  const lightGray = [242, 242, 242] as [number, number, number]
  const green = [0, 200, 122] as [number, number, number]
  const white = [255, 255, 255] as [number, number, number]

  const addPage = () => {
    doc.addPage()
    y = margin
    doc.setFillColor(...orange)
    doc.rect(0, 0, pageW, 2, 'F')
  }

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageH - 14) addPage()
  }

  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize)
    return doc.splitTextToSize(text, maxWidth)
  }

  // ─── HEADER ───────────────────────────────────────────
  doc.setFillColor(...orange)
  doc.rect(0, 0, pageW, 38, 'F')

  doc.setTextColor(...white)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('FichePro', margin, 13)

  doc.setFontSize(20)
  doc.text('Fiche Produit', margin, 26)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(date, pageW - margin - doc.getTextWidth(date), 13)

  // Nom produit dans le header
  const nomLines = wrapText(productName || result.titre_seo, contentW * 0.6, 9)
  doc.text(nomLines, pageW - margin - doc.getTextWidth(nomLines[0]), 24)

  y = 46

  // ─── TITRE SEO ────────────────────────────────────────
  doc.setFillColor(...lightGray)
  const titreLines = wrapText(result.titre_seo, contentW - 8, 12)
  const titreH = titreLines.length * 5 + 12
  doc.roundedRect(margin, y - 4, contentW, titreH, 3, 3, 'F')
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('TITRE SEO', margin + 4, y + 1)
  doc.setTextColor(...black)
  doc.setFontSize(12)
  doc.text(titreLines, margin + 4, y + 8)
  y += titreH + 6

  // ─── DESCRIPTION COURTE ──────────────────────────────
  checkPageBreak(25)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION COURTE', margin, y)
  y += 5
  doc.setTextColor(...black)
  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'normal')
  const shortLines = wrapText(result.description_courte, contentW, 9.5)
  doc.text(shortLines, margin, y)
  y += shortLines.length * 4.5 + 6

  // ─── DESCRIPTION LONGUE ──────────────────────────────
  checkPageBreak(30)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION LONGUE', margin, y)
  y += 5
  doc.setTextColor(...black)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const longLines = wrapText(result.description_longue, contentW, 9)
  longLines.forEach((line: string) => {
    checkPageBreak(5)
    doc.text(line, margin, y)
    y += 4.5
  })
  y += 5

  // ─── POINTS FORTS ─────────────────────────────────────
  checkPageBreak(30)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('POINTS FORTS', margin, y)
  y += 5
  result.points_forts.forEach((pt) => {
    checkPageBreak(8)
    doc.setFillColor(...green)
    doc.circle(margin + 2, y - 1.5, 1.8, 'F')
    doc.setTextColor(...black)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const ptLines = wrapText(pt, contentW - 8, 9)
    doc.text(ptLines, margin + 6, y)
    y += ptLines.length * 4.5 + 2
  })
  y += 4

  // ─── META DESCRIPTION ─────────────────────────────────
  checkPageBreak(20)
  doc.setFillColor(245, 248, 255)
  const metaLines = wrapText(result.meta_description, contentW - 8, 8.5)
  const metaH = metaLines.length * 4.5 + 12
  doc.roundedRect(margin, y - 3, contentW, metaH, 2, 2, 'F')
  doc.setTextColor(...orange)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('MÉTA-DESCRIPTION GOOGLE', margin + 4, y + 2)
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.text(metaLines, margin + 4, y + 8)
  y += metaH + 5

  // ─── TAGS SEO ─────────────────────────────────────────
  checkPageBreak(18)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('TAGS SEO', margin, y)
  y += 5
  let tagX = margin
  result.tags_seo.forEach((tag) => {
    doc.setFontSize(7.5)
    const tagW = doc.getTextWidth(tag) + 7
    if (tagX + tagW > pageW - margin) { tagX = margin; y += 8 }
    checkPageBreak(9)
    doc.setFillColor(255, 245, 235)
    doc.roundedRect(tagX, y - 3.5, tagW, 6.5, 1.5, 1.5, 'F')
    doc.setTextColor(...orange)
    doc.text(tag, tagX + 3.5, y)
    tagX += tagW + 3
  })
  y += 10

  // ─── FAQ ──────────────────────────────────────────────
  if (result.faq && result.faq.length > 0) {
    checkPageBreak(20)
    doc.setFillColor(...orange)
    doc.rect(margin, y, contentW, 0.5, 'F')
    y += 7
    doc.setTextColor(...orange)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Questions Fréquentes', margin, y)
    y += 8

    result.faq.slice(0, 3).forEach((item, i) => {
      checkPageBreak(18)
      doc.setFillColor(...lightGray)
      doc.roundedRect(margin, y - 3.5, contentW, 7.5, 2, 2, 'F')
      doc.setTextColor(...black)
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      const qShort = item.question.length > 80 ? item.question.slice(0, 80) + '...' : item.question
      doc.text(`${i + 1}. ${qShort}`, margin + 3, y + 1)
      y += 9
      doc.setTextColor(...gray)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      const repLines = wrapText(item.reponse, contentW - 6, 8)
      const repSlice = repLines.slice(0, 2)
      doc.text(repSlice, margin + 3, y)
      y += repSlice.length * 4 + 4
    })
  }

  // ─── AVIS CLIENTS ─────────────────────────────────────
  checkPageBreak(20)
  doc.setFillColor(...orange)
  doc.rect(margin, y, contentW, 0.5, 'F')
  y += 7
  doc.setTextColor(...orange)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Avis Clients', margin, y)
  y += 8

  result.avis_clients.slice(0, 2).forEach((avis) => {
    checkPageBreak(20)
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, y - 3, contentW, 18, 2, 2, 'F')
    doc.setTextColor(...black)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.text(avis.nom, margin + 3, y + 1)
    // Étoiles en texte unicode correct
    const stars = '★'.repeat(Math.min(5, avis.note)) + '☆'.repeat(Math.max(0, 5 - avis.note))
    doc.setTextColor(255, 184, 0)
    doc.setFontSize(9)
    doc.text(stars, margin + 3, y + 7)
    doc.setTextColor(...gray)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.text(avis.date, pageW - margin - doc.getTextWidth(avis.date), y + 1)
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(8)
    const avisLines = wrapText(avis.commentaire, contentW - 6, 8)
    doc.text(avisLines.slice(0, 1), margin + 3, y + 13)
    y += 22
  })

  // ─── FOOTER ───────────────────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(242, 242, 242)
    doc.rect(0, pageH - 10, pageW, 10, 'F')
    doc.setTextColor(...gray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Généré par FichePro — fichepro.vercel.app', margin, pageH - 4)
    doc.text(`Page ${i} / ${totalPages}`, pageW - margin - 12, pageH - 4)
  }

  const filename = `fiche-${(productName || 'produit').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`
  doc.save(filename)
}
