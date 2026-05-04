// admin-logic.js

// 1. Khai báo các biến cấu hình (Bấy bề giữ nguyên thông số của mình nhé)
const OWNER = "lannguyen1301";
const REPO = "xac-suat-thong-ke-finally";
const PATH = "data/xac-suat-thong-ke_clean.json";
let currentData = [];

// 2. Hàm lấy hoặc yêu cầu Token (Đúng ý bấy bề nè)
function getGitHubToken() {
    let token = localStorage.getItem("github_token");
    if (!token) {
        token = prompt(
            "Vui lòng nhập GitHub Personal Access Token để tiếp tục:",
        );
        if (token) {
            localStorage.setItem("github_token", token);
        }
    }
    return token;
}

// 3. Hàm tính Thứ và Tuần tự động
function updateAutoFields(dateString) {
    if (!dateString) return;
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return;

    // Tự nhảy Thứ
    const days = [
        "Chủ Nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
    ];
    document.getElementById("dayOfWeek").value = days[dateObj.getDay()];

    // Tự nhảy Tuần/Kỳ
    const tempDate = new Date(dateObj.valueOf());
    const dayNum = (dateObj.getDay() + 6) % 7;
    tempDate.setDate(tempDate.getDate() - dayNum + 3);
    const firstThursday = tempDate.valueOf();
    tempDate.setMonth(0, 1);
    if (tempDate.getDay() !== 4)
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
    const weekNumber = 1 + Math.ceil((firstThursday - tempDate) / 604800000);

    document.getElementById("week").value = weekNumber;
}

// 4. Lắng nghe sự kiện khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
    loadData(); // Gọi hàm lấy dữ liệu từ API để hiện bảng lịch sử

    const dateInput = document.getElementById("date");
    if (dateInput) {
        // Lắng nghe cả input và change để đảm bảo chọn trên mobile hay PC đều nhảy
        dateInput.addEventListener("input", (e) =>
            updateAutoFields(e.target.value),
        );
        dateInput.addEventListener("change", (e) =>
            updateAutoFields(e.target.value),
        );
    }
});

// 5. Hàm lưu kết quả (Kết hợp API và Token)
async function saveResult() {
    const token = getGitHubToken();
    if (!token) return; // Nếu không có token thì dừng luôn

    const date = document.getElementById("date").value;
    if (!date) return alert("Bấy bề chọn ngày đã chứ!");

    // Thu thập dữ liệu từ form
    const newEntry = {
        date: date,
        dayOfWeek: document.getElementById("dayOfWeek").value,
        week: parseInt(document.getElementById("week").value),
        results: {
            GDB: document.getElementById("GDB").value,
            G1: document.getElementById("G1").value,
            G2: document.getElementById("G2").value,
            G3: Array.from(document.querySelectorAll(".G3")).map(
                (i) => i.value,
            ),
            G4: Array.from(document.querySelectorAll(".G4")).map(
                (i) => i.value,
            ),
            G5: document.getElementById("G5").value,
            G6: Array.from(document.querySelectorAll(".G6")).map(
                (i) => i.value,
            ),
            G7: document.getElementById("G7").value,
            G8: document.getElementById("G8").value, // Nhớ sửa id="G8" trong HTML nhé
        },
    };

    // Logic gọi API PUT của GitHub để lưu file (Dùng token đã lấy)
    await pushToGitHub(newEntry, token);
}

// 6. Hàm xoá Token (Nút bấy bề đã có trong HTML)
function clearToken() {
    if (confirm("Xác nhận xoá Token khỏi trình duyệt?")) {
        localStorage.removeItem("github_token");
        alert("Đã xoá Token thành công.");
        location.reload();
    }
}

// --- Bấy bề giữ lại các hàm loadData(), renderHistoryTable() và pushToGitHub() cũ của mình bên dưới nhé ---
