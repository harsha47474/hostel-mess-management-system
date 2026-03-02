document.addEventListener("DOMContentLoaded", () => {

    let itemCount = 1;

    // Add Item Button
    window.addItem = function () {
        const container = document.getElementById("items");

        const div = document.createElement("div");
        div.classList.add("row", "g-2", "mb-2");

        div.innerHTML = `
            <div class="col-md-9">
                <input type="text"
                       name="items[${itemCount}][name]"
                       class="form-control"
                       placeholder="Item name"
                       required>
            </div>

            <div class="col-md-3">
                <select name="items[${itemCount}][isVeg]"
                        class="form-select">
                    <option value="true">Veg</option>
                    <option value="false">Non-Veg</option>
                </select>
            </div>
        `;

        container.appendChild(div);
        itemCount++;
    };

    // 🔥 Use Event Delegation (VERY IMPORTANT)
    document.addEventListener("click", function (e) {

        const editBtn = e.target.closest(".edit-btn");
        if (!editBtn) return;

        const row = editBtn.closest(".item-row");
        const itemId = row.dataset.id;
        const textSpan = row.querySelector(".item-text");
        const oldValue = textSpan.innerText.trim();

        row.innerHTML = `
            <form action="/admins/menu/edit/${itemId}"
                  method="POST"
                  class="d-flex align-items-center gap-2 w-100">

                <input type="text"
                       name="name"
                       value="${oldValue}"
                       class="form-control form-control-sm"
                       required>

                <select name="isVeg"
                        class="form-select form-select-sm"
                        style="max-width:120px;">
                    <option value="true">Veg</option>
                    <option value="false">Non-Veg</option>
                </select>

                <button class="btn btn-success btn-sm">
                    <i class="bi bi-check"></i>
                </button>
            </form>
        `;
    });

});
