import GTHLAssistant from '../../components/GTHLAssistant';

export const metadata = {
  title: 'GTHL Rules Assistant | Strategy Sequence',
  description: 'Ask any question about GTHL or Hockey Canada rules. Powered by the official 2025-26 rulebook.',
};

export default function GTHLRulesPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#111827',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '680px' }}>
        <GTHLAssistant />
      </div>
    </main>
  );
}
