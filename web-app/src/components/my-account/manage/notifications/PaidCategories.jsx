"use client";
import { useState } from "react";
import Select from "react-select";
import { updateCurrentUserNotifications } from "@/lib/endpoints/account";
import NoticeMessage from "@/components/global/Notice";

export default function PaidCategories({ cats = [], userData = {}, token }) {
  const [orders, setOrders] = useState(
    userData.data?.sign_up_to_notifications || []
  );
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null); // Will store order ID on success
  const [isUpdating, setIsUpdating] = useState(null); // Will store order ID being updated

  if (!orders || orders.length === 0) {
    return (
      <div className="account_selector">
        <div className="section_title">
          <h2>Paid Headings</h2>
        </div>
        <NoticeMessage title="No Paid For Categories" />
      </div>
    );
  }

  const isExpired = (expiryStr) => {
    if (!expiryStr) return true;
    try {
      // Expected format: "DD/MM/YYYY h:mm am/pm"
      const [datePart] = expiryStr.split(" ");
      const [day, month, year] = datePart.split("/");
      // Set to end of day to be safe, or exact time if desired
      const expiryDate = new Date(year, month - 1, day, 23, 59, 59);
      return expiryDate < new Date();
    } catch (e) {
      console.error("Error parsing date:", expiryStr, e);
      return true;
    }
  };

  const handleUpdateOrder = async (orderId, newCategories) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsUpdating(orderId);

    try {
      // 1. Prepare the updated orders list
      const updatedOrders = orders.map((order) => {
        if (order.order_id === orderId) {
          return {
            ...order,
            paid_categories: newCategories.map((c) => c.value),
          };
        }
        return order;
      });

      // 2. Prepare payload (backend expects the whole sign_up_to_notifications array)
      const payload = {
        sign_up_to_notifications: updatedOrders,
      };

      // 3. Call API
      await updateCurrentUserNotifications(payload, token);

      // 4. Update local state
      setOrders(updatedOrders);
      setSubmitSuccess(orderId);

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (error) {
      console.error("❌ Notification update failed:", error);
      setSubmitError(
        `Order #${orderId} update failed: ` +
          (error.message || "Please try again.")
      );
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="paid_categories_container">
      {orders.map((order) => {
        const expired = isExpired(order.expire_date);
        const limit = parseInt(order.number_of_categories) || 0;

        // Initial values for the select
        const initialValue = (
          Array.isArray(order.paid_categories) ? order.paid_categories : []
        )
          .map((cat) => {
            const catId = typeof cat === "object" ? cat.term_id : cat;
            return cats.find(
              (c) => c.value === catId || c.value === String(catId)
            );
          })
          .filter(Boolean);

        return (
          <OrderRow
            key={order.order_id}
            order={order}
            cats={cats}
            initialValue={initialValue}
            expired={expired}
            limit={limit}
            isUpdating={isUpdating === order.order_id}
            isSuccess={submitSuccess === order.order_id}
            onUpdate={(newCats) => handleUpdateOrder(order.order_id, newCats)}
          />
        );
      })}

      {submitError && (
        <div className="form_row error_box" style={{ marginTop: "20px" }}>
          <p>{submitError}</p>
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  cats,
  initialValue,
  expired,
  limit,
  isUpdating,
  isSuccess,
  onUpdate,
}) {
  const [selected, setSelected] = useState(initialValue);

  return (
    <div className={`account_selector ${expired ? "expired" : ""}`}>
      <div className="section_title">
        <h2>Select headings for Order #{order.order_id}</h2>
        <p>
          {expired
            ? `This order expired on ${order.expire_date.split(" ")[0]}`
            : `You can select up to ${limit} headings. Expires on ${
                order.expire_date.split(" ")[0]
              }`}
        </p>
      </div>

      <div className="add_business_form_container">
        <div className="form_wrapper">
          <div className="form_row">
            <label>Paid Headings</label>
            <Select
              isMulti
              options={cats}
              value={selected}
              onChange={(val) => setSelected(val || [])}
              isOptionDisabled={() => selected.length >= limit}
              placeholder="Search/Select Categories"
              classNamePrefix="react-select"
              isDisabled={expired || isUpdating}
            />
            {selected.length === limit && !expired && (
              <p className="info_msg">Maximum {limit} categories reached.</p>
            )}
          </div>

          <div className="form_row btn_group">
            <button
              type="button"
              className="primary"
              disabled={expired || isUpdating || isSuccess}
              onClick={() => onUpdate(selected)}
              style={isSuccess ? { background: "#2cb75f", color: "#fff" } : {}}
            >
              {isUpdating
                ? "Updating..."
                : isSuccess
                ? "Saved!"
                : "Update Headings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
