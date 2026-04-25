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


# import pandas as pd
# import os

# # Đường dẫn tới file Excel
# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU VỚI ÉP KIỂU STRING ---
# # Sử dụng dtype=str để Pandas không tự ý bỏ số 0 ở đầu
# df = pd.read_excel(file_path, header=1, dtype=str)

# # Đặt lại tên cột cho đúng với cấu trúc
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # --- BƯỚC 2: CHUẨN HÓA NGÀY ---
# def clean_date(x):
#     if pd.isna(x) or str(x).strip().lower() in ['none', 'nan', 'nat', '']:
#         return None
#     try:
#         # Cắt lấy phần ngày nếu có giờ (split khoảng trắng)
#         date_str = str(x).split()[0]
#         # Chuyển đổi sang datetime và định dạng lại
#         return pd.to_datetime(date_str, dayfirst=True, errors='coerce').strftime('%d/%m/%Y')
#     except:
#         return str(x)

# df['Ngay'] = df['Ngay'].apply(clean_date)

# # --- BƯỚC 3: CHUẨN HÓA CÁC CỘT SỐ (GIỮ NGUYÊN SỐ 0) ---
# cols_to_fix = ['So1','So2','So3','So4','So5','So6','So7']

# for col in cols_to_fix:
#     # 1. Chuyển về string, bỏ khoảng trắng
#     # 2. Xử lý trường hợp nếu Excel bị dính đuôi .0 (ví dụ 12345.0)
#     # 3. Không dùng zfill(6) cố định nếu độ dài các số trong file không đồng nhất, 
#     #    mà chỉ nên lấy đúng những gì hiển thị trong Excel.
#     df[col] = df[col].astype(str).str.strip().str.replace(r'\.0$', '', regex=True)
    
#     # Thay thế các giá trị rỗng/nan thành null thật sự trong JSON
#     df[col] = df[col].replace(['nan', 'None', 'NaN'], None)

# # --- BƯỚC 4: XUẤT SANG JSON ---
# # orient="records" kết hợp với double_precision sẽ giữ đúng định dạng chuỗi
# json_data = df.to_json(orient="records", force_ascii=False, indent=4)

# # Lưu ra file JSON
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"
# with open(output_path, "w", encoding="utf-8") as f:
#     f.write(json_data)

# # In thử để kiểm tra
# print("Dữ liệu sau khi xử lý (5 dòng đầu):")
# print(df[cols_to_fix].head())
# print(f"\nThành công! File lưu tại: {output_path}")


# import pandas as pd
# import os
# import json

# # Đường dẫn tới file Excel
# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU ---
# # dtype=str để giữ nguyên số 0 ở đầu các cột So1, So2...
# df = pd.read_excel(file_path, header=1, dtype=str)

# # Đặt lại tên cột
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # --- BƯỚC 2: CHUẨN HÓA NGÀY VỀ YYYY-MM-DD ---
# def clean_date_to_iso(x):
#     if pd.isna(x) or str(x).strip().lower() in ['none', 'nan', 'nat', '']:
#         return None
    
#     # Lấy phần ngày, bỏ phần giờ nếu có
#     date_val = str(x).strip().split()[0]
    
#     try:
#         # Tự động nhận diện định dạng (Pandas xử lý YYYY-MM-DD rất chuẩn)
#         # Không dùng dayfirst=True để tránh đảo lộn tháng/ngày khi dữ liệu đã rõ ràng
#         dt = pd.to_datetime(date_val, errors='coerce')
        
#         if pd.isna(dt):
#             return date_val
            
#         # Trả về định dạng Năm-Tháng-Ngày (Ví dụ: 2009-04-06)
#         return dt.strftime('%Y-%m-%d')
#     except:
#         return date_val

# df['Ngay'] = df['Ngay'].apply(clean_date_to_iso)

# # --- BƯỚC 3: CHUẨN HÓA CÁC CỘT SỐ (GIỮ SỐ 0 ĐẦU) ---
# cols_to_fix = ['So1','So2','So3','So4','So5','So6','So7']

