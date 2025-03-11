// Usage in a page or layout
// Page.js (or App.js)
import ServerComponent from "./components/server/image_display/ImageDisplay";
import ClientComponent from "./components/client/image_display/ImageDisplay";

export default async function Page() {
  const endPointApi = 'http://localhost:8000/get-image-data'
  
  return (
    <main>
      <h1>Next.js Server and Client Components Demo</h1>
      <ClientComponent>
        {/* ServerComponent is rendered on the server and passed to ClientComponent */}
        <ServerComponent endPointApi={endPointApi} />
      </ClientComponent>
    </main>
  );
}