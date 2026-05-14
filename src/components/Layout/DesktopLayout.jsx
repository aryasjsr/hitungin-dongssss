export default function DesktopLayout({ inputPanel, outputPanel }) {
  return (
    <main className="mx-auto hidden min-h-[calc(100vh-80px)] w-full max-w-[1440px] gap-6 p-6 lg:grid lg:grid-cols-[390px_minmax(0,1fr)] xl:p-8">
      <div className="min-w-0">
        {inputPanel}
      </div>
      <div className="min-w-0">
        {outputPanel}
      </div>
    </main>
  );
}