# for col in cols_to_fix:
#     # 1. Bỏ khoảng trắng
#     # 2. Xóa đuôi .0 nếu có (do Excel lưu kiểu float)
#     df[col] = df[col].astype(str).str.strip().str.replace(r'\.0$', '', regex=True)
    
#     # 3. Chuyển các giá trị lỗi/trống thành null xịn trong JSON
#     df[col] = df[col].replace(['nan', 'None', 'NaN', 'null'], None)

# # --- BƯỚC 4: XUẤT SANG JSON ---
# # Chuyển DataFrame thành list dictionary
# data_dict = df.to_dict(orient="records")

# with open(output_path, "w", encoding="utf-8") as f:
#     # ensure_ascii=False để hiển thị đúng ký tự, indent=4 để dễ đọc
#     json.dump(data_dict, f, ensure_ascii=False, indent=4)

# print(f"Thành công! Ngày đã được chuẩn hóa về định dạng: YYYY-MM-DD")
# print(f"Kết quả lưu tại: {output_path}")



# import pandas as pd
# import os
# import json

# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU ---
# df = pd.read_excel(file_path, header=1, dtype=str)
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # --- BƯỚC 2: CHUẨN HÓA DỮ LIỆU THÔ ---
# def clean_val(x):
#     if pd.isna(x) or str(x).strip().lower() in ['none', 'nan', 'nat', '']:
#         return None
#     return str(x).strip().replace('.0', '')

# # Áp dụng làm sạch cho toàn bộ bảng
# for col in df.columns:
#     df[col] = df[col].apply(clean_val)

# # Chuẩn hóa ngày về YYYY-MM-DD
# def format_date(x):
#     if not x: return None
#     try:
#         return pd.to_datetime(x.split()[0]).strftime('%Y-%m-%d')
#     except:
#         return x

# df['Ngay'] = df['Ngay'].apply(format_date)

# # --- BƯỚC 3: GOM NHÓM THEO NGÀY (OPTIMIZED FOR ALGORITHM) ---
# grouped_data = []

# # Nhóm theo các thông tin chung
# for (ngay, tuan, dot), group in df.groupby(['Ngay', 'Tuan', 'Dot']):
#     day_entry = {
#         "Ngay": ngay,
#         "Tuan": tuan,
#         "Dot": dot,
#         "KetQua": {},
#         "TatCaSo": []
#     }
    
#     for _, row in group.iterrows():
#         giai = row['Giai']
#         # Lấy danh sách các số từ So1 đến So7, loại bỏ None
#         list_so = [row[f'So{i}'] for i in range(1, 8) if row[f'So{i}'] is not None]
        
#         if giai:
#             day_entry["KetQua"][giai] = list_so
#             day_entry["TatCaSo"].extend(list_so)
            
#     grouped_data.append(day_entry)

# # --- BƯỚC 4: XUẤT FILE ---
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(grouped_data, f, ensure_ascii=False, indent=4)

# print(f"Bấy bề ơi! Đã xử lý xong {len(grouped_data)} ngày dữ liệu.")
# print(f"Cấu trúc mới đã bao gồm GĐB và cực lợi cho tính toán xác suất!")



# code đúng chuẩn nhưng chwua in ra được ngày nghỉ quay (toàn bộ các cột số đều null) như trong hình bạn gửi, mình sẽ bổ sung thêm phần đó vào nhé!
# import pandas as pd
# import os
# import json

# # Đường dẫn file
# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU ---
# df = pd.read_excel(file_path, header=1, dtype=str)
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # --- BƯỚC 2: LÀM SẠCH DỮ LIỆU THÔ ---
# def clean_val(x):
#     if pd.isna(x) or str(x).strip().lower() in ['none', 'nan', 'nat', '', 'null']:
#         return None
#     # Giữ số 0 ở đầu và xóa đuôi .0 nếu Excel tự thêm vào
#     return str(x).strip().replace('.0', '')

