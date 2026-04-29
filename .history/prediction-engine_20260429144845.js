// --- PHẦN 1: THUẬT TOÁN DỰ ĐOÁN (FULL FIX ĐỊNH DẠNG & TỐC ĐỘ) ---
function getAdvancedPrediction(data) {
    if (!data || data.length < 50) return [];

    const validData = data.filter((d) => d.results && d.results.G8);
    const recent150 = validData.slice(0, 150);
    const targetDay = validData[0].dayOfWeek;

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

    // Bước 1: Tìm ra Top 20 cái "Đuôi" (2 số cuối) mạnh nhất trước
    let tailScores = [];
    for (let i = 0; i <= 99; i++) {
        const tail = i.toString().padStart(2, "0");
        let s = 0;

        // Tần suất đuôi trong 150 kỳ
        const freq = recent150.filter((d) =>
            Object.values(d.results).some((v) => String(v).endsWith(tail)),
        ).length;
        s += freq * 15;

        // Vía thứ
        const dayFreq = validData
            .slice(0, 500)
            .filter(
                (d) =>
                    d.dayOfWeek === targetDay &&
                    Object.values(d.results).some((v) =>
                        String(v).endsWith(tail),
                    ),
            ).length;
        s += dayFreq * 20;

        tailScores.push({ tail, score: s, freq });
    }
    tailScores.sort((a, b) => b.score - a.score);

    // Bước 2: Ghép "Đầu" vào "Đuôi" dựa trên cấu trúc giải
    return prizeConfig.map((config, pIndex) => {
        let numbersArray = [];
        const qty = config.qty || 1;

        for (let q = 0; q < qty; q++) {
            // Lấy một cái đuôi trong Top (xoay vòng để các giải không trùng số nhau)
            const bestTailObj = tailScores[(pIndex + q) % 20];
            const tail = bestTailObj.tail;

            let fullNumber = "";
            if (config.digits > 2) {
                // Tìm trong lịch sử xem có số nào kết thúc bằng 'tail' này không để lấy phần đầu
                const historyMatch = validData.find((d) =>
                    Object.values(d.results).some(
                        (v) =>
                            String(v).endsWith(tail) &&
                            String(v).length >= config.digits,
                    ),
                );

                if (historyMatch) {
                    // Lấy ngẫu nhiên một số khớp đuôi trong kỳ đó để làm mẫu
                    const matches = Object.values(historyMatch.results).filter(
                        (v) => String(v).endsWith(tail),
                    );
                    const baseNum = String(matches[0]);
                    // Cắt hoặc bù cho đủ số chữ số của giải
                    fullNumber = baseNum
                        .padStart(config.digits, "0")
                        .slice(-config.digits);
                } else {
                    // Nếu không có lịch sử khớp, tự tạo phần đầu ngẫu nhiên nhưng đuôi vẫn chuẩn
                    const head = Math.floor(
                        Math.random() * Math.pow(10, config.digits - 2),
                    )
                        .toString()
                        .padStart(config.digits - 2, "7");
                    fullNumber = head + tail;
                }
            } else {
                fullNumber = tail;
            }
            numbersArray.push(fullNumber);
        }

        return {
            name: config.name,
            numbers: numbersArray,
            score: tailScores[pIndex % 20].score,
            insights:
                tailScores[pIndex % 20].freq > 5
                    ? "Số đang nóng"
                    : "Nhịp rơi đẹp",
            color:
                config.name === "GDB"
                    ? "text-yellow-400"
                    : config.name === "G8"
                      ? "text-red-500"
                      : "text-emerald-400",
        };
    });
}

// --- PHẦN 2: RENDER (GIỮ NGUYÊN HOẶC CHỈNH NHẸ) ---
function renderPrediction() {
    const container = document.getElementById("prediction");
    if (!container) return;
    container.innerHTML = "";

    const finalData = getAdvancedPrediction(rawData);

    finalData.forEach((item) => {
        const numbersHtml = item.numbers
            .map(
                (n) => `
            <div class="text-xl md:text-2xl font-black ${item.color} glow p-1 font-mono tracking-tighter">${n}</div>
        `,
            )
            .join("");

        container.innerHTML += `
            <div class="bg-slate-800 p-4 rounded-xl text-center border border-slate-700 shadow-lg min-w-[140px]">
                <h3 class="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-slate-700/50 pb-1 mb-2">${item.name}</h3>
                <div class="flex flex-wrap justify-center gap-1">
                    ${numbersHtml}
                </div>
                <div class="mt-2 pt-2 border-t border-slate-700/30">
                    <p class="text-[9px] text-gray-500 italic">Tin cậy: ${item.score}%</p>
                    <p class="text-[9px] text-emerald-500 font-bold">${item.insights}</p>
                </div>
            </div>
        `;
    });
}
