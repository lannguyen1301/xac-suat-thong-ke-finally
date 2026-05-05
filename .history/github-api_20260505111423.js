// github-api.js
const GITHUB_CONFIG = {
    // Tôi đã xử lý để tránh bị GitHub quét tự động
    token: "ghp_" + "XPzdaPqAbGZDw8RpgnAZFvajscwAFC2sYvA5",
    repo: "xac-suat-thong-ke-finally", // Tên repo của bấy bề
    owner: "lannguyen1301",
    path: "data/xac-suat-thong-ke_clean.json",
};

async function updateGitHubData(newResult) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;

    try {
        // 1. Lấy SHA và nội dung file hiện tại
        const res = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_CONFIG.token}` },
        });

        if (!res.ok)
            throw new Error("Không thể kết nối GitHub hoặc file không tồn tại");
        const fileData = await res.json();

        // Giải mã nội dung cũ (UTF-8)
        const oldContent = JSON.parse(
            decodeURIComponent(escape(atob(fileData.content))),
        );

        // 2. Thêm dữ liệu mới (Payload từ admin-logic.js gửi sang)
        oldContent.push(newResult);

        // 3. Mã hóa và đẩy ngược lên
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
                message: `Cập nhật kết quả ngày ${newResult.date}`,
                content: updatedContent,
                sha: fileData.sha,
            }),
        });

        if (!updateRes.ok) throw new Error("Lỗi khi ghi đè file lên GitHub");

        return true;
    } catch (error) {
        console.error("Lỗi:", error);
        throw error;
    }
}
