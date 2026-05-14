export default function MobileLayout({ activeTab, inputPanel, outputPanel }) {
  return (
    <div className="min-h-[calc(100vh-80px)] max-w-full overflow-hidden p-4 pb-28 lg:hidden">
      {activeTab === 'input' ? inputPanel : outputPanel}
    </div>
  );
}
