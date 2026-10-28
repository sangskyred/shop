"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import products from "../data/products";
import todayDeals from "../data/todayDeals";
import { getProductSearchText, matchesSearchText, normalizeSearchText } from "../lib/searchText";
import { nfc } from "../lib/text";
import { useLanguage } from "./LanguageProvider";

const searchableProducts = [...products, ...todayDeals];

const SearchForm = ({ initialQuery = "" }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const { t } = useLanguage();
  const normalizedQuery = normalizeSearchText(query.trim());

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const matches = searchableProducts
      .map((product) => ({
        ...product,
        displayName: product.title || product.name,
      }))
      .filter((product) => (
        matchesSearchText(getProductSearchText(product, t), normalizedQuery)
      ))
      .sort((left, right) => {
        const leftStartsWithQuery = normalizeSearchText(t(left.displayName)).startsWith(normalizedQuery);
        const rightStartsWithQuery = normalizeSearchText(t(right.displayName)).startsWith(normalizedQuery);
        return Number(rightStartsWithQuery) - Number(leftStartsWithQuery);
      });
    const uniqueSuggestions = new Map();

    for (const product of matches) {
      const key = normalizeSearchText(t(product.displayName));
      if (!uniqueSuggestions.has(key)) {
        uniqueSuggestions.set(key, product);
      }
    }

    return [...uniqueSuggestions.values()].slice(0, 8);
  }, [normalizedQuery, t]);

  const searchHref = (searchQuery) => `/s?k=${encodeURIComponent(searchQuery.trim())}`;
  const closeSuggestions = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };
  const handleKeyDown = (event) => {
    if (!isOpen || !normalizedQuery) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.min(currentIndex + 1, suggestions.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, -1));
    } else if (event.key === "Escape") {
      closeSuggestions();
    } else if (event.key === "Enter" && activeIndex >= 0) {
      const selectedProduct = suggestions[activeIndex];
      if (selectedProduct) {
        event.preventDefault();
        setQuery(t(selectedProduct.displayName));
        closeSuggestions();
        router.push(searchHref(t(selectedProduct.displayName)));
      } else if (activeIndex === suggestions.length) {
        event.preventDefault();
        closeSuggestions();
        router.push(searchHref(query));
      }
    }
  };

  return (
    <div className="search-form" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }}>
      <form
        action="/s"
        method="get"
        role="search"
        onSubmit={closeSuggestions}
      >
        <label className="sr-only" htmlFor="product-search">{t("Search products")}</label>
        <input
          id="product-search"
          name="k"
          type="search"
          placeholder={t("Search products")}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && normalizedQuery.length > 0}
          aria-controls="product-search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `product-suggestion-${activeIndex}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.nativeEvent.isComposing ? event.target.value : nfc(event.target.value));
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onCompositionEnd={(event) => setQuery(nfc(event.currentTarget.value))}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit">{t("Search")}</button>
      </form>
      {isOpen && normalizedQuery && (
        <div className="search-suggestions">
          <ul id="product-search-suggestions" role="listbox" aria-label={t("Search suggestions")}>
            {suggestions.length > 0 ? (
              suggestions.map((product, index) => (
                <li key={product.id} role="presentation">
                  <Link
                    id={`product-suggestion-${index}`}
                    className="search-suggestion"
                    href={searchHref(t(product.displayName))}
                    role="option"
                    aria-selected={activeIndex === index}
                    onClick={() => {
                      setQuery(t(product.displayName));
                      closeSuggestions();
                    }}
                  >
                    <span className="search-suggestion__name">{t(product.displayName)}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li role="presentation">
                <p className="search-suggestions__empty">{t("No products found.")}</p>
              </li>
            )}
            <li role="presentation">
              <Link
                className={`search-suggestions__all${activeIndex === suggestions.length ? " is-active" : ""}`}
                id={`product-suggestion-${suggestions.length}`}
                href={searchHref(query)}
                role="option"
                aria-selected={activeIndex === suggestions.length}
                onClick={closeSuggestions}
              >
                {t("View all results for")} “{query.trim()}”
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
