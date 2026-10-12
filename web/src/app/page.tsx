import Link from "next/link";
import { ArrowDownRight, ArrowRight, CircuitBoard, Cog, DoorOpen, Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";

import { ProductSearch } from "@/components/product-search";
import { ProductShowcase } from "@/components/product-showcase";
import { getProducts } from "@/lib/api";

const faqs = [
  {
    question: "How do I find the right part?",
    answer:
      "Search the parts shelf by part name or product code (SKU). Each part shows its price and how many we have in stock right now.",
  },
  {
    question: "Is the stock figure up to date?",
    answer:
      "Yes. Stock is read from our catalogue every time the page loads, so what you see is what we have on the shelf.",
  },
  {
    question: "What if the part I need isn't listed?",
    answer:
      "We're adding quote requests for parts we don't stock. Until then, search by an alternative name or code, as many parts go by more than one.",
  },
  {
    question: "Where do you deliver?",
    answer: "We deliver lift parts to sites and workshops across the UK.",
  },
];

function Wordmark() {
  return (
    <span className="wordmark">
      Lift<em>Parts</em>
    </span>
  );
}

async function Catalogue() {
  await connection();
  const products = await getProducts().catch(() => null);

  if (!products || products.items.length === 0) {
    return (
      <section className="section shelf" id="parts">
        <p className="catalog-empty">Products are temporarily unavailable. Please check back shortly.</p>
      </section>
    );
  }

  return (
    <>
      <section className="section showcase-section" id="parts">
        <div className="section-heading">
          <p className="kicker">Our parts</p>
          <h2>
            Meet your new <em>favourites.</em>
          </h2>
        </div>
        <ProductShowcase products={products.items} />
      </section>

      <section className="section shelf" id="shelf">
        <div className="section-heading section-heading-split">
          <div>
            <p className="kicker">The parts shelf</p>
            <h2>
              Every part, <em>one search.</em>
            </h2>
          </div>
          <p className="section-aside">Search by part name or product code, then check price and stock.</p>
        </div>
        <ProductSearch products={products.items} />
      </section>
    </>
  );
}

export default function Home() {
  return (
    <div className="storefront">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <Link className="brand" href="#top" aria-label="Lift Parts home">
          <Wordmark />
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#parts">Our parts</a>
          <a href="#how">On the job</a>
          <a href="#questions">Good to know</a>
        </nav>
        <a className="pill-button" href="#shelf">
          Browse parts <ArrowRight size={15} aria-hidden="true" />
        </a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="kicker">Lift parts · UK</p>
            <h1>
              Keep every <em>lift moving.</em>
            </h1>
            <p className="hero-description">
              Replacement parts for Otis, Kone, Schindler, TK Elevator and more. Find the part, check the stock, get
              back to work.
            </p>
            <div className="hero-actions">
              <a className="pill-button" href="#shelf">
                Find your part <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="text-link" href="#parts">
                Meet the range <ArrowDownRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-stage" />
            <div className="hero-tile hero-tile-a tone-amber">
              <DoorOpen strokeWidth={1} />
              <span>Door gear</span>
            </div>
            <div className="hero-tile hero-tile-b tone-cream">
              <Cog strokeWidth={1} />
              <span>Drives & motors</span>
            </div>
            <div className="hero-tile hero-tile-c tone-mist">
              <CircuitBoard strokeWidth={1} />
              <span>Controls</span>
            </div>
          </div>

          <div className="hero-bottom">
            <span>Built for lift engineers</span>
            <span>Delivered across the UK</span>
          </div>
        </section>

        <section className="feature">
          <p className="kicker">Why Lift Parts</p>
          <h2>
            A little less downtime. <em>A lot less runaround.</em>
          </h2>
          <p>
            From the first search to the part in your hand, we keep it simple: clear prices, live stock and parts for
            the brands you service every day.
          </p>
        </section>

        <Suspense fallback={<p className="catalog-empty section">Loading the parts shelf…</p>}>
          <Catalogue />
        </Suspense>

        <section className="section routine" id="how">
          <div className="section-heading">
            <p className="kicker">On the job</p>
            <h2>
              Your workload. <em>Fewer delays.</em>
            </h2>
          </div>
          <div className="routine-grid">
            <article className="routine-card tone-steel">
              <span className="routine-time">Planned maintenance</span>
              <h3>
                Order ahead. <em>Arrive ready.</em>
              </h3>
              <p>Check what&apos;s in stock before the visit and turn up with the parts the job needs.</p>
              <a className="pill-button" href="#shelf">
                Browse parts <ArrowRight size={15} aria-hidden="true" />
              </a>
            </article>
            <article className="routine-card tone-amber">
              <span className="routine-time">Breakdown call-out</span>
              <h3>
                Lift down? <em>Find it fast.</em>
              </h3>
              <p>Search by the code on the old part and see the price and stock straight away.</p>
              <a className="pill-button pill-button-light" href="#shelf">
                Search by code <ArrowRight size={15} aria-hidden="true" />
              </a>
            </article>
          </div>
        </section>

        <section className="section faq" id="questions">
          <div className="section-heading">
            <p className="kicker">Good to know</p>
            <h2>
              Questions, <em>answered.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>
                  {faq.question}
                  <Plus className="faq-icon" size={20} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing">
          <h2>
            Good lifts start with <em>good parts.</em>
          </h2>
          <a className="pill-button pill-button-light" href="#shelf">
            Find your part <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand" href="#top" aria-label="Lift Parts home">
          <Wordmark />
        </Link>
        <p>Lift parts for the work that keeps us all moving.</p>
        <a className="text-link" href="#parts">
          Back to the range <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
