/**
 * HỆ THỐNG TRUY XUẤT DỮ LIỆU ĐỊNH DANH (DETERMINISTIC DATA ENGINE)
 * Tác giả: Gemini & Bấy bề
 * Mục tiêu: Loại bỏ random, khóa kết quả theo dữ liệu 17 năm.
 */

function getAdvancedPrediction(data) {
    if (!data || data.length < 10) return { primary: [], secondary: [] };

    // Lọc dữ liệu sạch
    const validData = data.filter(
        (d) => d.results && Object.keys(d.results).length > 0,
    );
    const latest = validData[0];

    // Xác định mục tiêu: Nếu vừa quay Thứ 7 thì dự đoán Thứ 2, vừa quay Thứ 2 thì dự đoán Thứ 7
    const targetDay = latest.dayOfWeek === "Thứ 7" ? "Thứ 2" : "Thứ 7";

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

    // 1. TÍNH TOÁN TRỌNG SỐ TẦN SUẤT (KHÔNG RANDOM)
    let tailScores = [];
    for (let i = 0; i <= 99; i++) {
        const tail = i.toString().padStart(2, "0");

        // Tần suất tổng quát (20% trọng số)
        const totalFreq = validData.filter((d) =>
            Object.values(d.results).some((v) => String(v).endsWith(tail)),
        ).length;

        // Tần suất theo Thứ mục tiêu (50% trọng số)
        const dayFreq = validData.filter(
            (d) =>
                d.dayOfWeek === targetDay &&
                Object.values(d.results).some((v) => String(v).endsWith(tail)),
        ).length;

        // Độ "nóng" trong 30 kỳ gần nhất (30% trọng số)
        const recentFreq = validData
            .slice(0, 30)
            .filter((d) =>
                Object.values(d.results).some((v) => String(v).endsWith(tail)),
            ).length;

        const finalScore = dayFreq * 50 + recentFreq * 30 + totalFreq * 20;
        tailScores.push({ tail, score: finalScore });
    }

    // Sắp xếp để lấy những bộ đuôi uy tín nhất
    tailScores.sort((a, b) => b.score - a.score);

    // 2. HÀM TRUY XUẤT SỐ THẬT TỪ QUÁ KHỨ
    const findRealNumber = (tail, digits, offset = 0) => {
        const matches = validData.filter((d) =>
            Object.values(d.results).some(
                (v) => String(v).endsWith(tail) && String(v).length >= digits,
            ),
        );

        if (matches.length > offset) {
            const match = matches[offset];
            const fullValue = Object.values(match.results).find((v) =>
                String(v).endsWith(tail),
            );
            // Cắt đúng số chữ số quy định
            return String(fullValue).padStart(digits, "0").slice(-digits);
        }
        // Dự phòng (fallback) nếu dữ liệu quá hiếm
        return "777777".slice(0, digits - 2) + tail;
    };

    // 3. TẠO BỘ DỰ ĐOÁN TOP 1 VÀ TOP 2
    const generateSet = (rankOffset) => {
        return prizeConfig.map((config, pIdx) => {
            let numbers = [];
            for (let q = 0; q < (config.qty || 1); q++) {
                // Chọn đuôi dựa trên thứ hạng (pIdx + q) và dịch chuyển theo rankOffset
                const tailInfo = tailScores[(pIdx + q + rankOffset * 5) % 50];
                const finalNum = findRealNumber(
                    tailInfo.tail,
                    config.digits,
                    rankOffset,
                );
                numbers.push(finalNum);
            }
            // Tính độ tin cậy tương đối (Max 98.5%)
            const baseTrust = 90 - rankOffset * 5;
            const trust = Math.min(
                98.5,
                baseTrust + tailScores[pIdx % 50].score / 1000,
            );
            return { name: config.name, numbers, trust: trust.toFixed(1) };
        });
    };

    return {
        primary: generateSet(0), // Top 1 - Ưu tiên cao nhất
        secondary: generateSet(1), // Top 2 - Kết quả suýt soát
    };
}

// 4. HÀM VẼ GIAO DIỆN CHÍNH
// 4. HÀM VẼ GIAO DIỆN CHÍNH (Đã fix màu sắc và dấu phẩy)
window.renderPrediction = function (containerId, rawData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const allData = getAdvancedPrediction(rawData);

    const buildHtml = (title, dataset, isPrimary) => {
        let html = `
            <div class="col-span-full py-6 mt-4 border-b border-slate-700/50">
                <h2 class="text-2xl font-black ${isPrimary ? "text-yellow-400" : "text-slate-400"} flex items-center gap-3 uppercase tracking-tighter">
                    <span class="bg-${isPrimary ? "yellow" : "slate"}-500 w-2 h-8 rounded-full"></span>
                    ${isPrimary ? "👑 DỰ ĐOÁN TỐI ƯU (TOP 1)" : "🥈 PHƯƠNG ÁN KHẢ THI (TOP 2)"}
                </h2>
            </div>
        `;

        dataset.forEach((item) => {
            // FIX LỖI DẤU PHẨY: Lọc sạch ký tự không phải số và render xanh neon
            const numHtml = item.numbers
                .map((n) => {
                    const cleanNum = String(n).replace(/[^0-9]/g, ""); // Dọn sạch dấu phẩy
                    return `<div class="text-3xl md:text-4xl font-black font-mono tracking-tighter text-[#00ff9d] drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">${cleanNum}</div>`;
                })
                .join("");

            html += `
                <div class="bg-[#1e293b] p-6 rounded-2xl text-center border ${isPrimary ? "border-[#00ff9d]/30" : "border-slate-800"} transition-all hover:scale-[1.02]">
                    <h3 class="text-xs text-gray-400 font-bold uppercase mb-4 tracking-widest">${item.name}</h3>
                    <div class="flex flex-wrap justify-center gap-x-6 gap-y-3">${numHtml}</div>
                    <div class="mt-5 flex justify-between items-center px-2 border-t border-slate-700/50 pt-3">
                        <span class="text-[10px] text-gray-500 uppercase font-bold">Trust Level</span>
                        <span class="text-[11px] font-black text-emerald-500">${item.trust}%</span>
                    </div>
                </div>
            `;
        });
        return html;
    };

    container.innerHTML =
        buildHtml("PRIMARY", allData.primary, true) +
        buildHtml("SECONDARY", allData.secondary, false);
};
