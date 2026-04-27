// admin-logic.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin Logic Ready!");
    loadAndPredict();
});

async function loadAndPredict() {
    try {
        // 1. Lấy dữ liệu từ file JSON (Khoảng 1.37MB dữ liệu của bấy bề)
        const response = await fetch("data/xac-suat-thong-ke_clean.json");
        if (!response.ok) throw new Error("Không thể tải dữ liệu!");

        const allData = await response.json();

        // 2. Gọi "Bộ não" từ file prediction-engine.js mà bấy bề vừa tạo
        // Hàm getAdvancedPrediction này nằm trong file prediction-engine.js
        const topResults = getAdvancedPrediction(allData);

        // 3. Hiển thị kết quả dự đoán ra màn hình Admin
        renderPredictionUI(topResults);
    } catch (error) {
        console.error("Lỗi xử lý:", error);
        document.getElementById("prediction-container").innerHTML =
            "<p style='color:red'>Lỗi tải dữ liệu dự đoán!</p>";
    }
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