# for col in df.columns:
#     df[col] = df[col].apply(clean_val)

# # Chuẩn hóa ngày về YYYY-MM-DD
# def format_date(x):
#     if not x: return None
#     try:
#         # Pandas tự nhận diện cực tốt định dạng YYYY-MM-DD từ Excel
#         return pd.to_datetime(x.split()[0]).strftime('%Y-%m-%d')
#     except:
#         return x

# df['Ngay'] = df['Ngay'].apply(format_date)

# # --- BƯỚC 3: GOM NHÓM VÀ TỰ ĐỘNG NHẬN DIỆN NGÀY NGHỈ ---
# grouped_data = []

# # Group theo Ngay, Tuan, Dot để gom các giải về một ngày duy nhất
# for (ngay, tuan, dot), group in df.groupby(['Ngay', 'Tuan', 'Dot'], sort=False):
#     day_entry = {
#         "Ngay": ngay,
#         "Tuan": tuan,
#         "Dot": dot,
#         "NghiQuay": False, # Mặc định là có quay
#         "KetQua": {},
#         "TatCaSo": []
#     }
    
#     # Kiểm tra xem toàn bộ các cột số trong ngày này có dữ liệu không
#     # Nếu tất cả So1 -> So7 của tất cả các dòng (GĐB, G1, G2...) đều None -> Ngày nghỉ
#     check_cols = ['So1','So2','So3','So4','So5','So6','So7']
#     has_any_number = group[check_cols].notnull().any().any()
    
#     if not has_any_number:
#         day_entry["NghiQuay"] = True
#     else:
#         # Nếu có số, tiến hành bóc tách từng giải (GĐB, G1, G2...)
#         for _, row in group.iterrows():
#             giai_name = row['Giai']
#             if giai_name:
#                 # Lấy các số không null từ So1 đến So7
#                 list_so = [row[f'So{i}'] for i in range(1, 8) if row[f'So{i}'] is not None]
#                 if list_so:
#                     day_entry["KetQua"][giai_name] = list_so
#                     day_entry["TatCaSo"].extend(list_so)
            
#     grouped_data.append(day_entry)

# # --- BƯỚC 4: XUẤT JSON ---
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(grouped_data, f, ensure_ascii=False, indent=4)

# print(f"Xong rồi bấy bề! Đã xử lý {len(grouped_data)} ngày.")
# print(f"Hệ thống đã tự quét và đánh dấu 'NghiQuay': true cho các ngày trống dữ liệu.")




# code gàn đúng thiếu giả đặc biệt
# import pandas as pd
# import os
# import json

# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU ---
# df = pd.read_excel(file_path, header=1, dtype=str)
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# # Hàm làm sạch giá trị
# def clean_val(x):
#     val = str(x).strip().lower()
#     if pd.isna(x) or val in ['none', 'nan', 'nat', '', 'null']:
#         return None
#     return str(x).strip().replace('.0', '')

# # --- BƯỚC 2: XỬ LÝ NGÀY THÁNG ---
# # Chuyển về YYYY-MM-DD
# def format_date(x):
#     if pd.isna(x): return None
#     try:
#         return pd.to_datetime(str(x).split()[0]).strftime('%Y-%m-%d')
#     except:
#         return str(x)

# df['Ngay'] = df['Ngay'].apply(format_date)

# # --- BƯỚC 3: GOM NHÓM (XỬ LÝ DÒNG NULL NHƯ TRONG HÌNH) ---
# grouped_data = []

# # Group theo Ngày để xử lý từng ngày một
# for ngay, group in df.groupby('Ngay', sort=False):
#     if ngay is None: continue
    
#     # Lấy Tuần và Đợt từ dòng đầu tiên của ngày đó
#     tuan = clean_val(group.iloc[0]['Tuan'])
#     dot = clean_val(group.iloc[0]['Dot'])
    
