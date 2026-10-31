import './globals.css'

export const metadata = {
  title: 'TopKey - Yo\'qolgan buyumni emas, egasini topamiz',
  description: 'QR va NFC texnologiyasi yordamida buyumlarni egasiga qaytarish tizimi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
