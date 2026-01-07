"use client";
import { useState } from "react";
import BusinessCategoriesModal from "./modals/BusinessCategoriesModal";

export default function BusinessCategories({ data, onEditClick, token }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get current categories from business data
  // Categories can be in different locations depending on the data structure
  let currentCategories = [];

  // Try different possible locations for categories
  if (data?._embedded?.["wp:term"]?.[0]) {
    // WordPress REST API embedded taxonomy terms
    currentCategories = data._embedded["wp:term"][0];
  } else if (data?.categories) {
    // Direct categories property
    currentCategories = data.categories;
  } else if (data?.business_cat) {
    // ACF field
    currentCategories = data.business_cat;
  }

  const selectedCategories = currentCategories.map((cat) => ({
    value: cat.id || cat.term_id || cat,
    label: cat.name || cat.title || cat,
    id: cat.id || cat.term_id || cat,
    title: cat.title || cat.name || cat,
  }));

  return (
    <>
      <div className="card card_main uploads">
        <div className="card_title">Business Categories</div>
        <div className="buy_button_wrapper padded">
          <a
            href={`/api/auth/autologin-url?token=${encodeURIComponent(token)}`}
            target="_blank"
            rel="noopener"
          >
            Buy Extra Headings
          </a>
        </div>
        <div className="card_body">
          {selectedCategories.length > 0 ? (
            <div className="current_categories">
              <h4>Current Headings:</h4>
              <ul>
                {selectedCategories.map((category, index) => (
                  <li key={index}>{category.label}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no_categories">
              <p>No Headings assigned yet</p>
            </div>
          )}
        </div>
        <div className="card_footer">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn"
            style={{
              background: "none",
              border: "1px solid #ddd",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <BusinessCategoriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={data}
        onSave={onEditClick}
        loading={false}
      />
    </>
  );
}
