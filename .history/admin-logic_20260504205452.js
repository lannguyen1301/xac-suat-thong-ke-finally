// admin-logic.js - Logic cho trang Admin (Bản Tối Ưu Tự Động)

let currentData = [];
let githubToken = localStorage.getItem("github_token") || "";

const OWNER = "lannguyen1301";
const REPO = "xac-suat-thong-ke-finally";
const PATH = "data/xac-suat-thong-ke_clean.json";
const BRANCH = "main";

document.addEventListener("DOMContentLoaded", () => {
    loadData();

    // --- LẮNG NGHE SỰ KIỆN CHỌN NGÀY ---
    const dateInput = document.getElementById("date");
    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            const selectedDate = e.target.value;
            if (selectedDate) {
                updateAutoFields(selectedDate);
            }
        });
    }
});

// ====================== 0. TỰ ĐỘNG TÍNH THỨ & TUẦN ======================
function updateAutoFields(dateString) {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return;

    // 1. Tính Thứ
    const days = [
        "Chủ Nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
    ];
    const dayName = days[dateObj.getDay()];

    const dayField = document.getElementById("dayOfWeek");
    if (dayField) dayField.value = dayName;

    // 2. Tính Tuần/Kỳ (Theo tiêu chuẩn ISO-8601)
    const tempDate = new Date(dateObj.valueOf());
    const dayNum = (dateObj.getDay() + 6) % 7;
    tempDate.setDate(tempDate.getDate() - dayNum + 3);
    const firstThursday = tempDate.valueOf();
    tempDate.setMonth(0, 1);
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
    }
    const weekNumber = 1 + Math.ceil((firstThursday - tempDate) / 604800000);

    const weekField = document.getElementById("week");
    if (weekField) weekField.value = weekNumber;

    console.log(`Đã cập nhật: ${dayName}, Tuần: ${weekNumber}`);
}

// ====================== 1. LOAD DATA ======================
async function loadData() {
    try {
        const res = await fetch(
            `data/xac-suat-thong-ke_clean.json?t=${Date.now()}`,
        );
        if (!res.ok) throw new Error("Không tải được dữ liệu");
        currentData = await res.json();
        renderHistoryTable();
    } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu: " + err.message);
    }
}

// ====================== 2. RENDER TABLE ======================
function renderHistoryTable() {
    const tbody = document.getElementById("table-body");
    if (!tbody) return;

    const recent = [...currentData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 15);

    tbody.innerHTML = recent
        .map(
            (item) => `
        <tr class="border-b hover:bg-slate-800/50 transition-colors">
            <td class="p-4">${item.date}</td>
            <td class="p-4 font-bold text-emerald-400">${item.dayOfWeek || ""}</td>
            <td class="p-4 font-black text-yellow-400 font-mono">${item.results?.GDB || "------"}</td>
            <td class="p-4 text-center font-mono text-red-400">${item.results?.G8 || "--"}</td>
            <td class="p-4 text-center">
                <button onclick="editEntry('${item.date}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-sm mr-1">Sửa</button>
                <button onclick="deleteEntry('${item.date}')" 
                        class="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded shadow-sm">Xóa</button>
            </td>
        </tr>
    `,
        )
        .join("");
}

