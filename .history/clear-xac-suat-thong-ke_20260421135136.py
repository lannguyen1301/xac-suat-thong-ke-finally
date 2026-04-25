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
expected_names = ['Ngày', 'Tuần', 'Đợt', 'Giải', 'số 1', 'số 2', 'số 3', 'số 4', 'số 5', 'số 6', 'số 7']
df.columns = expected_names

# Chuẩn hóa cột Ngày thành chuỗi DD/MM/YYYY
df['Ngày'] = pd.to_datetime(df['Ngày'], errors='coerce').dt.strftime('%d/%m/%Y')

# Chuẩn hóa các cột số: ép về chuỗi, giữ nguyên số 0 ở đầu, bỏ .0
for col in ['số 1','số 2','số 3','số 4','số 5','số 6','số 7']:
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
