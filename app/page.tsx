// Usage in a page or layout
// Page.js (or App.js)
import { HomePage } from "./pages/home/HomePage";

export default async function Page() {
  const endPointApi = 'http://localhost:8000/get-image-data'
  
  return (
    <main>
      <HomePage/>
    </main>
  );
}