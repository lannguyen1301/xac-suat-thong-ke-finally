document.addEventListener("DOMContentLoaded", function () {
    // 1. Khai báo các thành phần dựa trên ID THỰC TẾ trong admin.html
    const elements = {
        date: document.getElementById("date"),
        thu: document.getElementById("dayOfWeek"), // Đã sửa khớp HTML
        tuan: document.getElementById("week"), // Đã sửa khớp HTML
        saveBtn: document.getElementById("save-btn"),
    };

    // 2. Logic tự động tính Thứ/Tuần (Sẽ chạy ngay khi chọn ngày)
    if (elements.date) {
        elements.date.addEventListener("change", function () {
            const dateVal = this.value;
            if (!dateVal) return;
            const dateObj = new Date(dateVal);

            if (elements.thu) {
                const days = [
                    "Chủ Nhật",
                    "Thứ Hai",
                    "Thứ Ba",
                    "Thứ Tư",
                    "Thứ Năm",
                    "Thứ Sáu",
                    "Thứ Bảy",
                ];
                elements.thu.value = days[dateObj.getDay()];
            }

            if (elements.tuan) {
                const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
                const pastDaysOfYear = (dateObj - startOfYear) / 86400000;
                elements.tuan.value = Math.ceil(
                    (pastDaysOfYear + startOfYear.getDay() + 1) / 7,
                );
            }
            console.log("✅ Đã cập nhật thông tin cho ngày:", dateVal);
        });
    }

    // 3. Logic Lưu dữ liệu
    if (elements.saveBtn) {
        elements.saveBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            if (!elements.date.value) {
                alert("Bấy bề chọn ngày đã nhé!");
                return;
            }

            // Kiểm tra hàm API
            if (typeof updateGitHubData !== "function") {
                alert(
                    "LỖI: File github-api.js chưa được nạp hoặc không có hàm updateGitHubData!",
                );
                return;
            }

            try {
                elements.saveBtn.disabled = true;
                elements.saveBtn.innerText = "⌛ ĐANG LƯU...";

                const getVal = (id) =>
                    document.getElementById(id)
                        ? document.getElementById(id).value
                        : "";
                const getListVal = (className) =>
                    Array.from(document.getElementsByClassName(className)).map(
                        (el) => el.value,
                    );

                const payload = {
                    date: elements.date.value,
                    thu: elements.thu.value,
                    tuan: parseInt(elements.tuan.value),
                    gdb: getVal("GDB"), // Chú ý: ID trong HTML của bấy bề là viết hoa GDB
                    g1: getVal("G1"),
                    g2: getVal("G2"),
                    g3: getListVal("G3"),
                    g4: getListVal("G4"),
                    g5: getVal("G5"),
                    g6: getListVal("G6"),
                    g7: getVal("G7"),
                    g8: getVal("G8"),
                };

                await updateGitHubData(payload);
                alert("🎉 Đã lưu dữ liệu thành công lên GitHub!");
            } catch (err) {
                alert("Lỗi khi lưu: " + err.message);
            } finally {
                elements.saveBtn.disabled = false;
                elements.saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
            }
        });
    }
});

// Hàm giả lập nếu bấy bề lỡ bấm trúng onclick trong HTML mà JS chưa nạp kịp
function saveResult() {
    console.log("Nút lưu đã được nhấn!");
}
