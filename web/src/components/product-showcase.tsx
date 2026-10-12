"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import type { paths } from "@/lib/api-types";
import { formatPrice, PartIcon, partTone } from "@/components/part-visual";

type Product = paths["/api/v1/products"]["get"]["responses"][200]["content"]["application/json"]["items"][number];

export function ProductShowcase({ products }: { products: Product[] }) {
  const featured = products.slice(0, 5);
  const [activeId, setActiveId] = useState(featured[0]?.id);
  const active = featured.find((product) => product.id === activeId) ?? featured[0];

  if (!active) return null;

  const inStock = active.stock_quantity > 0;

  return (
    <div className="showcase">
      <div className="showcase-tabs" role="tablist" aria-label="Featured parts">
        {featured.map((product) => {
          const selected = product.id === active.id;
          return (
            <button
              key={product.id}
              aria-controls="showcase-panel"
              aria-selected={selected}
              className="showcase-tab"
              id={`showcase-tab-${product.id}`}
              onClick={() => setActiveId(product.id)}
              role="tab"
              type="button"
            >
              <span className={`showcase-tab-art ${partTone(product.id)}`} aria-hidden="true">
                <PartIcon name={product.name} strokeWidth={1.3} />
              </span>
              <span className="showcase-tab-name">{product.name}</span>
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`showcase-tab-${active.id}`}
        className="showcase-panel"
        id="showcase-panel"
        role="tabpanel"
      >
        <div className={`showcase-stage ${partTone(active.id)}`} aria-hidden="true">
          <span className="showcase-stage-sku">{active.sku}</span>
          <PartIcon name={active.name} className="showcase-stage-icon" strokeWidth={0.9} key={active.id} />
        </div>
        <div className="showcase-copy">
          <span className="pill">{inStock ? "In stock" : "Out of stock"}</span>
          <h3>{active.name}</h3>
          <p>{active.description || "Details for this part are on the way."}</p>
          <dl className="showcase-facts">
            <div>
              <dt>Price</dt>
              <dd>{formatPrice(active.price)}</dd>
            </div>
            <div>
              <dt>Product code</dt>
              <dd>{active.sku}</dd>
            </div>
            <div>
              <dt>Available</dt>
              <dd>{inStock ? active.stock_quantity : "Check back soon"}</dd>
            </div>
          </dl>
          <a className="text-link" href="#shelf">
            See every part <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
