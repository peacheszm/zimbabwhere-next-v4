"use client";

import { useEffect, useState, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import Select from "react-select";
import Link from "next/link";
import { updateCurrentUserNotifications } from "@/lib/endpoints/account";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

// Virtualized MenuList component for react-select using react-virtuoso
const MenuList = ({ children, maxHeight, getValue }) => {
  if (!children || !Array.isArray(children)) return null;

  const [value] = getValue();
  const initialIndex = Array.isArray(children) && value ? children.indexOf(value) : 0;
  const menuHeight = Math.max(35, Math.min(maxHeight || 300, children.length * 35));

  return (
    <Virtuoso
      style={{ height: menuHeight }}
      totalCount={children.length}
      initialTopMostItemIndex={initialIndex > -1 ? initialIndex : 0}
      fixedItemHeight={35}
      itemContent={(index) => (
        <div style={{ height: 35, boxSizing: "border-box" }}>
          {children[index]}
        </div>
      )}
    />
  );
};

export default function ManageNotificationsClient({
  initialData,
  initialCategories,
  session,
}) {
  const [data, setData] = useState(initialData);
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [isFreeCategoriesModalOpen, setIsFreeCategoriesModalOpen] =
    useState(false);
  const [selectedFreeCategories, setSelectedFreeCategories] = useState([]);
  const [savingFreeCategories, setSavingFreeCategories] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  // Memoize all categories mapped for Select
  const mappedCategories = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.title || cat.name,
    }));
  }, [categories]);

  function parseExpireDate(dateString) {
    if (!dateString || typeof dateString !== "string") return null;
    try {
      const [datePart, timePart, ampm] = dateString.split(" ");
      const [day, month, year] = datePart
        .split("/")
        .map((p) => parseInt(p, 10));
      const [hoursStr, minutesStr] = timePart.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      if (ampm?.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (ampm?.toLowerCase() === "am" && hours === 12) hours = 0;
      return new Date(year, month - 1, day, hours, minutes);
    } catch (_) {
      return null;
    }
  }

  function handleSelectCategories(item) {
    setSelectedOrder(item);

    let selectedCategoryObjects = [];
    if (item.paid_categories && item.paid_categories !== false) {
      const selectedCategoryIds = Array.isArray(item.paid_categories)
        ? item.paid_categories.map((cat) => cat.term_id || cat.id || cat)
        : item.paid_categories;

      selectedCategoryObjects = mappedCategories.filter((cat) =>
        Array.isArray(selectedCategoryIds)
          ? selectedCategoryIds.includes(parseInt(cat.value))
          : selectedCategoryIds === parseInt(cat.value)
      );
    }

    setSelectedCategories(selectedCategoryObjects);
    setIsModalOpen(true);
  }

  async function handleSaveCategories() {
    if (!selectedOrder || !session?.jwt) return;

    try {
      setSaving(true);
      const updatedCategories = data.data.additional_business_categories.map(
        (cat) => {
          if (cat.order_id === selectedOrder.order_id) {
            return {
              ...cat,
              paid_categories: selectedCategories.map((cat) => cat.value),
            };
          }
          return cat;
        }
      );

      const payload = { additional_business_categories: updatedCategories };
      await updateCurrentUserNotifications(payload, session.jwt);

      setData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          additional_business_categories: updatedCategories,
        },
      }));

      setIsModalOpen(false);
      setSelectedOrder(null);
      setSelectedCategories([]);
    } catch (e) {
      console.error("Save error:", e);
      alert(e.message || "Failed to save categories");
    } finally {
      setSaving(false);
    }
  }

  function handleCategoryChange(selectedOptions) {
    const maxCategories = parseInt(selectedOrder?.number_of_categories || "0");
    if (selectedOptions && selectedOptions.length <= maxCategories) {
      setSelectedCategories(selectedOptions);
      setShowLimitMessage(false);
    } else if (selectedOptions && selectedOptions.length > maxCategories) {
      setShowLimitMessage(true);
    }
  }

  function handleFreeCategoriesClick() {
    const currentFreeCategories = data?.data?.users_free_categories || [];
    let selectedCategoryObjects = [];

    if (
      Array.isArray(currentFreeCategories) &&
      currentFreeCategories.length > 0
    ) {
      const selectedTermIds = currentFreeCategories.map((item) =>
        typeof item === "object" ? item.term_id : item
      );

      selectedCategoryObjects = mappedCategories.filter((cat) => {
        const categoryId = parseInt(cat.value);
        return (
          selectedTermIds.includes(categoryId) ||
          selectedTermIds.includes(categoryId.toString()) ||
          selectedTermIds.includes(cat.value)
        );
      });
    }

    setSelectedFreeCategories(selectedCategoryObjects);
    setIsFreeCategoriesModalOpen(true);
  }

  function handleFreeCategoryChange(selectedOptions) {
    const maxFreeCategories = 3;
    if (selectedOptions && selectedOptions.length <= maxFreeCategories) {
      setSelectedFreeCategories(selectedOptions);
      setShowLimitMessage(false);
    } else if (selectedOptions && selectedOptions.length > maxFreeCategories) {
      setShowLimitMessage(true);
    }
  }

  async function handleSaveFreeCategories() {
    if (!session?.jwt) return;

    try {
      setSavingFreeCategories(true);
      const payload = {
        users_free_categories: selectedFreeCategories.map((cat) => cat.value),
      };

      await updateCurrentUserNotifications(payload, session.jwt);

      setData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          users_free_categories: selectedFreeCategories.map((cat) => cat.value),
        },
      }));

      setIsFreeCategoriesModalOpen(false);
      setSelectedFreeCategories([]);
    } catch (e) {
      console.error("Save free categories error:", e);
      alert(e.message || "Failed to save free categories");
    } finally {
      setSavingFreeCategories(false);
    }
  }

  function renderCategoryItem(item, index) {
    const expireDate = parseExpireDate(item.expire_date);
    const isExpired = expireDate ? Date.now() > expireDate.getTime() : false;

    return (
      <li
        key={`category-${item.order_id}-${index}`}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          padding: "0.9rem 1rem",
          borderRadius: 8,
          marginBottom: "0.75rem",
          opacity: isExpired ? 0.6 : 1,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: "#111827" }}>
            Order #{item.order_id}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Added: {item.added_date} | Expires: {item.expire_date} | Status:{" "}
            {item.status ? "Active" : "Inactive"}
          </div>
          <div style={{ fontSize: 12, marginTop: 6 }}>
            <span
              style={{
                display: "inline-block",
                background: "#f0f9ff",
                color: "#0369a1",
                border: "1px solid #bae6fd",
                padding: "2px 8px",
                borderRadius: 9999,
                fontWeight: 500,
                marginRight: "0.5rem",
              }}
            >
              Categories: {item.number_of_categories}
            </span>
            {item.paid_categories && (
              <span
                style={{
                  display: "inline-block",
                  background: "#f0fdf4",
                  color: "#166534",
                  border: "1px solid #bbf7d0",
                  padding: "2px 8px",
                  borderRadius: 9999,
                  fontWeight: 500,
                }}
              >
                Categories Selected
              </span>
            )}
          </div>
        </div>
        <div>
          <button
            disabled={isExpired || !item.status}
            onClick={() => handleSelectCategories(item)}
            className="btn"
            style={{
              background: item.paid_categories ? "#16a34a" : "#2563eb",
              color: "#ffffff",
              border: 0,
              padding: "8px 12px",
              borderRadius: 6,
              cursor: isExpired || !item.status ? "not-allowed" : "pointer",
            }}
          >
            {item.paid_categories ? "Manage Categories" : "Select Categories"}
          </button>
        </div>
      </li>
    );
  }

  return (
    <div style={{ padding: "1.25rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h2
          style={{
            color: "#ffffff",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Manage my Independent section headings
        </h2>

        <div>
          {/* Free Categories Section */}
          {data.data?.users_free_categories !== false && (
            <section
              style={{
                marginBottom: "2rem",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid #e5e7eb",
                  background: "#f8fafc",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18, color: "#111827" }}>
                  Free Headings
                </h2>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#6b7280" }}>
                    You have access to free business headings. Select up to 3
                    headings to receive notifications for.
                  </p>
                  {data.data?.users_free_categories &&
                  Array.isArray(data.data.users_free_categories) &&
                  data.data.users_free_categories.length > 0 ? (
                    <div style={{ marginTop: "0.5rem" }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        Selected headings:
                      </span>
                      <div style={{ marginTop: "0.25rem" }}>
                        {data.data.users_free_categories.map(
                          (categoryItem, index) => {
                            const categoryId =
                              typeof categoryItem === "object"
                                ? categoryItem.term_id
                                : categoryItem;
                            const category = mappedCategories.find(
                              (cat) => cat.value === categoryId
                            );
                            return category ? (
                              <span
                                key={categoryId || index}
                                style={{
                                  display: "inline-block",
                                  background: "#f0fdf4",
                                  color: "#166534",
                                  border: "1px solid #bbf7d0",
                                  padding: "2px 8px",
                                  borderRadius: 9999,
                                  fontWeight: 500,
                                  marginRight: "0.5rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {category.label}
                              </span>
                            ) : null;
                          }
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: "#9ca3af", fontSize: 14 }}>
                      No headings selected yet.
                    </p>
                  )}
                </div>
                <button
                  onClick={handleFreeCategoriesClick}
                  className="btn"
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    border: 0,
                    padding: "8px 12px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {data.data?.users_free_categories &&
                  Array.isArray(data.data.users_free_categories) &&
                  data.data.users_free_categories.length > 0
                    ? "Manage Free headings"
                    : "Select Free headings"}
                </button>
              </div>
            </section>
          )}

          {/* Paid Categories Section */}
          {data.data?.additional_business_categories &&
            Array.isArray(data.data.additional_business_categories) &&
            data.data.additional_business_categories.length > 0 && (
              <section
                style={{
                  marginBottom: "2rem",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#f8fafc",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 18, color: "#111827" }}>
                    Additional Business Headings
                  </h2>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 12 }}>
                  {data.data.additional_business_categories.map((item, index) =>
                    renderCategoryItem(item, index)
                  )}
                </ul>
              </section>
            )}

          {/* No Categories Message */}
          {(!data.data?.additional_business_categories ||
            !Array.isArray(data.data.additional_business_categories) ||
            data.data.additional_business_categories.length === 0) &&
            data.data?.users_free_categories === false && (
              <p
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                No category purchases found. You haven't purchased any
                additional business headings yet.
              </p>
            )}
        </div>

        {/* Free Categories Selection Modal */}
        {isFreeCategoriesModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsFreeCategoriesModalOpen(false);
              }
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 8,
                padding: "2rem",
                maxWidth: 500,
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <h2 style={{ margin: "0 0 1rem 0", color: "#111827" }}>
                Select Free headings
              </h2>
              <p style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>
                You can select up to 3 free headings to receive notifications
                for.
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <Select
                  isMulti
                  components={{ MenuList }}
                  value={selectedFreeCategories}
                  onChange={handleFreeCategoryChange}
                  options={mappedCategories}
                  placeholder="Select free headings..."
                  isClearable
                  closeMenuOnSelect={false}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Can't find the heading you're looking for?{" "}
                  <a href="#!">Request one here.</a>
                  {selectedFreeCategories.length > 0 && (
                    <span> ({selectedFreeCategories.length}/3 selected)</span>
                  )}
                </div>
                {selectedFreeCategories.length >= 3 && (
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

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsFreeCategoriesModalOpen(false)}
                  style={{
                    background: "none",
                    border: "1px solid #d1d5db",
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFreeCategories}
                  disabled={savingFreeCategories}
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    border: 0,
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    cursor: savingFreeCategories ? "not-allowed" : "pointer",
                  }}
                >
                  {savingFreeCategories ? "Saving..." : "Save headings"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Selection Modal */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
                setShowLimitMessage(false);
              }
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 8,
                padding: "2rem",
                maxWidth: 500,
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
              }}
            >
              <h2 style={{ margin: "0 0 1rem 0", color: "#111827" }}>
                Select headings for Order #{selectedOrder?.order_id}
              </h2>
              <p style={{ margin: "0 0 1rem 0", color: "#6b7280" }}>
                You can select up to {selectedOrder?.number_of_categories}{" "}
                headings.
              </p>
              {showLimitMessage && (
                <div
                  className="help"
                  style={{
                    color: "#dc3545",
                    fontWeight: "500",
                    backgroundColor: "#f8d7da",
                    border: "1px solid #f5c6cb",
                    borderRadius: "4px",
                    padding: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  {selectedOrder?.number_of_categories} headings not enough?{" "}
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

              <div style={{ marginBottom: "1rem" }}>
                <Select
                  isMulti
                  components={{ MenuList }}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  options={mappedCategories}
                  placeholder="Select headings..."
                  isClearable
                  closeMenuOnSelect={false}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setShowLimitMessage(false);
                  }}
                  style={{
                    background: "none",
                    border: "1px solid #d1d5db",
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategories}
                  disabled={saving}
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    border: 0,
                    padding: "0.5rem 1rem",
                    borderRadius: 6,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Saving..." : "Save headings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
