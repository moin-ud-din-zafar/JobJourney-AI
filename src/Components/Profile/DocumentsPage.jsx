// src/Components/Profile/DocumentsPage.jsx
// Simple wrapper so any route/importing code that expects DocumentsPage keeps working.
// If you prefer, you can delete this file and import UploadCV directly where used.

import UploadCV from './UploadCV';
export default function DocumentsPage() {
  return <UploadCV />;
}
