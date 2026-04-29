// admin-logic.js - Logic cho trang Admin (Phiên bản hoàn chỉnh)

let currentData = [];
let githubToken = localStorage.getItem("github_token") || "";

// Cấu hình GitHub
const OWNER = "lannguyen1301";
const REPO = "xac-suat-thong-ke-finally";
const PATH = "data/xac-suat-thong-ke_clean.json";
const BRANCH = "main";

document.addEventListener("DOMContentLoaded", () => {
    loadData();
});

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
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4">${item.date}</td>
            <td class="p-4">${item.dayOfWeek || ""}</td>
            <td class="p-4 font-bold text-red-600">${item.results?.GDB || "------"}</td>
            <td class="p-4 text-center font-mono">${item.results?.G8 || "--"}</td>
            <td class="p-4 text-center">
                <button onclick="editEntry('${item.date}')" 
                        class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg text-sm mr-2">
                    Sửa
                </button>
                <button onclick="deleteEntry('${item.date}')" 
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm">
                    Xóa
                </button>
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

    // Điền các giải
    document.getElementById("GDB").value = entry.results?.GDB || "";
    document.getElementById("G1").value = entry.results?.G1 || "";
    document.getElementById("G2").value = entry.results?.G2 || "";
    document.getElementById("G5").value = entry.results?.G5 || "";
    document.getElementById("G7").value = entry.results?.G7 || "";
    document.getElementById("G8").value = entry.results?.G8 || "";

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
    document.getElementById("GDB").value = "";
    document.getElementById("G1").value = "";
    document.getElementById("G2").value = "";
    document.getElementById("G5").value = "";
    document.getElementById("G7").value = "";
    document.getElementById("G8").value = "";

    document
        .querySelectorAll(".G3, .G4, .G6")
        .forEach((input) => (input.value = ""));
}

// ====================== 5. SAVE RESULT (Thêm mới hoặc Sửa) ======================
async function saveResult() {
    const date = document.getElementById("date").value;
    if (!date) return alert("Vui lòng chọn ngày quay!");

    // Thu thập dữ liệu từ form
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

    // Tạo allNumbers
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

    // Kiểm tra trùng ngày
    const existingIndex = currentData.findIndex((item) => item.date === date);

    if (existingIndex !== -1) {
        if (!confirm(`Ngày ${date} đã tồn tại. Bạn muốn ghi đè không?`)) return;
        currentData[existingIndex] = newEntry;
    } else {
        currentData.push(newEntry);
    }

    // Sắp xếp lại theo ngày
    currentData.sort((a, b) => new Date(b.date) - new Date(a.date));

    await pushToGitHub(currentData, `Cập nhật kết quả ngày ${date}`);
}

// ====================== 6. PUSH TO GITHUB ======================
async function pushToGitHub(newData, commitMessage) {
    let token = githubToken || prompt("Nhập GitHub Personal Access Token:");

    if (!token) return alert("Cần Token để đẩy dữ liệu lên GitHub!");

    if (!githubToken) {
        githubToken = token;
        localStorage.setItem("github_token", token);
    }

    try {
        // Lấy SHA hiện tại
        const metaRes = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`,
            { headers: { Authorization: `token ${token}` } },
        );

        const meta = await metaRes.json();
        const sha = meta.sha;

        // Convert data thành base64
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
                    sha: sha,
                    branch: BRANCH,
                }),
            },
        );

        if (response.ok) {
            alert("✅ Cập nhật thành công!");
            clearForm();
            await loadData(); // Tải lại bảng
        } else {
            const err = await response.json();
            alert("Lỗi: " + (err.message || "Không đẩy được dữ liệu"));
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối: " + err.message);
    }
}

// ====================== 7. DELETE ENTRY ======================
async function deleteEntry(date) {
    if (!confirm(`Bạn chắc chắn muốn xóa ngày ${date}?`)) return;

    currentData = currentData.filter((item) => item.date !== date);

    await pushToGitHub(currentData, `Xóa kết quả ngày ${date}`);
}

// ====================== 8. CLEAR TOKEN ======================
function clearToken() {
    if (confirm("Xóa GitHub Token đã lưu?")) {
        localStorage.removeItem("github_token");
        githubToken = "";
        alert("Đã xóa token!");
    }
}