#     day_entry = {
#         "Ngay": ngay,
#         "Tuan": tuan,
#         "Dot": dot,
#         "NghiQuay": False,
#         "KetQua": {},
#         "TatCaSo": []
#     }
    
#     # Kiểm tra xem toàn bộ các cột So1 -> So7 trong ngày này có số nào không
#     check_cols = ['So1','So2','So3','So4','So5','So6','So7']
#     # Ép kiểu và kiểm tra null
#     has_data = False
#     for col in check_cols:
#         if group[col].apply(clean_val).notnull().any():
#             has_data = True
#             break
    
#     if not has_data:
#         # Nếu toàn null như trong hình bạn gửi -> Đánh dấu nghỉ quay
#         day_entry["NghiQuay"] = True
#     else:
#         # Nếu có dữ liệu, bốc tách từng giải
#         for _, row in group.iterrows():
#             giai = clean_val(row['Giai'])
#             if giai:
#                 # Lấy danh sách số, lọc bỏ các giá trị null
#                 list_so = []
#                 for i in range(1, 8):
#                     s = clean_val(row[f'So{i}'])
#                     if s: list_so.append(s)
                
#                 if list_so:
#                     day_entry["KetQua"][giai.upper()] = list_so
#                     day_entry["TatCaSo"].extend(list_so)
            
#     grouped_data.append(day_entry)

# # --- BƯỚC 4: XUẤT JSON ---
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(grouped_data, f, ensure_ascii=False, indent=4)

# print(f"Xong rồi bấy bề! Đã xử lý các ngày nghỉ dịch có chữ 'null' trong file Excel.")



# đã cái tiển 1
# import pandas as pd
# import os
# import json

# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# if not os.path.exists(file_path):
#     raise FileNotFoundError(f"Không tìm thấy file: {file_path}")

# # --- BƯỚC 1: ĐỌC DỮ LIỆU ---
# df = pd.read_excel(file_path, header=1, dtype=str)
# expected_names = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']
# df.columns = expected_names

# def clean_val(x):
#     if pd.isna(x): return None
#     val = str(x).strip()
#     # Loại bỏ chữ "null" (dạng text) và các biến thể trống
#     if val.lower() in ['none', 'nan', 'nat', '', 'null']:
#         return None
#     return val.replace('.0', '')

# # --- BƯỚC 2: CHUẨN HÓA NGÀY ---
# def format_date(x):
#     val = clean_val(x)
#     if not val: return None
#     try:
#         return pd.to_datetime(val.split()[0]).strftime('%Y-%m-%d')
#     except:
#         return val

# df['Ngay'] = df['Ngay'].apply(format_date)

# # --- BƯỚC 3: GOM NHÓM ---
# grouped_data = []

# # Group theo Ngày để xử lý từng ngày một
# for ngay, group in df.groupby('Ngay', sort=False):
#     if ngay is None: continue
    
#     # Lấy Tuần và Đợt (ưu tiên dòng đầu tiên có dữ liệu)
#     tuan = clean_val(group['Tuan'].iloc[0])
#     dot = clean_val(group['Dot'].iloc[0])
    
#     day_entry = {
#         "Ngay": ngay,
#         "Tuan": tuan,
#         "Dot": dot,
#         "NghiQuay": False,
#         "KetQua": {},
#         "TatCaSo": []
#     }
    
#     # Duyệt từng dòng trong ngày (GĐB, G1, G2...)
#     found_any_number = False
#     for _, row in group.iterrows():
#         giai_raw = clean_val(row['Giai'])
#         if not giai_raw: continue
        
#         # Lấy tất cả số từ So1 đến So7
#         list_so_trong_giai = []
#         for i in range(1, 8):
#             s = clean_val(row[f'So{i}'])
#             if s:
#                 list_so_trong_giai.append(s)
#                 found_any_number = True
        
#         # Nếu giải này có số, thêm vào KetQua
#         if list_so_trong_giai:
#             day_entry["KetQua"][giai_raw] = list_so_trong_giai
#             day_entry["TatCaSo"].extend(list_so_trong_giai)
            
