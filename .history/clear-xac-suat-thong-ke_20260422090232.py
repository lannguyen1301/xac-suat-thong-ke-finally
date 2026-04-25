# import pandas as pd
# import os

# # Đường dẫn tới file Excel
# file_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.xlsx"

# # Kiểm tra file có tồn tại không
# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # Đọc dữ liệu từ Excel (header ở dòng 2, tức là index=1)
# df = pd.read_excel(file_path, header=1)

# # Đặt lại tên cột cho đúng với cấu trúc
# expected_names = ['Ngày', 'Tuần', 'Đợt', 'Giải', 'Số 1', 'Số 2', 'Số 3', 'Số 4', 'Số 5', 'Số 6', 'Số 7']
# df.columns = expected_names

# # Chuẩn hóa cột Ngày thành chuỗi DD/MM/YYYY
# df['Ngày'] = pd.to_datetime(df['Ngày'], errors='coerce').dt.strftime('%d/%m/%Y')

# # Chuẩn hóa các cột số: ép về chuỗi, giữ nguyên số 0 ở đầu, bỏ .0
# for col in ['Số 1','Số 2','Số 3','Số 4','Số 5','Số 6','Số 7']:
#     df[col] = df[col].apply(lambda x: str(x).split('.')[0] if pd.notnull(x) else None)

# # Xuất sang JSON
# json_data = df.to_json(orient="records", force_ascii=False)

# # Lưu ra file JSON
# output_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.json"
# with open(output_path, "w", encoding="utf-8") as f:
#     f.write(json_data)

# # In thử 5 dòng đầu để kiểm tra
# print("5 dòng JSON đầu tiên:")
# print(json_data[:500])
# print(f"Đã chuyển thành JSON thành công! File lưu tại: {output_path}")


# import pandas as pd
# import os

# # Đường dẫn tới file Excel
# file_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.xlsx"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # Đọc dữ liệu từ Excel (header ở dòng 2, tức là index=1)
# df = pd.read_excel(file_path, header=1)

# # Đặt lại tên cột cho đúng với cấu trúc
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # --- CHUẨN HÓA NGÀY ---
# # Ép sang chuỗi, bỏ khoảng trắng
# df['Ngay'] = df['Ngay'].astype(str).str.strip()

# # Nếu có phần giờ (ví dụ '2009-04-04 00:00:00') thì cắt bỏ
# df['Ngay'] = df['Ngay'].str.split().str[0]

# # Chuẩn hóa thành DD/MM/YYYY, giữ nguyên nếu không parse được
# df['Ngay'] = df['Ngay'].apply(
#     lambda x: pd.to_datetime(x, errors='coerce').strftime('%d/%m/%Y') if x not in [None,'', 'NaT', 'nan', 'NaN'] else None
# )

# # --- CHUẨN HÓA CÁC CỘT SỐ ---
# for col in ['So1','So2','So3','So4','So5','So6','So7']:
#     df[col] = df[col].apply(
#         lambda x: str(x).split('.')[0].zfill(6) if pd.notnull(x) else None
#     )

# # Xuất sang JSON
# json_data = df.to_json(orient="records", force_ascii=False)

# # Lưu ra file JSON
# output_path = "E:\\xac-suat-thong-ke\\xac-suat-thong-ke.json"
# with open(output_path,"w",encoding="utf-8") as f:
#     f.write(json_data)

# # In thử 5 dòng đầu để kiểm tra
# print("5 dòng JSON đầu tiên:")
# print(json_data[:500])
# print(f"Đã chuyển thành JSON thành công! File lưu tại: {output_path}")


import pandas as pd
import os

# Đường dẫn tới file Excel
file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"

if not os.path.exists(file_path):
    raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# --- BƯỚC 1: ĐỌC DỮ LIỆU VỚI ÉP KIỂU STRING ---
# Sử dụng dtype=str để Pandas không tự ý bỏ số 0 ở đầu
df = pd.read_excel(file_path, header=1, dtype=str)

# Đặt lại tên cột cho đúng với cấu trúc
expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
df.columns = expected_names

# --- BƯỚC 2: CHUẨN HÓA NGÀY ---
def clean_date(x):
    if pd.isna(x) or str(x).strip().lower() in ['none', 'nan', 'nat', '']:
        return None
    try:
        # Cắt lấy phần ngày nếu có giờ (split khoảng trắng)
        date_str = str(x).split()[0]
        # Chuyển đổi sang datetime và định dạng lại
        return pd.to_datetime(date_str, dayfirst=True, errors='coerce').strftime('%d/%m/%Y')
    except:
        return str(x)

df['Ngay'] = df['Ngay'].apply(clean_date)

# --- BƯỚC 3: CHUẨN HÓA CÁC CỘT SỐ (GIỮ NGUYÊN SỐ 0) ---
cols_to_fix = ['So1','So2','So3','So4','So5','So6','So7']

for col in cols_to_fix:
    # 1. Chuyển về string, bỏ khoảng trắng
    # 2. Xử lý trường hợp nếu Excel bị dính đuôi .0 (ví dụ 12345.0)
    # 3. Không dùng zfill(6) cố định nếu độ dài các số trong file không đồng nhất, 
    #    mà chỉ nên lấy đúng những gì hiển thị trong Excel.
    df[col] = df[col].astype(str).str.strip().str.replace(r'\.0$', '', regex=True)
    
    # Thay thế các giá trị rỗng/nan thành null thật sự trong JSON
    df[col] = df[col].replace(['nan', 'None', 'NaN'], None)

# --- BƯỚC 4: XUẤT SANG JSON ---
# orient="records" kết hợp với double_precision sẽ giữ đúng định dạng chuỗi
json_data = df.to_json(orient="records", force_ascii=False, indent=4)

# Lưu ra file JSON
output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(json_data)

# In thử để kiểm tra
print("Dữ liệu sau khi xử lý (5 dòng đầu):")
print(df[cols_to_fix].head())
print(f"\nThành công! File lưu tại: {output_path}")