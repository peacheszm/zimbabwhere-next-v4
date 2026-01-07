"use client";
import { useState } from "react";
import Select from "react-select";
import { selectBusinessForAdvertisement } from "@/lib/endpoints/paid-listings";
import NoticeMessage from "@/components/global/Notice";

const AD_TYPE_INFO = {
  video_display_on_every_page: {
    title: "Video Display on Every Page",
    description: "Your business video displayed across all pages of the site.",
  },
  home_page_logo_display: {
    title: "Home Page Logo Display",
    description: "Your business logo featured on the main landing page.",
  },
  home_page_billboard_display: {
    title: "Home Page Billboard Display",
    description: "Large format billboard advertisement on the home page.",
  },
  premium_listing: {
    title: "Premium Business Listing",
    description: "Enhanced business profile with priority search placement.",
  },
};

export default function PaidAdverts({ purchases = {}, businesses = [], token }) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null); // Stores order_id on success
  const [isUpdating, setIsUpdating] = useState(null); // Stores order_id being updated

  const purchaseData = purchases?.data || {};
  const businessOptions = (businesses?.data || []).map((biz) => ({
    value: biz.id,
    label: biz.title,
  }));

  const hasPurchases = Object.keys(AD_TYPE_INFO).some(
    (key) => purchaseData[key] && purchaseData[key].length > 0
  );

  if (!hasPurchases) {
    return (
      <div className="paid_adverts_container">
        <NoticeMessage title="No Paid Advertising Found" />
        <p style={{ marginTop: "10px", color: "#666" }}>
          You don't have any active advertising packages at the moment.
        </p>
      </div>
    );
  }

  const isExpired = (expiryStr) => {
    if (!expiryStr) return true;
    try {
      const [datePart] = expiryStr.split(" ");
      const [day, month, year] = datePart.split("/");
      const expiryDate = new Date(year, month - 1, day, 23, 59, 59);
      return expiryDate < new Date();
    } catch (e) {
      console.error("Error parsing date:", expiryStr, e);
      return true;
    }
  };

  const handleUpdateAdvert = async (type, orderId, businessId) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsUpdating(orderId);

    try {
      const adData = {
        ad_type: type,
        order_id: orderId,
        business_id: businessId,
      };

      await selectBusinessForAdvertisement(adData, token);
      
      setSubmitSuccess(orderId);
      setTimeout(() => setSubmitSuccess(null), 3000);
    } catch (error) {
      console.error("❌ Advert update failed:", error);
      setSubmitError(
        `Failed to update Advert #${orderId}: ` + (error.message || "Please try again.")
      );
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="paid_adverts_list">
      {Object.entries(AD_TYPE_INFO).map(([key, info]) => {
        const typePurchases = purchaseData[key] || [];
        if (typePurchases.length === 0) return null;

        return (
          <div key={key} className="advert_category_section">
            <div className="section_title" style={{ marginBottom: "20px" }}>
              <h2>{info.title}</h2>
              <p>{info.description}</p>
            </div>

            {typePurchases.map((purchase) => (
              <AdvertOrderRow
                key={purchase.order_id}
                type={key}
                purchase={purchase}
                businessOptions={businessOptions}
                expired={isExpired(purchase.expire_date)}
                isUpdating={isUpdating === purchase.order_id}
                isSuccess={submitSuccess === purchase.order_id}
                onUpdate={(bizId) => handleUpdateAdvert(key, purchase.order_id, bizId)}
              />
            ))}
          </div>
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

function AdvertOrderRow({ type, purchase, businessOptions, expired, isUpdating, isSuccess, onUpdate }) {
  // Handle featured_business being an ID or an object
  const initialBusinessId = typeof purchase.featured_business === "object" 
    ? purchase.featured_business?.ID 
    : purchase.featured_business;
    
  const initialOption = businessOptions.find(opt => opt.value === initialBusinessId);
  const [selected, setSelected] = useState(initialOption);

  return (
    <div className={`account_selector ${expired ? "expired" : ""}`} style={{ marginBottom: "16px" }}>
      <div className="section_title">
        <h3 style={{ fontSize: "18px", color: "#32cd32" }}>Order #{purchase.order_id}</h3>
        <p>
          {expired 
            ? `Expired on ${purchase.expire_date.split(" ")[0]}` 
            : `Active until ${purchase.expire_date.split(" ")[0]}`}
        </p>
      </div>

      <div className="add_business_form_container">
        <div className="form_wrapper">
          <div className="form_row">
            <label>Select Business to Advertise</label>
            <Select
              options={businessOptions}
              value={selected}
              onChange={(val) => setSelected(val)}
              placeholder="Select a Business"
              classNamePrefix="react-select"
              isDisabled={expired || isUpdating}
            />
          </div>

          <div className="form_row btn_group">
            <button
              type="button"
              className="primary"
              disabled={expired || isUpdating || isSuccess || !selected}
              onClick={() => onUpdate(selected?.value)}
              style={isSuccess ? { background: "#2cb75f", color: "#fff" } : {}}
            >
              {isUpdating ? "Updating..." : isSuccess ? "Saved!" : "Update Advert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
