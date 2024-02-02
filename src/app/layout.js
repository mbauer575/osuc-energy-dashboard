import './globals.css'


export const metadata = {
  title: 'Cascades Energy Dashboard',
  description: 'OSU Cascades Energy Monitoring Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
