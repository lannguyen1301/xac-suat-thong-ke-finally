// prediction-engine.js
// Thuật toán dự đoán Xổ số TP.HCM - Phiên bản nâng cao 2026

function getAdvancedPrediction(data) {
    if (!data || data.length < 100) {
        console.warn("Dữ liệu chưa đủ để phân tích");
        return [];
    }

    // Sắp xếp dữ liệu mới nhất lên đầu
    const sortedData = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    const recent150 = sortedData.slice(0, 150); // Ngắn hạn
    const recent500 = sortedData.slice(0, 500); // Trung hạn
    const fullHistory = sortedData; // Toàn bộ lịch sử

    // Xác định thứ của kỳ quay tiếp theo (dựa vào kỳ mới nhất)
    const latestDay = sortedData[0].dayOfWeek;
    const targetDay = latestDay;

    let predictionTable = [];

    // Dự đoán cho Giải 8 (2 số cuối)
    for (let i = 0; i <= 99; i++) {
        const numStr = i.toString().padStart(2, "0");
        let score = 0;
        let insights = [];
        let weight = 0;

        // ── LỚP 1: Tần suất ngắn hạn (Trọng số 35%) ──
        const freqRecent = recent150.filter((d) =>
            d.allNumbers.some((n) => String(n).endsWith(numStr)),
        ).length;
        score += freqRecent * 14;
        weight += 35;

        if (freqRecent >= 8) insights.push("Số nóng ngắn hạn");

        // ── LỚP 2: Vía theo thứ trong tuần (Trọng số 30%) ──
        const freqByDay = recent500.filter(
            (d) =>
                d.dayOfWeek === targetDay &&
                d.allNumbers.some((n) => String(n).endsWith(numStr)),
        ).length;
        score += freqByDay * 18;
        weight += 30;

        if (freqByDay >= 5) insights.push(`Vía ${targetDay} mạnh`);

        // ── LỚP 3: Gap Analysis (Khoảng cách - Trọng số 25%) ──
        const lastIndex = recent150.findIndex((d) =>
            d.allNumbers.some((n) => String(n).endsWith(numStr)),
        );
        const gap = lastIndex === -1 ? 151 : lastIndex;

        if (gap >= 7 && gap <= 16) {
            score += 42;
            insights.push("Nhịp rơi đẹp");
        } else if (gap > 28 && gap < 45) {
            score += 15;
            insights.push("Sắp về");
        } else if (gap > 60) {
            score -= 30;
            insights.push("Gan quá dài");
        }

        // ── LỚP 4: Lịch sử dài hạn + Độ lệch (Trọng số 10%) ──
        const totalAppear = fullHistory.filter((d) =>
            d.allNumbers.some((n) => String(n).endsWith(numStr)),
        ).length;

        const expected = fullHistory.length / 100;
        const deviation = (totalAppear - expected) / expected;

        if (deviation < -0.25)
            score -= 12; // Số lạnh quá
        else if (deviation > 0.3) score += 8; // Số quá nóng

        predictionTable.push({
            number: numStr,
            score: Math.round(score),
            insights: insights,
            frequency: freqRecent,
            gap: gap,
        });
    }

    // Sắp xếp theo điểm số giảm dần
    return predictionTable.sort((a, b) => b.score - a.score).slice(0, 15); // Lấy top 15 số tốt nhất
}

// Export để dùng ở các file khác
window.getAdvancedPrediction = getAdvancedPrediction;
