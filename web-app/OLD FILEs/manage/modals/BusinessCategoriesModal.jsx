"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import Link from "next/link";
import { getBusinessCategories } from "@/lib/endpoints/json/json";

export default function BusinessCategoriesModal({
  isOpen,
  onClose,
  data,
  onSave,
  loading,
}) {
  const [businessCategories, setBusinessCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch business categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesResponse = await getBusinessCategories();
        const categories = categoriesResponse.map((cat) => ({
          value: cat.id,
          label: cat.title || cat.name,
          id: cat.id,
          title: cat.title || cat.name,
        }));
        setBusinessCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Set current categories when modal opens
  useEffect(() => {
    if (isOpen && data) {
      // Get current categories from business data
      let currentCategories = [];

      // Try different possible locations for categories
      if (data._embedded?.["wp:term"]?.[0]) {
        // WordPress REST API embedded taxonomy terms
        currentCategories = data._embedded["wp:term"][0];
      } else if (data.categories) {
        // Direct categories property
        currentCategories = data.categories;
      } else if (data.business_cat) {
        // ACF field
        currentCategories = data.business_cat;
      }

      const mappedCategories = currentCategories.map((cat) => ({
        value: cat.id || cat.term_id || cat,
        label: cat.name || cat.title || cat,
        id: cat.id || cat.term_id || cat,
        title: cat.title || cat.name || cat,
      }));

      setSelectedCategories(mappedCategories);
    }
  }, [isOpen, data]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCategories || selectedCategories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    if (selectedCategories && selectedCategories.length > 3) {
      newErrors.categories = "You can select a maximum of 3 categories";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        business_cat: selectedCategories.map((cat) => cat.value),
      };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error updating Headings:", error);
      alert("Failed to update Headings. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedCategories([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Update Business headings
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {isLoading ? (
              <p>Loading Headings...</p>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    Select Headings *
                  </label>
                  <Select
                    isMulti
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    options={businessCategories}
                    placeholder="Select Headings..."
                    isClearable={false}
                    closeMenuOnSelect={false}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={loading}
                  />
                  {errors.categories && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.categories}
                    </div>
                  )}
                  <div className="help">
                    Can't find the heading you're looking for?{" "}
                    <a href="#!">Request one here.</a>
                    {selectedCategories.length > 0 && (
                      <span> ({selectedCategories.length}/3 selected)</span>
                    )}
                  </div>
                  {selectedCategories.length >= 3 && (
                    <div
                      className="help"
                      style={{
                        color: "#dc3545",
                        fontWeight: "500",
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "4px",
                        padding: "0.75rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Maximum 3 headings reached. Three headings not enough?{" "}
                      <Link
                        href="/premium-services"
                        style={{
                          color: "#2cb75f",
                          fontWeight: "600",
                          textDecoration: "underline",
                        }}
                      >
                        Buy Extra Headings
                      </Link>{" "}
                      or Contact us for Advertising Options. 0776404936 /
                      0776404936 / 0773 765 485
                    </div>
                  )}
                </div>

                {selectedCategories.length > 0 && (
                  <div className="selected_categories_preview">
                    <h4>Selected Headings:</h4>
                    <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
                      {selectedCategories.map((category, index) => (
                        <li key={index}>{category.label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          <div
            className="modal-actions"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                isLoading ||
                !selectedCategories ||
                selectedCategories.length === 0
              }
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                backgroundColor:
                  loading ||
                  isLoading ||
                  !selectedCategories ||
                  selectedCategories.length === 0
                    ? "#ccc"
                    : "#007bff",
                color: "white",
                cursor:
                  loading ||
                  isLoading ||
                  !selectedCategories ||
                  selectedCategories.length === 0
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1rem",
              }}
            >
              {loading ? "Updating..." : "Update Headings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
