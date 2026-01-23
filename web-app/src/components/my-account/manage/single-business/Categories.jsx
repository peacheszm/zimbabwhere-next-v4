"use client";

// Modal Stuff
import { useModal } from "@/contexts/ModalContext";
import EditCategories from "@/components/modals/single-business/EditCategories";
import BuyButton from "@/components/global/BuyButton";

export default function Categories({ data, cats }) {
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
    openModal("EditCategories", { business: data, cats });
  };

  return (
    <div className="manage_section categories">
      <div className="ms_title">
        <h3>Business Categories</h3>
      </div>
      <div className="ms_desc">
        <h4>Business Categories</h4>
        <p>
          Below are your listed free headings. You can purchase more headings to
          increase your chances of receiving quotes and being found on our site.
          3D Display Manufacturers4x4 Accessories ShopsAgricultural Seed
          Suppliers
        </p>
      </div>

      <div className="ms_body">
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
      </div>

      <div className="ms_footer">
        <button onClick={handleOpenModal}>Edit Categories</button>
        <BuyButton title="Buy Extra Headings" />
      </div>

      <EditCategories />
    </div>
  );
}
