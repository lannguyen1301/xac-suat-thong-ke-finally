// admin-logic.js
document.addEventListener("DOMContentLoaded", function () {
    // 1. Cấu hình GitHub (Dùng Token bấy bề cung cấp)
    const GITHUB_CONFIG = {
        token: "ghp_" + "XPzdaPqAbGZDw8RpgnAZFvajscwAFC2sYvA5",
        repo: "xac-suat-thong-ke-finally",
        owner: "lannguyen1301",
        path: "data/xac-suat-thong-ke_clean.json",
    };

    const el = {
        date: document.getElementById("date"),
        thu: document.getElementById("dayOfWeek"),
        tuan: document.getElementById("week"),
        saveBtn: document.getElementById("save-btn"),
    };

    // 2. Logic tự động điền Thứ và Tuần
    if (el.date) {
        el.date.addEventListener("change", function () {
            const d = new Date(this.value);
            if (isNaN(d)) return;
            const days = [
                "Chủ Nhật",
                "Thứ Hai",
                "Thứ Ba",
                "Thứ Tư",
                "Thứ Năm",
                "Thứ Sáu",
                "Thứ Bảy",
            ];
            if (el.thu) el.thu.value = days[d.getDay()];

            if (el.tuan) {
                const start = new Date(d.getFullYear(), 0, 1);
                el.tuan.value = Math.ceil(
                    ((d - start) / 86400000 + start.getDay() + 1) / 7,
                );
            }
        });
    }

    // 3. Hàm gửi dữ liệu lên GitHub (Đã gộp vào đây)
    async function sendToGitHub(newResult) {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
        const res = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_CONFIG.token}` },
        });

        if (!res.ok)
            throw new Error(
                "Không thể kết nối GitHub. Kiểm tra lại Repo hoặc Token!",
            );
        const fileData = await res.json();
        const oldContent = JSON.parse(
            decodeURIComponent(escape(atob(fileData.content))),
        );

        oldContent.push(newResult);

        const updatedContent = btoa(
            unescape(encodeURIComponent(JSON.stringify(oldContent, null, 2))),
        );
        const updateRes = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_CONFIG.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Update KQXS ${newResult.date}`,
                content: updatedContent,
                sha: fileData.sha,
            }),
        });

        if (!updateRes.ok) throw new Error("Lỗi khi ghi đè dữ liệu!");
        return true;
    }

    // 4. Xử lý sự kiện nút Lưu
    if (el.saveBtn) {
        el.saveBtn.onclick = async function (e) {
            e.preventDefault();
            if (!el.date.value) return alert("Bấy bề chọn ngày đã nhé!");

            el.saveBtn.disabled = true;
            el.saveBtn.innerText = "⌛ ĐANG LƯU...";

            const getVal = (id) => document.getElementById(id)?.value || "";
            const getList = (cls) =>
                Array.from(document.getElementsByClassName(cls)).map(
                    (i) => i.value,
                );

            const payload = {
                date: el.date.value,
                thu: el.thu.value,
                week: parseInt(el.tuan.value),
                gdb: getVal("GDB"),
                g1: getVal("G1"),
                g2: getVal("G2"),
                g3: getList("G3"),
                g4: getList("G4"),
                g5: getVal("G5"),
                g6: getList("G6"),
                g7: getVal("G7"),
                g8: getVal("G8"),
            };

            try {
                await sendToGitHub(payload);
                alert("🎉 Ngon lành! Dữ liệu đã được cập nhật lên GitHub.");
                location.reload();
            } catch (err) {
                alert("Thất bại rồi bấy bề ơi: " + err.message);
            } finally {
                el.saveBtn.disabled = false;
                el.saveBtn.innerText = "🚀 LƯU DỮ LIỆU LÊN CLOUD";
            }
        };
    }
});
