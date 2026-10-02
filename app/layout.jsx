import './globals.css';

export const metadata = {
  title: 'Pieza Exacta — Asistente de recambios',
  description: 'Información técnica, referencias OEM y equivalencias de recambios',
};

export default function RootLayout({ children }) {
  return <html lang="es" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "try{var t=localStorage.getItem('pe-theme');document.documentElement.dataset.theme=(t==='dark'||t==='\"dark\"')?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}" }} /></head><body>{children}</body></html>;
}
