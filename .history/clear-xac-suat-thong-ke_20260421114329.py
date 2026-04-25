import pandas as pd
import os

# Đường dẫn tới file Excel
file_path = "E:\xac-xuat-thong-ke\xac-suat-thong-ke.xlsx"

# Kiểm tra file có tồn tại không
if not os.path.exists(file_path):
    raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# Đọc dữ liệu từ Excel (header ở dòng 2, tức là index=1)
df = pd.read_excel(file_path, header=1)

# Kiểm tra số cột và tên cột hiện tại
num_cols = df.shape[1]
print("Số cột trong file:", num_cols)
print("Tên cột gốc:", df.columns.tolist())

# Chuẩn hóa tên cột: bỏ khoảng trắng, thay bằng "_"
df.columns = [str(col).strip().replace(" ", "_") for col in df.columns]

# Nếu số cột nhiều hơn danh sách bạn muốn đặt tên, tự động thêm ColX
expected_names = ['Ngay', 'Tuan', 'Dot', 'Giai', 'So1', 'So2', 'So3', 'So4', 'So5', 'So6', 'So7']
if len(expected_names) < num_cols:
    # Thêm tên mặc định cho các cột còn lại
    for i in range(len(expected_names), num_cols):
        expected_names.append(f"Col{i+1}")

df.columns = expected_names

# Xuất sang JSON
json_data = df.to_json(orient="records", force_ascii=False)

# Lưu ra file JSON
output_path = "E:\\workspace\\xac-suat-thong-ke.json"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(json_data)

print(f"Đã chuyển thành JSON thành công! File lưu tại: {output_path}")