#     # Nếu duyệt hết các giải mà không thấy số nào -> NghiQuay
#     if not found_any_number:
#         day_entry["NghiQuay"] = True
        
#     grouped_data.append(day_entry)

# # --- BƯỚC 4: XUẤT JSON ---
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(grouped_data, f, ensure_ascii=False, indent=4)

# print(f"Xác nhận: Đã xử lý xong. Bấy bề kiểm tra lại file JSON, GĐB chắc chắn phải nằm trong đó!")



# cải tiến 2: thêm phần check lỗi ở các giải, nhưng chưa xuất ra file log lỗi
# import pandas as pd
# import os
# import json

# # Đường dẫn file
# file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
# output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"

# # --- BƯỚC 1: CẤU HÌNH LOGIC XỔ SỐ TP.HCM ---
# LOTTERY_CONFIG = {
#     "GĐB": {"digits": 6, "count": 1},
#     "G1":  {"digits": 5, "count": 1},
#     "G2":  {"digits": 5, "count": 1},
#     "G3":  {"digits": 5, "count": 2},
#     "G4":  {"digits": 5, "count": 7},
#     "G5":  {"digits": 4, "count": 1},
#     "G6":  {"digits": 4, "count": 3},
#     "G7":  {"digits": 3, "count": 1},
#     "G8":  {"digits": 2, "count": 1},
# }

# def clean_val(x):
#     if pd.isna(x): return None
#     val = str(x).strip().replace('.0', '')
#     return val if val.lower() not in ['none', 'nan', 'nat', '', 'null'] else None

# # --- BƯỚC 2: ĐỌC DỮ LIỆU ---
# df = pd.read_excel(file_path, header=1, dtype=str)
# df.columns = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']

# # --- BƯỚC 3: XỬ LÝ VÀ KIỂM TRA LOGIC ---
# final_json = []

# for ngay, group in df.groupby(df['Ngay'].str.split().str[0], sort=False):
#     day_str = pd.to_datetime(ngay).strftime('%Y-%m-%d')
#     day_entry = {
#         "Ngay": day_str,
#         "Tuan": clean_val(group.iloc[0]['Tuan']),
#         "Dot": clean_val(group.iloc[0]['Dot']),
#         "NghiQuay": False,
#         "KetQua": {},
#         "TatCaSo": []
#     }

#     # Gom dữ liệu thực tế từ Excel cho ngày này
#     actual_results = {}
#     for _, row in group.iterrows():
#         giai_name = clean_val(row['Giai'])
#         if giai_name:
#             nums = [clean_val(row[f'So{i}']) for i in range(1, 8) if clean_val(row[f'So{i}'])]
#             if nums:
#                 actual_results[giai_name] = nums

#     # Kiểm tra xem có phải ngày nghỉ không
#     if not actual_results:
#         day_entry["NghiQuay"] = True
#     else:
#         # KIỂM TRA LOGIC TỪNG GIẢI THEO CONFIG
#         for config_name, config in LOTTERY_CONFIG.items():
#             res_list = actual_results.get(config_name, [])
            
#             # 1. Kiểm tra sự tồn tại
#             if not res_list:
#                 print(f"[{day_str}] Thông báo: Không có giải {config_name}")
#                 continue

#             # 2. Kiểm tra số lượng giải
#             if len(res_list) != config['count']:
#                 print(f"[{day_str}] Cảnh báo: {config_name} có {len(res_list)} giải (Mặc định: {config['count']}). Các bộ số: {res_list}")

#             # 3. Kiểm tra số chữ số từng bộ số
#             valid_nums = []
#             for num in res_list:
#                 if len(num) != config['digits']:
#                     print(f"[{day_str}] Lỗi: {config_name} bộ số {num} Thừa/Thiếu số (Mặc định: {config['digits']} số)")
#                 valid_nums.append(num)
            
