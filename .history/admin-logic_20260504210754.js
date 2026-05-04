// admin-logic.js

let currentData = [];
let githubToken = localStorage.getItem("github_token") || "";

const OWNER = "lannguyen1301";
const REPO = "xac-suat-thong-ke-finally";
const PATH = "data/xac-suat-thong-ke_clean.json";
const BRANCH = "main";

// Hàm tính Thứ và Tuần
function updateAutoFields(dateString) {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return;

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

// Khởi tạo khi trang web load xong
document.addEventListener("DOMContentLoaded", () => {
    loadData();

    const dateInput = document.getElementById("date");
    if (dateInput) {
        // Lắng nghe sự kiện thay đổi ngày
        dateInput.addEventListener("input", (e) =>
            updateAutoFields(e.target.value),
        );
        dateInput.addEventListener("change", (e) =>
            updateAutoFields(e.target.value),
        );
    }
});

async function loadData() {
    try {
        const res = await fetch(`${PATH}?t=${Date.now()}`);
        if (res.ok) {
            currentData = await res.json();
            renderHistoryTable();
        }
    } catch (err) {
        console.log("Chưa có data hoặc lỗi load.");
    }
}

function renderHistoryTable() {
    const tbody = document.getElementById("table-body");
    if (!tbody) return;
    const recent = [...currentData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 15);
    tbody.innerHTML = recent
        .map(
            (item) => `
        <tr class="border-b border-slate-800">
            <td class="p-4">${item.date}</td>
            <td class="p-4">${item.dayOfWeek}</td>
            <td class="p-4 text-center text-rose-400 font-bold">${item.results.GDB}</td>
            <td class="p-4 text-center text-orange-400 font-bold">${item.results.G8}</td>
            <td class="p-4 text-center">
                <button onclick="editEntry('${item.date}')" class="text-sky-400 mr-2">Sửa</button>
                <button onclick="deleteEntry('${item.date}')" class="text-rose-400">Xóa</button>
            </td>
        </tr>
    `,
        )
        .join("");
}

async function saveResult() {
    // Kiểm tra GitHub Token trước khi chạy tiếp
    if (!githubToken) {
        githubToken = prompt("Vui lòng nhập GitHub Token để lưu dữ liệu:");
        if (!githubToken) return;
        localStorage.setItem("github_token", githubToken);
    }

    const date = document.getElementById("date").value;
    if (!date) return alert("Bấy bề chưa chọn ngày kìa!");

    try {
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
                G8: document.getElementById("G8").value, // Chỗ này hết lỗi rồi nè
            },
        };

        const idx = currentData.findIndex((item) => item.date === date);
        if (idx !== -1) currentData[idx] = newEntry;
        else currentData.push(newEntry);

        await pushToGitHub(currentData, `Update ${date}`);
    } catch (e) {
        alert("Lỗi code rồi bấy bề ơi: " + e.message);
    }
}

async function pushToGitHub(newData, msg) {
    const content = btoa(
        unescape(encodeURIComponent(JSON.stringify(newData, null, 2))),
    );
    try {
        const meta = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
            {
                headers: { Authorization: `token ${githubToken}` },
            },
        ).then((r) => r.json());

        const res = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${githubToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: msg,
                    content: content,
                    sha: meta.sha,
                }),
            },
        );

        if (res.ok) {
            alert("✅ Ngon lành! Đã lên mây.");
            location.reload();
        } else {
            alert("Lỗi khi đẩy lên GitHub. Check lại Token bấy bề ơi.");
        }
    } catch (e) {
        alert("Lỗi kết nối API.");
    }
}

function clearToken() {
    localStorage.removeItem("github_token");
    location.reload();
}
