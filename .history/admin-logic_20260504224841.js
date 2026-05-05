document.addEventListener("DOMContentLoaded", function () {
    // 1. Kiểm tra sự tồn tại của các thành phần
    const elements = {
        date: document.getElementById("date"),
        thu: document.getElementById("thu"),
        tuan: document.getElementById("tuan"),
        saveBtn: document.getElementById("save-btn"),
    };

    // Báo lỗi nếu thiếu ID trong HTML
    for (const [key, el] of Object.entries(elements)) {
        if (!el) {
            console.error(
                `❌ LỖI: Không tìm thấy ID "${key === "saveBtn" ? "save-btn" : key}" trong file HTML!`,
            );
        }
    }

    // 2. Logic tự động tính Thứ/Tuần
    if (elements.date) {
        elements.date.addEventListener("change", function () {
            const dateVal = this.value;
            if (!dateVal) return;

            const dateObj = new Date(dateVal);

            // Cập nhật Thứ
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

            // Cập nhật Tuần
            if (elements.tuan) {
                const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
                const pastDaysOfYear = (dateObj - startOfYear) / 86400000;
                const weekNum = Math.ceil(
                    (pastDaysOfYear + startOfYear.getDay() + 1) / 7,
                );
                elements.tuan.value = weekNum;
            }
            console.log("✅ Đã tính xong Thứ/Tuần cho:", dateVal);
        });
    }

    // 3. Logic Lưu dữ liệu
    if (elements.saveBtn) {
        elements.saveBtn.addEventListener("click", async function (e) {
            e.preventDefault();
            console.log("🚀 Đang khởi động quy trình lưu...");

            if (!elements.date || !elements.date.value) {
                alert("Bấy bề chưa chọn ngày quay kìa!");
                return;
            }

            // Gọi hàm lưu chính của bấy bề
            if (typeof updateGitHubData === "function") {
                try {
                    elements.saveBtn.disabled = true;
                    elements.saveBtn.innerText = "⌛ ĐANG KẾT NỐI...";

                    // Lấy dữ liệu từ các ô giải thưởng (Dùng querySelector để an toàn hơn)
                    const getVal = (id) => {
                        const el = document.getElementById(id);
                        return el ? el.value : "";
                    };

                    const payload = {
                        date: elements.date.value,
                        thu: elements.thu ? elements.thu.value : "",
                        tuan: elements.tuan ? parseInt(elements.tuan.value) : 0,
                        gdb: getVal("gdb"),
                        g8: getVal("g8"),
                        // Thêm các giải khác ở đây nếu cần bấy bề nhé
                    };

                    await updateGitHubData(payload);

                    elements.saveBtn.disabled = false;
                    elements.saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
                } catch (err) {
                    console.error("Lỗi API:", err);
                    alert("Lỗi rồi bấy bề ơi: " + err.message);
                    elements.saveBtn.disabled = false;
                    elements.saveBtn.innerText = "🚀 THỬ LẠI";
                }
            } else {
                alert(
                    "Không tìm thấy hàm 'updateGitHubData'. Bấy bề kiểm tra lại file script kết nối nhé!",
                );
            }
        });
    }
});