#             day_entry["KetQua"][config_name] = valid_nums
#             day_entry["TatCaSo"].extend(valid_nums)

#     final_json.append(day_entry)

# # --- BƯỚC 4: XUẤT JSON ---
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(final_json, f, ensure_ascii=False, indent=4)

# print(f"\n--- Xử lý hoàn tất! Đã kiểm định {len(final_json)} ngày dữ liệu ---")


# cải tiến bổ xung: xuất file log lỗi riêng biệt
import pandas as pd
import os
import json

# Đường dẫn
file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.json"
log_path = r"E:\xac-suat-thong-ke\log_kiem_tra_du_lieu.txt" # File nhật ký lỗi

# --- CONFIG XỔ SỐ TP.HCM ---
LOTTERY_CONFIG = {
    "GĐB": {"digits": 6, "count": 1},
    "G1":  {"digits": 5, "count": 1},
    "G2":  {"digits": 5, "count": 1},
    "G3":  {"digits": 5, "count": 2},
    "G4":  {"digits": 5, "count": 7},
    "G5":  {"digits": 4, "count": 1},
    "G6":  {"digits": 4, "count": 3},
    "G7":  {"digits": 3, "count": 1},
    "G8":  {"digits": 2, "count": 1},
}

def clean_val(x):
    if pd.isna(x): return None
    val = str(x).strip().replace('.0', '')
    return val if val.lower() not in ['none', 'nan', 'nat', '', 'null'] else None

df = pd.read_excel(file_path, header=1, dtype=str)
df.columns = ['Ngay','Tuan','Dot','Giai','So1','So2','So3','So4','So5','So6','So7']

final_json = []
error_logs = [] # Danh sách chứa các dòng thông báo lỗi

for ngay, group in df.groupby(df['Ngay'].str.split().str[0], sort=False):
    day_str = pd.to_datetime(ngay).strftime('%Y-%m-%d')
    day_entry = {"Ngay": day_str, "Tuan": clean_val(group.iloc[0]['Tuan']), "Dot": clean_val(group.iloc[0]['Dot']), "NghiQuay": False, "KetQua": {}, "TatCaSo": []}

    actual_results = {}
    for _, row in group.iterrows():
        giai_name = clean_val(row['Giai'])
        if giai_name:
            nums = [clean_val(row[f'So{i}']) for i in range(1, 8) if clean_val(row[f'So{i}'])]
            if nums: actual_results[giai_name] = nums

    if not actual_results:
        day_entry["NghiQuay"] = True
    else:
        for config_name, config in LOTTERY_CONFIG.items():
            res_list = actual_results.get(config_name, [])
            
            if not res_list:
                error_logs.append(f"[{day_str}] Thông báo: Không có giải {config_name}")
                continue

            if len(res_list) != config['count']:
                error_logs.append(f"[{day_str}] Cảnh báo: {config_name} có {len(res_list)} giải (Cần {config['count']}). Số: {res_list}")

            valid_nums = []
            for num in res_list:
                if len(num) != config['digits']:
                    error_logs.append(f"[{day_str}] Lỗi: {config_name} bộ số {num} Thừa/Thiếu số (Cần {config['digits']} số)")
                valid_nums.append(num)
            
            day_entry["KetQua"][config_name] = valid_nums
            day_entry["TatCaSo"].extend(valid_nums)

    final_json.append(day_entry)

# --- XUẤT FILE JSON ---
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_json, f, ensure_ascii=False, indent=4)

# --- XUẤT FILE LOG (NHẬT KÝ LỖI) ---
with open(log_path, "w", encoding="utf-8") as f:
    if error_logs:
        f.write("\n".join(error_logs))
        print(f"\n(!) Phát hiện {len(error_logs)} vấn đề. Chi tiết xem tại: {log_path}")
    else:
        f.write("Dữ liệu sạch sẽ, không có lỗi logic.")
        print("\n(+) Tuyệt vời! Dữ liệu không có lỗi logic nào.")