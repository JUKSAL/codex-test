import Calculator from "../components/Calculator";

export default function Home() {
  return (
    <main className="app-shell">
      <section className="calculator-card">
        <header className="calculator-header">
          <h1 className="app-title">Calculator</h1>
          <p className="app-subtitle">A tidy four-column layout with quick math tools.</p>
        </header>
        <Calculator />
      </section>
    </main>
  );
}
