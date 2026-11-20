"use client";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditCategories from "@/components/modals/single-business/EditCategories";
import BuyButton from "@/components/global/BuyButton";
import DoubleUpOffer from "@/components/global/DoubleUpOffer";
import DoubleUpPopup from "@/components/global/DoubleUpPopup";
import PremiumListingUpsell from "@/components/global/PremiumListingUpsell";

export default function Categories({ data, cats, selectableCats }) {
  const { openModal } = useModal();

  // Find the category labels from the IDs
  // WordPress usually provides categories as an array of IDs in 'business-listing'
  const currentCategoryIds = data?.["business_cat"] || [];

  // If 'cats' is available, we can map IDs to labels
  const currentCategories = currentCategoryIds.map((id) => {
    const cat = cats.find((c) => c.value === id || c.id === id);
    return cat ? cat.label : `Category ${id}`;
  });

  const handleOpenModal = () => {
    openModal("EditCategories", {
      business: data,
      cats,
      selectableCats: selectableCats || cats,
    });
  };

  return (
    <div className="manage_section categories">
      <div className="ms_title">
        <h3>Business Headings</h3>
      </div>
      <div className="ms_desc">
        <h4>Business Headings</h4>
        <p>
          Below are your listed free headings. You can purchase more headings to
          increase your chances of receiving quotes and being found on our site.
        </p>
      </div>

      <div className="ms_body">
        {/* 1. What they have now, with the button that edits it right beside it */}
        <div className="headings_block">
          <h4 className="headings_block_title">Your Headings (Free)</h4>
          <div className="categories_list">
            {currentCategories.length > 0 ? (
              currentCategories.map((name, index) => (
                <span key={index} className="category_tag">
                  {name}
                </span>
              ))
            ) : (
              <p>No categories selected</p>
            )}
          </div>
          <div className="ms_footer">
            <button onClick={handleOpenModal}>Edit Headings</button>
          </div>
        </div>

        {/* 2. Buying more headings, with the offer that goes with it */}
        <div className="headings_block more_headings">
          <h4 className="headings_block_title">Want More Headings?</h4>
          <DoubleUpOffer />
          <BuyButton
            title="$35 / Heading / Year"
            subTitle="Buy Extra Headings"
          />
        </div>

        {/* 3. Premium, which covers every heading above */}
        <div className="headings_block go_premium">
          <PremiumListingUpsell headingCount={currentCategories.length} />
        </div>
      </div>

      <EditCategories />
      <DoubleUpPopup storageKey="double_up_popup_account" />
    </div>
  );
}
