function getAdvancedPrediction(data) {
    if (!data || data.length === 0) return [];

    // 1. CHUẨN BỊ DỮ LIỆU
    const sortedData = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    const recent100 = sortedData.slice(0, 100);
    const midTerm2Years = sortedData.slice(0, 730);
    const fullHistory = sortedData;

    // Lấy thứ hiện tại theo định dạng trong JSON (ví dụ: "Thứ Hai")
    const days = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
    ];
    const targetDay = days[new Date().getDay()];

    let predictionTable = [];

    for (let i = 0; i <= 99; i++) {
        let numStr = i.toString().padStart(2, "0");
        let score = 0;
        let insights = [];

        // --- LỚP 3: NHỊP NGẮN HẠN (Trọng số 50%) ---
        const counts100 = recent100.filter((d) =>
            d.allNumbers.some((n) => n.toString().endsWith(numStr)),
        ).length;
        score += counts100 * 5;

        // Tính khoảng cách (Gap)
        const lastIndex = recent100.findIndex((d) =>
            d.allNumbers.some((n) => n.toString().endsWith(numStr)),
        );
        const gap = lastIndex === -1 ? 101 : lastIndex;

        if (gap >= 7 && gap <= 15) {
            score += 25;
            insights.push("Nhịp rơi đẹp");
        } else if (gap > 30) {
            score -= 20;
            insights.push("Số gan rủi ro");
        }

        // --- LỚP 2: CHU KỲ THỨ (Trọng số 30%) ---
        const weekdayCounts = midTerm2Years.filter(
            (d) =>
                d.dayOfWeek === targetDay &&
                d.allNumbers.some((n) => n.toString().endsWith(numStr)),
        ).length;

        score += weekdayCounts * 8;
        if (weekdayCounts > 5) insights.push(`Vía ${targetDay} mạnh`); // Đã sửa lỗi typo ở đây

        // --- LỚP 1: THAM CHIẾU LỊCH SỬ (Trọng số 20%) ---
        const historicalGaps = calculateHistoricalGaps(fullHistory, numStr);
        const maxGap = Math.max(...historicalGaps);
        if (gap > maxGap * 0.9) {
            score -= 50;
            insights.push("Cảnh báo kỷ lục gan");
        }

        predictionTable.push({ number: numStr, score, insights });
    }

    // Sắp xếp nhất quán: Score giảm dần -> Tần suất -> Số hiệu
    return predictionTable
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return parseInt(a.number) - parseInt(b.number); // Cố định thứ tự nếu bằng điểm
        })
        .slice(0, 10);
}

function calculateHistoricalGaps(data, num) {
    let gaps = [];
    let currentGap = 0;
    data.forEach((d) => {
        if (d.allNumbers.some((n) => n.toString().endsWith(num))) {
            gaps.push(currentGap);
            currentGap = 0;
        } else {
            currentGap++;
        }
    });
    return gaps.length > 0 ? gaps : [0];
}
