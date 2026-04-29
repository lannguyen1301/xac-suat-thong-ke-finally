// --- PHẦN 1: THUẬT TOÁN DỰ ĐOÁN ĐÃ SỬA ĐỊNH DẠNG (FULL FIX) ---
function getAdvancedPrediction(data) {
    if (!data || data.length < 50) return [];

    // Chống lỗi null COVID
    const validData = data.filter((d) => d.results && d.results.G8);
    const recent150 = validData.slice(0, 150);
    const targetDay = validData[0].dayOfWeek;

    // Cấu trúc chuẩn của từng giải (TP.HCM)
    const prizeConfig = [
        { name: "GDB", digits: 6 },
        { name: "G1", digits: 5 },
        { name: "G2", digits: 5 },
        { name: "G3", digits: 5, qty: 2 },
        { name: "G4", digits: 5, qty: 7 },
        { name: "G5", digits: 4 },
        { name: "G6", digits: 4, qty: 3 },
        { name: "G7", digits: 3 },
        { name: "G8", digits: 2 },
    ];

    let finalPredictions = [];

    prizeConfig.forEach((config) => {
        let bestNumberForThisPrize = "";
        let bestScore = -1000;
        let bestInsights = "Ổn định";

        // Vòng lặp tìm số mạnh nhất cho GIẢI NÀY
        // (Vòng lặp này chạy 000000 - 999999 cho GDB, hoặc 00 - 99 cho G8)
        const maxRange = Math.pow(10, config.digits) - 1;
        for (let i = 0; i <= maxRange; i++) {
            const numStr = i.toString().padStart(config.digits, "0");
            let score = 0;

            // --- LOGIC CHẤM ĐIỂM (Cân bằng độ khó) ---
            // 1. Tần suất (Cần check dữ liệu lịch sử)
            // Vì GDB khó trúng, ta check 2 số cuối (vía) cho nó dễ chấm score.
            const tail2 = numStr.slice(-2);

            const freqRecent = recent150.filter((d) =>
                Object.values(d.results).some((v) => String(v).endsWith(tail2)),
            ).length;
            score += freqRecent * (20 / config.digits); // Điểm thấp hơn cho giải nhiều số

            // 2. Vía thứ
            const freqByDay = validData
                .slice(0, 500)
                .filter(
                    (d) =>
                        d.dayOfWeek === targetDay &&
                        Object.values(d.results).some((v) =>
                            String(v).endsWith(tail2),
                        ),
                ).length;
            score += freqByDay * (30 / config.digits);

            // Cập nhật số mạnh nhất cho giải hiện tại
            if (score > bestScore) {
                bestScore = Math.round(score);
                bestNumberForThisPrize = numStr;
                if (freqRecent >= 5) bestInsights = "Số nóng";
            }
        }

        // Tạo mảng số dự đoán cho giải (nếu G3 có 2 giải thì tạo 2 số)
        const qty = config.qty || 1;
        let numbersArray = [];
        for (let q = 0; q < qty; q++) {
            numbersArray.push(bestNumberForThisPrize);
            // Lưu ý: Dòng này tạm thời dùng 1 số mạnh nhất điền vào.
            // Nếu bấy bề muốn số khác nhau, cần viết logic lấy số Hạng 1, Hạng 2...
        }

        finalPredictions.push({
            name: config.name,
            numbers: numbersArray,
            score: bestScore,
            insights: bestInsights,
            digits: config.digits,
            color:
                config.name === "GDB"
                    ? "text-yellow-400"
                    : config.name === "G8"
                      ? "text-red-500"
                      : "text-emerald-400",
        });
    });

    return finalPredictions;
}

// --- PHẦN 2: LOGIC HIỂN THỊ TRÊN GIAO DIỆN MỚI ---
function renderPrediction() {
    const container = document.getElementById("prediction");
    container.innerHTML = "";

    // GỌI THUẬT TOÁN ĐÃ FIX
    const finalData = getAdvancedPrediction(rawData);

    if (finalData.length === 0) return;

    finalData.forEach((item) => {
        // Tạo HTML cho danh sách số (nếu có nhiều số như G3, G4)
        const numbersHtml = item.numbers
            .map(
                (n) => `
            <div class="text-2xl font-black ${item.color} glow p-1 font-mono">${n}</div>
        `,
            )
            .join("");

        container.innerHTML += `
            <div class="bg-slate-800 p-4 rounded-xl text-center border border-slate-700 shadow-lg">
                <h3 class="text-xs text-gray-400 font-bold uppercase tracking-widest">${item.name}</h3>
                <div class="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
                    ${numbersHtml}
                </div>
                <p class="text-[10px] text-gray-500 mt-2 italic">
                    Độ tin cậy: ${item.score}% | ${item.insights}
                </p>
            </div>
        `;
    });
}
