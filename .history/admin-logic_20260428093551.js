// admin-logic.js

// admin-logic.js

// Biến toàn cục để lưu trữ dữ liệu sau khi tải xong, giúp các hàm khác truy cập dễ dàng
window.currentData = [];

document.addEventListener("DOMContentLoaded", function () {
    console.log("Hệ thống RDU đã sẵn sàng!");
    loadData();
});

// 1. READ: Tải dữ liệu và hiển thị
async function loadData() {
    try {
        const response = await fetch(
            "data/xac-suat-thong-ke_clean.json?t=" + new Date().getTime(),
        );
        if (!response.ok) throw new Error("Không thể tải dữ liệu!");

        window.currentData = await response.json();

        // Cập nhật bảng danh sách (R)
        renderDataTable(window.currentData);

        // Cập nhật bảng dự đoán (Bộ não cũ của bấy bề)
        if (typeof getAdvancedPrediction === "function") {
            const topResults = getAdvancedPrediction(window.currentData);
            renderPredictionUI(topResults);
        }
    } catch (error) {
        console.error("Lỗi xử lý:", error);
    }
}

// Hàm vẽ bảng danh sách (Hiển thị 20 kỳ gần nhất)
function renderDataTable(allData) {
    const tbody = document.getElementById("data-table-body");
    if (!tbody) return;

    // Sắp xếp ngày mới nhất lên đầu
    const recentData = [...allData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

    tbody.innerHTML = recentData
        .map(
            (item) => `
        <tr class="hover:bg-blue-50 transition border-b">
            <td class="p-3">${item.date}</td>
            <td class="p-3">${item.dayOfWeek}</td>
            <td class="p-3 font-bold text-red-600">${item.results.GDB}</td>
            <td class="p-3 text-center space-x-2">
                <button onclick="editEntry('${item.date}')" class="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600">Sửa</button>
                <button onclick="deleteEntry('${item.date}')" class="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600">Xóa</button>
            </td>
        </tr>
    `,
        )
        .join("");
}

// 2. UPDATE (U): Đổ dữ liệu ngược lên Form
function editEntry(date) {
    const entry = window.currentData.find((item) => item.date === date);
    if (!entry) return;

    // Điền dữ liệu vào Form
    document.getElementById("date").value = entry.date;
    document.getElementById("day").value = entry.dayOfWeek;
    document.getElementById("round").value = entry.week;
    document.getElementById("gdb").value = entry.results.GDB;
    document.getElementById("g1").value = entry.results.G1;
    document.getElementById("g2").value = entry.results.G2;
    document.getElementById("g5").value = entry.results.G5;
    document.getElementById("g7").value = entry.results.G7;
    document.getElementById("g8").value = entry.results.G8;

    // Điền các giải có nhiều ô (G3, G4, G6)
    const fillInputs = (className, values) => {
        const inputs = document.querySelectorAll(`.${className}`);
        inputs.forEach((input, i) => {
            input.value = values[i] || "";
        });
    };
    fillInputs("g3", entry.results.G3);
    fillInputs("g4", entry.results.G4);
    fillInputs("g6", entry.results.G6);

    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Đã nạp dữ liệu ngày " + date + " lên form để bấy bề sửa.");
}

// 3. DELETE (D): Xóa dữ liệu (Sẽ gọi hàm updateGitHub của bấy bề)
async function deleteEntry(date) {
    if (
        !confirm(
            `Bấy bề có thực sự muốn xóa ngày ${date} không? Vĩnh viễn đấy!`,
        )
    )
        return;

    // Lọc bỏ dữ liệu cũ
    const filteredData = window.currentData.filter(
        (item) => item.date !== date,
    );

    // Ở đây mình cần một hàm để "Đẩy mảng mới này lên GitHub"
    // Bấy bề có thể gọi hàm updateGitHub nhưng truyền thêm một tham số "isDelete"
    // Hoặc đơn giản là tạo một hàm chuyên để ghi đè.

    // Tôi sẽ hướng dẫn bấy bề cách tích hợp vào hàm updateGitHub hiện có của bấy bề sau nhé!
    console.log("Đã sẵn sàng xóa ngày: " + date);
    alert("Tính năng xóa đang chờ kết nối với hàm Push GitHub của bấy bề!");
}

// Giữ lại hàm renderPredictionUI cũ của bấy bề ở đây...
function renderPredictionUI(list) {
    const container = document.getElementById("prediction-container");
    if (!container) return;
    // ... (Giữ nguyên phần code giao diện dự đoán hôm qua của mình) ...
}

function renderPredictionUI(list) {
    const container = document.getElementById("prediction-container");
    if (!container) return;

    let html = `
        <div class="prediction-card">
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                🎯 Dự Đoán Tin Cậy (Dựa trên Phễu 3 Lớp)
            </h2>
            <div class="prediction-grid">
    `;

    list.forEach((item, index) => {
        // Tính toán màu sắc dựa trên điểm số (Score càng cao càng xanh)
        const badgeColor =
            item.score > 120
                ? "#27ae60"
                : item.score > 70
                  ? "#f39c12"
                  : "#7f8c8d";

        html += `
            <div class="prediction-item" style="border-left: 5px solid ${badgeColor}; margin-bottom: 15px; padding: 10px; background: #f9f9f9;">
                <span style="font-size: 1.2em; font-weight: bold;">Top ${index + 1}: Số ${item.number}</span>
                <span style="float: right; background: ${badgeColor}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8em;">
                    Trust Score: ${item.score}
                </span>
                <p style="margin: 5px 0 0; font-size: 0.9em; color: #666;">
                    💡 Phân tích: ${item.insights.length > 0 ? item.insights.join(" | ") : "Dữ liệu ổn định"}
                </p>
            </div>
        `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}
