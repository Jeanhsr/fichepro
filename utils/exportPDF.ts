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
  const margin = 20
  const contentW = pageW - margin * 2
  let y = 0

  // COULEURS
  const orange = [255, 92, 0] as [number, number, number]
  const black = [10, 10, 10] as [number, number, number]
  const gray = [100, 100, 100] as [number, number, number]
  const lightGray = [240, 240, 240] as [number, number, number]
  const green = [0, 200, 122] as [number, number, number]
  const white = [255, 255, 255] as [number, number, number]

  const addPage = () => {
    doc.addPage()
    y = margin
    // Ligne top décorative
    doc.setFillColor(...orange)
    doc.rect(0, 0, pageW, 2, 'F')
  }

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageH - margin) addPage()
  }

  const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
    doc.setFontSize(fontSize)
    return doc.splitTextToSize(text, maxWidth)
  }

  // ─── PAGE 1 HEADER ───────────────────────────────────────
  // Bande orange top
  doc.setFillColor(...orange)
  doc.rect(0, 0, pageW, 42, 'F')

  // Logo FichePro
  doc.setTextColor(...white)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FichePro', margin, 14)

  // Titre principal
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Fiche Produit', margin, 28)

  // Date
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(date, pageW - margin - doc.getTextWidth(date), 14)

  y = 55

  // ─── TITRE SEO ───────────────────────────────────────────
  doc.setFillColor(...lightGray)
  doc.roundedRect(margin, y - 5, contentW, 22, 3, 3, 'F')

  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('TITRE SEO', margin + 4, y + 2)

  doc.setTextColor(...black)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  const titreLines = wrapText(result.titre_seo, contentW - 8, 13)
  doc.text(titreLines, margin + 4, y + 9)
  y += 28

  // ─── PRIX ────────────────────────────────────────────────
  if (price) {
    doc.setFillColor(...orange)
    doc.roundedRect(margin, y, 50, 14, 2, 2, 'F')
    doc.setTextColor(...white)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(pricePromo || price, margin + 4, y + 9)

    if (pricePromo) {
      doc.setFillColor(255, 235, 235)
      doc.roundedRect(margin + 54, y, 35, 14, 2, 2, 'F')
      doc.setTextColor(200, 50, 50)
      doc.setFontSize(9)
      doc.text(`-${promoPercent}%  ${price}`, margin + 57, y + 9)
    }
    y += 22
  }

  // ─── DESCRIPTION COURTE ──────────────────────────────────
  checkPageBreak(30)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION COURTE', margin, y)
  y += 5

  doc.setTextColor(...black)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const shortLines = wrapText(result.description_courte, contentW, 10)
  doc.text(shortLines, margin, y)
  y += shortLines.length * 5 + 8

  // ─── DESCRIPTION LONGUE ──────────────────────────────────
  checkPageBreak(40)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION LONGUE', margin, y)
  y += 5

  doc.setTextColor(...black)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const longLines = wrapText(result.description_longue, contentW, 10)

  longLines.forEach((line: string) => {
    checkPageBreak(6)
    doc.text(line, margin, y)
    y += 5
  })
  y += 8

  // ─── POINTS FORTS ────────────────────────────────────────
  checkPageBreak(50)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('POINTS FORTS', margin, y)
  y += 6

  result.points_forts.forEach((pt) => {
    checkPageBreak(10)
    doc.setFillColor(...green)
    doc.circle(margin + 2, y - 1.5, 2, 'F')
    doc.setTextColor(...black)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const ptLines = wrapText(pt, contentW - 10, 10)
    doc.text(ptLines, margin + 7, y)
    y += ptLines.length * 5 + 3
  })
  y += 5

  // ─── META DESCRIPTION ────────────────────────────────────
  checkPageBreak(25)
  doc.setFillColor(245, 248, 255)
  doc.roundedRect(margin, y - 3, contentW, 22, 2, 2, 'F')
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('MÉTA-DESCRIPTION GOOGLE', margin + 4, y + 3)
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  const metaLines = wrapText(result.meta_description, contentW - 8, 9)
  doc.text(metaLines, margin + 4, y + 9)
  y += 26

  // ─── TAGS SEO ────────────────────────────────────────────
  checkPageBreak(20)
  doc.setTextColor(...orange)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('TAGS SEO', margin, y)
  y += 6

  let tagX = margin
  result.tags_seo.forEach((tag) => {
    const tagW = doc.getTextWidth(tag) + 8
    if (tagX + tagW > pageW - margin) { tagX = margin; y += 9 }
    checkPageBreak(10)
    doc.setFillColor(255, 245, 235)
    doc.roundedRect(tagX, y - 4, tagW, 7, 2, 2, 'F')
    doc.setTextColor(...orange)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(tag, tagX + 4, y)
    tagX += tagW + 4
  })
  y += 12

  // ─── FAQ ─────────────────────────────────────────────────
  if (result.faq && result.faq.length > 0) {
    checkPageBreak(20)
    doc.setFillColor(...orange)
    doc.rect(margin, y, contentW, 0.5, 'F')
    y += 8

    doc.setTextColor(...orange)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Questions Fréquentes', margin, y)
    y += 10

    result.faq.forEach((item, i) => {
      checkPageBreak(25)
      doc.setFillColor(...lightGray)
      doc.roundedRect(margin, y - 4, contentW, 8, 2, 2, 'F')
      doc.setTextColor(...black)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`${i + 1}. ${item.question}`, margin + 4, y + 1)
      y += 10

      doc.setTextColor(...gray)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const repLines = wrapText(item.reponse, contentW - 8, 9)
      repLines.forEach((line: string) => {
        checkPageBreak(6)
        doc.text(line, margin + 4, y)
        y += 5
      })
      y += 4
    })
  }

  // ─── AVIS CLIENTS ────────────────────────────────────────
  checkPageBreak(20)
  doc.setFillColor(...orange)
  doc.rect(margin, y, contentW, 0.5, 'F')
  y += 8

  doc.setTextColor(...orange)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Avis Clients', margin, y)
  y += 10

  result.avis_clients.forEach((avis) => {
    checkPageBreak(30)
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, y - 3, contentW, 22, 2, 2, 'F')

    doc.setTextColor(...black)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(avis.nom, margin + 4, y + 3)

    doc.setTextColor(255, 184, 0)
    doc.setFontSize(10)
    doc.text('★★★★★'.slice(0, avis.note), margin + 4, y + 10)

    doc.setTextColor(...gray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(avis.date, pageW - margin - doc.getTextWidth(avis.date), y + 3)

    const avisLines = wrapText(avis.commentaire, contentW - 8, 9)
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    doc.text(avisLines, margin + 4, y + 16)

    y += 26
  })

  // ─── FOOTER SUR CHAQUE PAGE ──────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(...lightGray)
    doc.rect(0, pageH - 10, pageW, 10, 'F')
    doc.setTextColor(...gray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Généré par FichePro — fichepro.vercel.app', margin, pageH - 4)
    doc.text(`Page ${i} / ${totalPages}`, pageW - margin - 15, pageH - 4)
  }

  // TÉLÉCHARGEMENT
  const filename = `fiche-${productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`
  doc.save(filename)
}
