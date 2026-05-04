document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin Logic đã sẵn sàng!");

    const dateInput = document.getElementById("date");
    const thuInput = document.getElementById("thu");
    const tuanInput = document.getElementById("tuan");
    const saveBtn = document.getElementById("save-btn");

    // 1. Logic tự động tính Thứ/Tuần khi chọn ngày
    if (dateInput) {
        dateInput.addEventListener("change", function () {
            const dateVal = this.value;
            console.log("Ngày đã chọn:", dateVal);

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
            if (thuInput) {
                thuInput.value = days[dateObj.getDay()];
            }

            // Tính Tuần
            const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
            const pastDaysOfYear = (dateObj - startOfYear) / 86400000;
            const weekNum = Math.ceil(
                (pastDaysOfYear + startOfYear.getDay() + 1) / 7,
            );
            if (tuanInput) {
                tuanInput.value = weekNum;
            }
        });
    }

    // 2. Logic Lưu dữ liệu
    if (saveBtn) {
        saveBtn.addEventListener("click", async function (e) {
            e.preventDefault(); // Chống reload trang
            console.log("Đang nhấn nút Lưu...");

            if (!dateInput.value) {
                alert("Bấy bề ơi, chọn ngày đã nhé!");
                return;
            }

            try {
                // Thu thập dữ liệu (Dùng querySelector để tránh lỗi ID sai)
                const getVal = (id) =>
                    document.getElementById(id)
                        ? document.getElementById(id).value
                        : "";

                const newData = {
                    date: dateInput.value,
                    thu: thuInput.value,
                    tuan: parseInt(tuanInput.value) || 0,
                    gdb: getVal("gdb"),
                    g1: getVal("g1"),
                    g2: getVal("g2"),
                    g3: [getVal("g3_1"), getVal("g3_2")],
                    g4: [
                        getVal("g4_1"),
                        getVal("g4_2"),
                        getVal("g4_3"),
                        getVal("g4_4"),
                        getVal("g4_5"),
                        getVal("g4_6"),
                        getVal("g4_7"),
                    ],
                    g5: getVal("g5"),
                    g6: [getVal("g6_1"), getVal("g6_2"), getVal("g6_3")],
                    g7: getVal("g7"),
                    g8: getVal("g8"),
                };

                console.log("Dữ liệu chuẩn bị gửi:", newData);

                // Gọi hàm update của bấy bề
                if (typeof updateGitHubData === "function") {
                    saveBtn.disabled = true;
                    saveBtn.innerText = "⌛ ĐANG LƯU...";
                    await updateGitHubData(newData);
                    saveBtn.disabled = false;
                    saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
                } else {
                    console.error("Không tìm thấy hàm updateGitHubData!");
                    alert("Lỗi: Không tìm thấy hàm kết nối GitHub!");
                }
            } catch (error) {
                console.error("Lỗi khi xử lý dữ liệu:", error);
                alert("Có lỗi xảy ra: " + error.message);
            }
        });
    } else {
        console.error("Không tìm thấy nút save-btn trong HTML!");
    }
});
