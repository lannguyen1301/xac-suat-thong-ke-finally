// admin-logic.js - BẢN FIX TOÀN DIỆN
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("date");
    const thuInput = document.getElementById("thu");
    const tuanInput = document.getElementById("tuan");
    const saveBtn = document.getElementById("save-btn");

    // 1. Hàm tự động tính Thứ và Tuần khi chọn ngày
    dateInput.addEventListener("change", function () {
        const dateVal = this.value; // Trình duyệt luôn trả về yyyy-mm-dd
        if (!dateVal) return;

        const dateObj = new Date(dateVal);

        // Tính Thứ
        const days = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
        ];
        thuInput.value = days[dateObj.getDay()];

        // Tính Tuần (Dựa trên năm của ngày được chọn)
        const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
        const pastDaysOfYear = (dateObj - startOfYear) / 86400000;
        const weekNum = Math.ceil(
            (pastDaysOfYear + startOfYear.getDay() + 1) / 7,
        );
        tuanInput.value = weekNum;

        console.log("Đã cập nhật Thứ/Tuần cho ngày:", dateVal);
    });

    // 2. Hàm Lưu Dữ Liệu
    saveBtn.addEventListener("click", async function () {
        const dateValue = dateInput.value;
        if (!dateValue) {
            alert("Bấy bề chưa chọn ngày kìa!");
            return;
        }

        // Gom dữ liệu từ các ô input
        const newData = {
            date: dateValue, // Lưu chuẩn yyyy-mm-dd
            thu: thuInput.value,
            tuan: parseInt(tuanInput.value),
            gdb: document.getElementById("gdb").value,
            g1: document.getElementById("g1").value,
            g2: document.getElementById("g2").value,
            g3: [
                document.getElementById("g3_1").value,
                document.getElementById("g3_2").value,
            ],
            g4: [
                document.getElementById("g4_1").value,
                document.getElementById("g4_2").value,
                document.getElementById("g4_3").value,
                document.getElementById("g4_4").value,
                document.getElementById("g4_5").value,
                document.getElementById("g4_6").value,
                document.getElementById("g4_7").value,
            ],
            g5: document.getElementById("g5").value,
            g6: [
                document.getElementById("g6_1").value,
                document.getElementById("g6_2").value,
                document.getElementById("g6_3").value,
            ],
            g7: document.getElementById("g7").value,
            g8: document.getElementById("g8").value,
        };

        // Code gọi API GitHub của bấy bề tiếp tục ở đây...
        // Đảm bảo bấy bề đã có hàm updateGitHubData(newData) ở dưới
        console.log("Dữ liệu sẵn sàng để lưu:", newData);

        // Gọi hàm lưu (Giữ nguyên hàm update cũ của bấy bề nhé)
        if (typeof updateGitHubData === "function") {
            saveBtn.disabled = true;
            saveBtn.innerText = "⌛ ĐANG LƯU...";
            await updateGitHubData(newData);
            saveBtn.disabled = false;
            saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
        }
    });
});
