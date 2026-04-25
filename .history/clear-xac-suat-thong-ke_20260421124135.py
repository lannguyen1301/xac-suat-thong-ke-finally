import pandas as pd
import os

# Đường dẫn tới file Excel
file_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.xlsx"

# Kiểm tra file có tồn tại không
if not os.path.exists(file_path):
    raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# Đọc dữ liệu từ Excel (header ở dòng 2, tức là index=1)
df = pd.read_excel(file_path, header=1)

# Đặt lại tên cột cho đúng với cấu trúc
expected_names = ['Ngay', 'Tuan', 'Dot', 'Giai', 'So1', 'So2', 'So3', 'So4', 'So5', 'So6', 'So7']
df.columns = expected_names

# --- CHUẨN HÓA NGÀY ---
# Ép mọi giá trị thành chuỗi, bỏ khoảng trắng
df['Ngay'] = df['Ngay'].astype(str).str.strip()

# Nếu có phần giờ (ví dụ '2009-04-04 00:00:00') thì cắt bỏ
df['Ngay'] = df['Ngay'].str.split().str[0]

# Chuẩn hóa thành DD/MM/YYYY, giữ nguyên nếu không parse được
df['Ngay'] = pd.to_datetime(df['Ngay'], errors='coerce').dt.strftime('%d/%m/%Y')

# --- CHUẨN HÓA CÁC CỘT SỐ ---
for col in ['So1','So2','So3','So4','So5','So6','So7']:
    df[col] = df[col].apply(lambda x: str(x).split('.')[0] if pd.notnull(x) else None)

# Xuất sang JSON
json_data = df.to_json(orient="records", force_ascii=False)

# Lưu ra file JSON
output_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.json"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(json_data)

# In thử 5 dòng đầu để kiểm tra
print("5 dòng JSON đầu tiên:")
print(json_data[:500])
print(f"Đã chuyển thành JSON thành công! File lưu tại: {output_path}")
