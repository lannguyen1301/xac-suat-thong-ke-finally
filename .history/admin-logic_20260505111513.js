document.addEventListener("DOMContentLoaded", function () {
    const el = {
        date: document.getElementById("date"),
        thu: document.getElementById("dayOfWeek"), // Sửa theo ID trong HTML bấy bề
        tuan: document.getElementById("week"), // Sửa theo ID trong HTML bấy bề
        saveBtn: document.getElementById("save-btn"),
    };

    // Tự động điền Thứ và Tuần
    el.date.addEventListener("change", function () {
        const d = new Date(this.value);
        if (isNaN(d)) return;
        const days = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
        ];
        el.thu.value = days[d.getDay()];

        const start = new Date(d.getFullYear(), 0, 1);
        el.tuan.value = Math.ceil(
            ((d - start) / 86400000 + start.getDay() + 1) / 7,
        );
    });

    // Xử lý nút Lưu
    el.saveBtn.onclick = async function () {
        if (!el.date.value) return alert("Bấy bề chưa chọn ngày!");

        el.saveBtn.disabled = true;
        el.saveBtn.innerText = "⌛ ĐANG LƯU...";

        const getVal = (id) => document.getElementById(id)?.value || "";
        const getList = (cls) =>
            Array.from(document.getElementsByClassName(cls)).map(
                (i) => i.value,
            );

        const payload = {
            date: el.date.value,
            thu: el.thu.value,
            week: parseInt(el.tuan.value),
            gdb: getVal("GDB"),
            g1: getVal("G1"),
            g2: getVal("G2"),
            g3: getList("G3"),
            g4: getList("G4"),
            g5: getVal("G5"),
            g6: getList("G6"),
            g7: getVal("G7"),
            g8: getVal("G8"),
        };

        try {
            await updateGitHubData(payload); // Gọi hàm từ file github-api.js
            alert("✅ Thành công! Dữ liệu đã lên mây.");
            location.reload(); // Load lại để cập nhật bảng lịch sử
        } catch (err) {
            alert("Thất bại: " + err.message);
        } finally {
            el.saveBtn.disabled = false;
            el.saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
        }
    };
});
