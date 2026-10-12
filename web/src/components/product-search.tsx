"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import type { paths } from "@/lib/api-types";
import { formatPrice, PartIcon, partTone } from "@/components/part-visual";

type Product = paths["/api/v1/products"]["get"]["responses"][200]["content"]["application/json"]["items"][number];

export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [product.sku, product.name, product.description]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <>
      <div className="part-search-wrap">
        <label className="part-search-label" htmlFor="part-search">
          Search by part name or SKU
        </label>
        <div className="part-search-control">
          <Search className="part-search-icon" size={19} aria-hidden="true" />
          <input
            autoComplete="off"
            id="part-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try HS-1002 or motor"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className="part-search-clear"
              onClick={() => setQuery("")}
              type="button"
            >
              <X size={17} aria-hidden="true" />
            </button>
          )}
        </div>
        <p aria-live="polite" className="part-search-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? "part" : "parts"}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="catalog-empty" role="status">
          No parts match “{query}”. Try a different name or product code.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const inStock = product.stock_quantity > 0;

            return (
              <article key={product.id} className="product-card">
                <div className={`product-art ${partTone(product.id)}`} aria-hidden="true">
                  <span className="product-art-sku">{product.sku}</span>
                  <PartIcon name={product.name} className="product-art-icon" strokeWidth={1} />
                </div>
                <div className="product-info">
                  <span className={inStock ? "stock stock-in" : "stock stock-out"}>
                    {inStock ? `In stock · ${product.stock_quantity} available` : "Out of stock"}
                  </span>
                  <h3>{product.name}</h3>
                  {product.description && <p>{product.description}</p>}
                  <div className="product-price-row">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    <span className="product-sku">SKU {product.sku}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
