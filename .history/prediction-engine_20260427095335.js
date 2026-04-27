function getAdvancedPrediction(data) {
    // 1. CHUẨN BỊ DỮ LIỆU
    const sortedData = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );
    const recent100 = sortedData.slice(0, 100); // Lớp 3
    const midTerm2Years = sortedData.slice(0, 730); // Lớp 2
    const fullHistory = sortedData; // Lớp 1

    const targetDay = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
    });
    let predictionTable = [];

    for (let i = 0; i <= 99; i++) {
        let numStr = i.toString().padStart(2, "0");
        let score = 0;
        let insights = [];

        // --- LỚP 3: NHỊP NGẮN HẠN (Trọng số 50%) ---
        const counts100 = recent100.filter((d) =>
            d.allNumbers.some((n) => n.endsWith(numStr)),
        ).length;
        score += counts100 * 5; // Ưu tiên số đang "nóng"

        // Tính khoảng cách (Gap)
        const lastIndex = recent100.findIndex((d) =>
            d.allNumbers.some((n) => n.endsWith(numStr)),
        );
        const gap = lastIndex === -1 ? 101 : lastIndex;

        if (gap >= 7 && gap <= 15) {
            score += 25; // Nhịp rơi "vàng" (7-15 ngày)
            insights.push("Nhịp rơi đẹp");
        } else if (gap > 30) {
            score -= 20; // Tránh số gan
            insights.push("Số gan rủi ro");
        }

        // --- LỚP 2: CHU KỲ THỨ (Trọng số 30%) ---
        const weekdayCounts = midTerm2Years.filter(
            (d) =>
                d.dayOfWeek === targetDay &&
                d.allNumbers.some((n) => n.endsWith(numStr)),
        ).length;
        score += weekdayCounts * 8;
        if (weekdayCount > 5) insights.push(`Vía ${targetDay} mạnh`);

        // --- LỚP 1: THAM CHIẾU LỊCH SỬ (Trọng số 20%) ---
        // Kiểm tra xem số này có đang chạm ngưỡng "Gan cực đại" trong 17 năm không
        const historicalGaps = calculateHistoricalGaps(fullHistory, numStr);
        if (gap > Math.max(...historicalGaps) * 0.9) {
            score -= 50; // Cực kỳ nguy hiểm vì sắp phá kỷ lục gan
            insights.push("Cảnh báo kỷ lục gan");
        }

        predictionTable.push({ number: numStr, score, insights });
    }

    // Sắp xếp và lấy Top 10
    return predictionTable.sort((a, b) => b.score - a.score).slice(0, 10);
}

// Hàm phụ tính toán các khoảng gan trong lịch sử
function calculateHistoricalGaps(data, num) {
    let gaps = [];
    let currentGap = 0;
    data.forEach((d) => {
        if (d.allNumbers.some((n) => n.endsWith(num))) {
            gaps.push(currentGap);
            currentGap = 0;
        } else {
            currentGap++;
        }
    });
    return gaps.length > 0 ? gaps : [0];
}
