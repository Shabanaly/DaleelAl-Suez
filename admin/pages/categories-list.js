// Categories List Page Controller
// Separated logic from UI

const CategoriesListController = {
  allCategories: [],
  editingCategoryId: null,
  expandedCategories: new Set(),

  // 🔒 منع الطلبات المتكررة والتعليق
  isSaving: false,
  loadingIndicator: 0,
  requestTimeout: 15000, // 15 ثانية timeout

  init: async function () {
    document.getElementById("sidebar-container").innerHTML =
      Sidebar.render("categories");
    document.getElementById("topbar-container").innerHTML =
      Topbar.render("الأقسام");

    lucide.createIcons();
    await this.loadCategories();

    // Setup event listeners
    this.setupEventListeners();
  },

  setupEventListeners: function () {
    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterCategories());
    }

    // Form submit
    const form = document.getElementById("category-form");
    if (form) {
      form.addEventListener("submit", (e) => this.saveCategory(e));
    }

    // Add category button
    const addBtn = document.getElementById("add-category-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.openCategoryModal());
    }

    // Add sub button
    const addSubBtn = document.getElementById("add-sub-btn");
    if (addSubBtn) {
      addSubBtn.addEventListener("click", () => this.handleAddSub());
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.closeCategoryModal());
    }

    // Modal close button
    const modalCloseBtn = document.getElementById("modal-close-btn");
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", () => this.closeCategoryModal());
    }

    // Modal close on overlay click
    const modal = document.getElementById("category-modal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeCategoryModal();
        }
      });
    }
  },

  loadCategories: async function () {
    const tbody = document.getElementById("categories-table-body");
    if (!tbody) return;

    // 🔒 منع الاستدعاءات المتكررة
    if (this.loadingIndicator > 0) {
      console.warn("⏳ تحميل جاري بالفعل...");
      return;
    }

    this.loadingIndicator++;
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 40px;">جاري التحميل...</td></tr>';

    try {
      // 🔄 تعيين timeout للطلب
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("انتهت مهلة انتظار الطلب - تجاوز 15 ثانية")),
          this.requestTimeout,
        ),
      );

      const loadPromise = CategoriesService.getAll();

      // 🏃 انتظر أيهما ينتهي أولًا
      this.allCategories = await Promise.race([loadPromise, timeoutPromise]);
      this.renderCategories(this.allCategories);
    } catch (error) {
      console.error("❌ خطأ في التحميل:", error);
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--danger);">❌ ' +
        error.message +
        "</td></tr>";
    } finally {
      this.loadingIndicator--;
    }
  },

  renderCategories: function (categories) {
    const tbody = document.getElementById("categories-table-body");
    if (!tbody) return;

    if (!categories.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; padding: 40px;">لا توجد أقسام</td></tr>';
      return;
    }

    tbody.innerHTML = categories
      .map((cat) => {
        const subs = cat.subs || [];
        const isExpanded = this.expandedCategories.has(cat.id);
        const visibleSubs = isExpanded ? subs : subs.slice(0, 3);

        return `
                <tr>
                    <td>
                        <strong>${cat.name_ar}</strong>
                        ${cat.name_en ? `<br><small style="color: var(--text-muted);">${cat.name_en}</small>` : ""}
                    </td>
                    <td><code style="background: var(--bg-body); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${cat.id}</code></td>
                    <td>
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: var(--primary-soft); border-radius: 8px; color: var(--primary);">
                            <i data-lucide="${cat.icon || "folder"}" style="width: 18px; height: 18px;"></i>
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                            ${visibleSubs
                              .map(
                                (sub) => `
                                <span class="subcategories-badge">
                                    <i data-lucide="tag" style="width: 12px; height: 12px;"></i>
                                    ${sub.name_ar}
                                </span>
                            `,
                              )
                              .join("")}
                            ${subs.length > 3 && !isExpanded ? `<span class="subcategories-badge" style="background: var(--bg-body); color: var(--text-muted);">+${subs.length - 3}</span>` : ""}
                            ${
                              subs.length > 3
                                ? `
                                <button class="expand-subs-btn" onclick="CategoriesListController.toggleSubs('${cat.id}')">
                                    ${isExpanded ? "إخفاء" : "عرض الكل"}
                                </button>
                            `
                                : ""
                            }
                            ${subs.length === 0 ? '<span style="color: var(--text-muted); font-size: 12px;">لا توجد أقسام فرعية</span>' : ""}
                        </div>
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-outline btn-icon" onclick="CategoriesListController.editCategory('${cat.id}')" title="تعديل">
                                <i data-lucide="edit-2" style="width: 18px; height: 18px;"></i>
                            </button>
                            <button class="btn btn-danger btn-icon" onclick="CategoriesListController.deleteCategory('${cat.id}')" title="حذف">
                                <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");

    lucide.createIcons();
  },

  toggleSubs: function (catId) {
    if (this.expandedCategories.has(catId)) {
      this.expandedCategories.delete(catId);
    } else {
      this.expandedCategories.add(catId);
    }
    this.filterCategories();
  },

  filterCategories: function () {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    let filtered = this.allCategories;

    if (searchTerm) {
      filtered = filtered.filter(
        (cat) =>
          (cat.name_ar && cat.name_ar.toLowerCase().includes(searchTerm)) ||
          (cat.name_en && cat.name_en.toLowerCase().includes(searchTerm)) ||
          (cat.id && cat.id.toLowerCase().includes(searchTerm)),
      );
    }

    this.renderCategories(filtered);
  },

  openCategoryModal: function (catId = null) {
    this.editingCategoryId = catId;
    const modal = document.getElementById("category-modal");
    const form = document.getElementById("category-form");
    const title = document.getElementById("modal-title");
    const subsSection = document.getElementById("subs-mgmt-section");
    const catIdInput = document.getElementById("cat-id");

    if (!modal || !form || !title || !subsSection || !catIdInput) return;

    form.reset();

    if (catId) {
      title.innerText = "تعديل القسم";
      this.loadCategoryData(catId);
      catIdInput.disabled = true;
      subsSection.style.display = "block";
    } else {
      title.innerText = "قسم جديد";
      catIdInput.disabled = false;
      subsSection.style.display = "none";
    }

    modal.classList.add("active");
    lucide.createIcons();
  },

  // 🌟 دالة جديدة: تحديث الفئة محليًا بدون استدعاء API
  updateLocalCategory: function (catId, updatedData) {
    const categoryIndex = this.allCategories.findIndex((c) => c.id === catId);
    if (categoryIndex !== -1) {
      this.allCategories[categoryIndex] = {
        ...this.allCategories[categoryIndex],
        ...updatedData,
      };
      this.renderCategories(this.allCategories);
    }
  },

  // 🌟 دالة جديدة: إضافة فئة جديدة محليًا فورًا
  addCategoryLocally: function (categoryData) {
    const newCategory = {
      ...categoryData,
      label: categoryData.name_ar,
      subs: categoryData.subs || [],
    };
    this.allCategories.unshift(newCategory);
    this.renderCategories(this.allCategories);
  },

  loadCategoryData: async function (catId) {
    // 🌟 استخدم البيانات المحلية بدلًا من استدعاء API
    let cat = this.allCategories.find((c) => c.id === catId);

    // إذا لم توجد البيانات محليًا، استدعِ API (حالة نادرة)
    if (!cat) {
      console.warn("📡 البيانات المحلية غير موجودة، استدعاء API...");
      const cats = await CategoriesService.getAll();
      cat = cats.find((c) => c.id === catId);
    }

    if (cat) {
      const idInput = document.getElementById("cat-id");
      const nameArInput = document.getElementById("cat-name-ar");
      const nameEnInput = document.getElementById("cat-name-en");
      const iconInput = document.getElementById("cat-icon");

      if (idInput) idInput.value = cat.id;
      if (nameArInput) nameArInput.value = cat.name_ar;
      if (nameEnInput) nameEnInput.value = cat.name_en || "";
      if (iconInput) iconInput.value = cat.icon || "";

      this.renderSubsList(cat.subs || []);
    }
  },

  renderSubsList: function (subs) {
    const container = document.getElementById("modal-subs-list");
    if (!container) return;

    if (subs.length === 0) {
      container.innerHTML =
        '<div style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 10px;">لا توجد أقسام فرعية بعد</div>';
      return;
    }

    container.innerHTML = subs
      .map(
        (sub) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-body); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                <div>
                    <span style="font-weight: 700; font-size: 14px;">${sub.name_ar}</span>
                    <code style="font-size: 11px; color: var(--text-muted); margin-right: 8px;">(${sub.id})</code>
                </div>
                <button type="button" class="btn btn-danger btn-icon" style="width: 32px; height: 32px;" onclick="CategoriesListController.handleDeleteSub('${sub.id}')">
                    <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                </button>
            </div>
        `,
      )
      .join("");
    lucide.createIcons();
  },

  handleAddSub: async function () {
    const idInput = document.getElementById("new-sub-id");
    const nameInput = document.getElementById("new-sub-name");
    const addBtn = document.querySelector(
      '#subs-mgmt-section button[onclick="CategoriesListController.handleAddSub()"]',
    );

    if (!idInput || !nameInput) return;

    const id = idInput.value.trim();
    const name = nameInput.value.trim();

    if (!id || !name) {
      alert("يرجى إدخال المعرف والاسم");
      return;
    }

    try {
      // 🔒 تعطيل الزر
      if (addBtn) {
        addBtn.disabled = true;
        addBtn.innerHTML =
          '<i data-lucide="loader" style="width: 14px; height: 14px; animation: spin 1s linear infinite;"></i> جاري الإضافة...';
        lucide.createIcons();
      }

      // 🌟 إضافة محلية فورية
      const category = this.allCategories.find(
        (c) => c.id === this.editingCategoryId,
      );
      if (category) {
        const newSub = {
          id,
          name_ar: name,
          main_cat_id: this.editingCategoryId,
          label: name,
        };
        if (!category.subs) category.subs = [];
        category.subs.unshift(newSub);
        this.renderSubsList(category.subs);
      }

      // ثم إرسال للـ API
      await CategoriesService.createSub({
        id,
        name_ar: name,
        main_cat_id: this.editingCategoryId,
      });

      // Clear inputs
      idInput.value = "";
      nameInput.value = "";

      console.log("✅ تم إضافة القسم الفرعي بنجاح");
    } catch (error) {
      console.error(error);
      // إعادة التحميل عند الخطأ فقط
      await this.loadCategoryData(this.editingCategoryId);
      alert("❌ خطأ في إضافة القسم الفرعي: " + error.message);
    } finally {
      // 🔒 إعادة تفعيل الزر
      if (addBtn) {
        addBtn.disabled = false;
        addBtn.innerHTML = '<i data-lucide="plus"></i> إضافة الفرعي';
        lucide.createIcons();
      }
    }
  },

  handleDeleteSub: async function (subId) {
    if (!confirm("هل أنت متأكد من حذف هذا القسم الفرعي؟")) return;

    try {
      // 🌟 حذف محلي فوري
      const category = this.allCategories.find(
        (c) => c.id === this.editingCategoryId,
      );
      if (category && category.subs) {
        category.subs = category.subs.filter((s) => s.id !== subId);
        this.renderSubsList(category.subs);
      }

      // ثم إرسال للـ API
      await CategoriesService.deleteSub(subId);
      console.log("✅ تم حذف القسم الفرعي بنجاح");
    } catch (error) {
      console.error(error);
      // إعادة التحميل عند الخطأ فقط
      await this.loadCategoryData(this.editingCategoryId);
      alert("❌ خطأ في حذف القسم الفرعي: " + error.message);
    }
  },

  closeCategoryModal: function () {
    const modal = document.getElementById("category-modal");
    if (modal) {
      modal.classList.remove("active");
    }
    this.editingCategoryId = null;
  },

  saveCategory: async function (e) {
    e.preventDefault();

    // 🔒 منع الضغط المتكرر
    if (this.isSaving) {
      console.warn("⏳ عملية حفظ جارية... يرجى الانتظار");
      return;
    }

    const idInput = document.getElementById("cat-id");
    const nameArInput = document.getElementById("cat-name-ar");
    const nameEnInput = document.getElementById("cat-name-en");
    const iconInput = document.getElementById("cat-icon");
    const submitBtn = document.querySelector(
      '#category-form button[type="submit"]',
    );

    if (!idInput || !nameArInput) return;

    const categoryData = {
      id: idInput.value.trim(),
      name_ar: nameArInput.value.trim(),
      name_en: nameEnInput.value.trim() || null,
      icon: iconInput ? iconInput.value.trim() || "folder" : "folder",
    };

    try {
      // 🔒 تعطيل الزر وتحديث الحالة
      this.isSaving = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i data-lucide="loader" style="width: 18px; height: 18px; animation: spin 1s linear infinite;"></i> جاري الحفظ...';
        lucide.createIcons();
      }

      // 🌟 تحديث محلي فوري (تجربة سريعة)
      if (this.editingCategoryId) {
        // تحديث محلي للفئة الموجودة
        this.updateLocalCategory(this.editingCategoryId, {
          name_ar: categoryData.name_ar,
          name_en: categoryData.name_en,
          icon: categoryData.icon,
          label: categoryData.name_ar,
        });

        // ثم إرسال للـ API
        await CategoriesService.update(this.editingCategoryId, {
          name_ar: categoryData.name_ar,
          name_en: categoryData.name_en,
          icon: categoryData.icon,
        });
        console.log("✅ تم تحديث الفئة بنجاح");
      } else {
        // إضافة الفئة محليًا فورًا
        this.addCategoryLocally(categoryData);

        // ثم إرسال للـ API
        const response = await CategoriesService.create(categoryData);
        console.log("✅ تم إضافة الفئة بنجاح:", response);
      }

      this.closeCategoryModal();

      // 🌟 تحديث خفيف بدون تحميل كامل
      // (البيانات المحلية موجودة بالفعل)
      setTimeout(() => lucide.createIcons(), 100);
    } catch (error) {
      console.error("❌ خطأ:", error);
      // إعادة الحالة السابقة في حالة الخطأ
      if (this.editingCategoryId) {
        this.loadCategories(); // إعادة التحميل عند الخطأ فقط
      }
      alert("❌ حدث خطأ: " + error.message);
    } finally {
      // 🔒 إعادة تفعيل الزر
      this.isSaving = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "حفظ القسم الرئيسي";
      }
    }
  },

  editCategory: function (catId) {
    this.openCategoryModal(catId);
  },

  deleteCategory: async function (catId) {
    if (
      !confirm(
        "⚠️ هل أنت متأكد من حذف هذا القسم؟\n\nسيتم حذف جميع الأقسام الفرعية والأماكن المرتبطة به.",
      )
    ) {
      return;
    }

    try {
      await CategoriesService.delete(catId);
      alert("✅ تم الحذف بنجاح!");
      await this.loadCategories();
    } catch (error) {
      console.error(error);
      alert("❌ حدث خطأ: " + error.message);
    }
  },
};

// Global functions for onclick handlers
window.openCategoryModal = function () {
  CategoriesListController.openCategoryModal();
};

window.toggleSubs = function (catId) {
  CategoriesListController.toggleSubs(catId);
};

window.editCategory = function (catId) {
  CategoriesListController.editCategory(catId);
};

window.deleteCategory = function (catId) {
  CategoriesListController.deleteCategory(catId);
};

window.handleAddSub = function () {
  CategoriesListController.handleAddSub();
};

window.handleDeleteSub = function (subId) {
  CategoriesListController.handleDeleteSub(subId);
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    CategoriesListController.init(),
  );
} else {
  CategoriesListController.init();
}