// ====================== 3. EDIT ENTRY ======================
function editEntry(date) {
    const entry = currentData.find((item) => item.date === date);
    if (!entry) return alert("Không tìm thấy dữ liệu!");

    document.getElementById("date").value = entry.date;
    document.getElementById("dayOfWeek").value = entry.dayOfWeek || "";
    document.getElementById("week").value = entry.week || "";

    // Điền các giải đơn
    ["GDB", "G1", "G2", "G5", "G7", "G8"].forEach((id) => {
        if (document.getElementById(id))
            document.getElementById(id).value = entry.results?.[id] || "";
    });

    // Điền giải nhiều số
    fillMultipleInputs("G3", entry.results?.G3 || []);
    fillMultipleInputs("G4", entry.results?.G4 || []);
    fillMultipleInputs("G6", entry.results?.G6 || []);

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function fillMultipleInputs(className, values) {
    const inputs = document.querySelectorAll(`.${className}`);
    inputs.forEach((input, index) => {
        input.value = values[index] || "";
    });
}

// ====================== 4. CLEAR FORM ======================
function clearForm() {
    document.getElementById("date").value = "";
    document.getElementById("dayOfWeek").value = "Thứ 7";
    document.getElementById("week").value = "";
    ["GDB", "G1", "G2", "G5", "G7", "G8"].forEach((id) => {
        if (document.getElementById(id)) document.getElementById(id).value = "";
    });
    document
        .querySelectorAll(".G3, .G4, .G6")
        .forEach((input) => (input.value = ""));
}

// ====================== 5. SAVE RESULT ======================
async function saveResult() {
    const date = document.getElementById("date").value;
    if (!date) return alert("Vui lòng chọn ngày quay!");

    const newEntry = {
        date: date,
        dayOfWeek: document.getElementById("dayOfWeek").value,
        week: parseInt(document.getElementById("week").value) || 0,
        isRestDay: false,
        results: {
            GDB: document.getElementById("GDB").value.trim(),
            G1: document.getElementById("G1").value.trim(),
            G2: document.getElementById("G2").value.trim(),
            G3: Array.from(document.querySelectorAll(".G3"))
                .map((i) => i.value.trim())
                .filter((v) => v),
            G4: Array.from(document.querySelectorAll(".G4"))
                .map((i) => i.value.trim())
                .filter((v) => v),
            G5: document.getElementById("G5").value.trim(),
            G6: Array.from(document.querySelectorAll(".G6"))
                .map((i) => i.value.trim())
                .filter((v) => v),
            G7: document.getElementById("G7").value.trim(),
            G8: document.getElementById("G8").value.trim(),
        },
    };

    newEntry.allNumbers = [
        newEntry.results.GDB,
        newEntry.results.G1,
        newEntry.results.G2,
        ...newEntry.results.G3,
        ...newEntry.results.G4,
        newEntry.results.G5,
        ...newEntry.results.G6,
        newEntry.results.G7,
        newEntry.results.G8,
    ].filter(Boolean);

    const existingIndex = currentData.findIndex((item) => item.date === date);
    if (existingIndex !== -1) {
        if (!confirm(`Ngày ${date} đã tồn tại. Ghi đè chứ bấy bề?`)) return;
        currentData[existingIndex] = newEntry;
    } else {
        currentData.push(newEntry);
    }

    currentData.sort((a, b) => new Date(b.date) - new Date(a.date));
    await pushToGitHub(currentData, `Cập nhật kết quả ngày ${date}`);
}

// ====================== 6. PUSH TO GITHUB ======================
async function pushToGitHub(newData, commitMessage) {
    let token = githubToken || prompt("Nhập GitHub Token:");
    if (!token) return;

    if (!githubToken) {
        githubToken = token;
        localStorage.setItem("github_token", token);
    }

    try {
        const metaRes = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`,
            {
                headers: { Authorization: `token ${token}` },
            },
        );
        const meta = await metaRes.json();

        const contentStr = JSON.stringify(newData, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(contentStr)));

        const response = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: contentBase64,
                    sha: meta.sha,
                    branch: BRANCH,
                }),
            },
        );

        if (response.ok) {
            alert("✅ Đã cập nhật GitHub thành công!");
            clearForm();
            await loadData();
        } else {
            alert("Lỗi khi đẩy dữ liệu!");
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối GitHub!");
    }
}

async function deleteEntry(date) {
    if (!confirm(`Xóa ngày ${date}?`)) return;
    currentData = currentData.filter((item) => item.date !== date);
    await pushToGitHub(currentData, `Xóa ngày ${date}`);
}

function clearToken() {
    localStorage.removeItem("github_token");
    githubToken = "";
    alert("Đã xóa token!");
}
