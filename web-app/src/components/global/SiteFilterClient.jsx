"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { IconSearch, IconX, IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function SiteFilterClient({ initialData }) {
  const router = useRouter();
  const { categories, towns, searchData } = initialData;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "All Categories",
  });
  const [selectedTown, setSelectedTown] = useState({
    id: "",
    name: "All Towns",
  });

  const [categorySearch, setCategorySearch] = useState("");
  const [townSearch, setTownSearch] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null); // 'category', 'town', 'search'

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const townRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        townRef.current &&
        !townRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    const term = categorySearch.toLowerCase();
    const filtered = categories.filter(
      (cat) =>
        cat.label?.toLowerCase().includes(term) ||
        cat.name?.toLowerCase().includes(term)
    );
    return filtered.slice(0, 50);
  }, [categorySearch, categories]);

  // Filter Towns
  const filteredTowns = useMemo(() => {
    const term = townSearch.toLowerCase();
    const filtered = towns.filter(
      (town) =>
        town.label?.toLowerCase().includes(term) ||
        town.name?.toLowerCase().includes(term)
    );
    return filtered.slice(0, 50);
  }, [townSearch, towns]);

  // High performance client-side filtering for search
  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return searchData
      .filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(term);
        const descMatch = item.description?.toLowerCase().includes(term);
        return titleMatch || descMatch;
      })
      .slice(0, 15);
  }, [searchTerm, searchData]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim() || selectedCategory.id || selectedTown.id) {
      const params = new URLSearchParams();
      if (searchTerm) params.set("q", searchTerm);
      if (selectedCategory.id) params.set("category", selectedCategory.id);
      if (selectedTown.id) params.set("town", selectedTown.id);

      router.push(`/search?${params.toString()}`);
      setActiveDropdown(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setActiveDropdown(null);
  };

  return (
    <div className="site_filter">
      <div className="container">
        <form className="filter_wrapper" onSubmit={handleSearchSubmit}>
          <div className="filters_group">
            {/* Category Filter */}
            <div className="filter_item searchable_filter" ref={categoryRef}>
              <div
                className="filter_display"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "category" ? null : "category"
                  )
                }
              >
                <span>{selectedCategory.name}</span>
                <div className="icon">
                  <IconChevronDown size={16} />
                </div>
              </div>

              {activeDropdown === "category" && (
                <div className="searchable_dropdown">
                  <div className="dropdown_search_input">
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="dropdown_list">
                    <div
                      className="dropdown_option"
                      onClick={() => {
                        setSelectedCategory({ id: "", name: "All Categories" });
                        setActiveDropdown(null);
                        setCategorySearch("");
                      }}
                    >
                      All Categories
                    </div>
                    {filteredCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="dropdown_option"
                        onClick={() => {
                          setSelectedCategory({
                            id: cat.id,
                            name: cat.label || cat.name,
                          });
                          setActiveDropdown(null);
                          setCategorySearch("");
                        }}
                      >
                        {cat.label || cat.name}
                      </div>
                    ))}
                    {filteredCategories.length === 0 && (
                      <div className="dropdown_no_results">
                        No categories found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Town Filter */}
            <div className="filter_item searchable_filter" ref={townRef}>
              <div
                className="filter_display"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "town" ? null : "town")
                }
              >
                <span>{selectedTown.name}</span>
                <div className="icon">
                  <IconChevronDown size={16} />
                </div>
              </div>

              {activeDropdown === "town" && (
                <div className="searchable_dropdown">
                  <div className="dropdown_search_input">
                    <input
                      type="text"
                      placeholder="Search towns..."
                      value={townSearch}
                      onChange={(e) => setTownSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="dropdown_list">
                    <div
                      className="dropdown_option"
                      onClick={() => {
                        setSelectedTown({ id: "", name: "All Towns" });
                        setActiveDropdown(null);
                        setTownSearch("");
                      }}
                    >
                      All Towns
                    </div>
                    {filteredTowns.map((town) => (
                      <div
                        key={town.id}
                        className="dropdown_option"
                        onClick={() => {
                          setSelectedTown({
                            id: town.id,
                            name: town.label || town.name,
                          });
                          setActiveDropdown(null);
                          setTownSearch("");
                        }}
                      >
                        {town.label || town.name}
                      </div>
                    ))}
                    {filteredTowns.length === 0 && (
                      <div className="dropdown_no_results">No towns found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search_box_wrapper" ref={searchRef}>
            <div className="search_input_group">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveDropdown("search");
                }}
                onFocus={() => setActiveDropdown("search")}
              />
              <button type="submit" className="search_btn">
                <IconSearch className="search_icon" size={20} />
              </button>
            </div>

            {/* Quick Search Dropdown */}
            {activeDropdown === "search" && filteredResults.length > 0 && (
              <div className="search_dropdown">
                {filteredResults.map((item, index) => (
                  <Link
                    key={item.id || index}
                    href={
                      item.type === "business"
                        ? `/business/${item.slug}`
                        : `/search?category=${item.id}`
                    }
                    className="dropdown_item"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="item_info">
                      <span
                        className="item_title"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <span className="item_type">{item.type}</span>
                    </div>
                  </Link>
                ))}
                <div
                  className="dropdown_footer"
                  onClick={() => handleSearchSubmit()}
                >
                  See all results for "{searchTerm}"
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
