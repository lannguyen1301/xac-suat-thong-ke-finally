const data = require("../data/xac-suat-thong-ke_clean.json");

module.exports = (req, res) => {
    // Cho phép CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Content-Type", "application/json");

    // Xử lý preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { date, week, period } = req.query;

    let results = data;

    // Lọc theo ngày
    if (date) {
        results = data.filter((item) => item.date === date);
    }
    // Lọc theo tuần
    else if (week) {
        const year = req.query.year || new Date().getFullYear();
        results = data.filter((item) => item.week == week);
    }

    // Lấy kỳ mới nhất
    if (req.query.latest === "true") {
        results = [data[data.length - 1]];
    }

    res.status(200).json({
        success: true,
        count: results.length,
        data: results,
    });
};
