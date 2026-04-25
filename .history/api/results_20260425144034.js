// const data = require("../data/xac-suat-thong-ke_clean.json");

// module.exports = (req, res) => {
//     // CORS
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
//     res.setHeader("Content-Type", "application/json");

//     if (req.method === "OPTIONS") {
//         return res.status(200).end();
//     }

//     const { date, week, latest } = req.query;

//     let results = [...data]; // copy array

//     // Lọc theo ngày
//     if (date) {
//         results = results.filter((item) => item.date === date);
//     }

//     // Lọc theo tuần
//     if (week) {
//         results = results.filter((item) => item.week === parseInt(week));
//     }

//     // Lấy kỳ mới nhất
//     if (latest === "true") {
//         results = [results[results.length - 1]];
//     }

//     res.status(200).json({
//         success: true,
//         count: results.length,
//         data: results,
//     });
// };

const data = require("../data/xac-suat-thong-ke_clean.json");

export default function handler(req, res) {
    // CORS & Header
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") return res.status(200).end();

    const { date, week, latest } = req.query;

    // 1. Nếu lấy kỳ mới nhất, trả về ngay lập tức để tiết kiệm tài nguyên
    if (latest === "true") {
        return res.status(200).json({
            success: true,
            data: data[data.length - 1],
        });
    }

    // 2. Lọc dữ liệu
    let filteredData = data;

    if (date) {
        // Khớp hoàn toàn với tên biến 'date' bạn mới sửa trong Python
        filteredData = filteredData.filter((item) => item.date === date);
    }

    if (week) {
        // So sánh chuỗi cho an toàn (vì query param luôn là chuỗi)
        filteredData = filteredData.filter(
            (item) => String(item.week) === String(week),
        );
    }

    // 3. Trả về kết quả kèm metadata
    res.status(200).json({
        success: true,
        count: filteredData.length,
        data: filteredData,
    });
}
