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
