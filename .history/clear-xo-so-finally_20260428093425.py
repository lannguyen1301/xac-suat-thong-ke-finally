# import pandas as pd
# import json
# from datetime import datetime

# # ================== CẤU HÌNH ==================
# file_path = r"E:\xac-suat-thong-ke-finally\xac-suat-thong-ke.xlsx"   # ← Đổi đường dẫn nếu cần
# output_path = r"E:\xac-suat-thong-ke-finally\data\xac-suat-thong-ke_clean.json"
# log_path = r"E:\xac-suat-thong-ke-finally\log_kiem_tra_du_lieu.txt"

# # Cấu hình độ dài và loại (array hay string)
# LOTTERY_CONFIG = {
#     "GDB": {"digits": 6, "is_array": False},
#     "G1":  {"digits": 5, "is_array": False},
#     "G2":  {"digits": 5, "is_array": False},
#     "G3":  {"digits": 5, "is_array": True},
#     "G4":  {"digits": 5, "is_array": True},
#     "G5":  {"digits": 4, "is_array": False},
#     "G6":  {"digits": 4, "is_array": True},
#     "G7":  {"digits": 3, "is_array": False},
#     "G8":  {"digits": 2, "is_array": False},
# }

# def clean_val(x):
#     if pd.isna(x): 
#         return None
#     val = str(x).strip().replace('.0', '').replace(' ', '')
#     if val.lower() in ['none', 'nan', '', 'null']:
#         return None
#     return val

# # Đọc file
# print("Đang đọc file Excel...")
# df = pd.read_excel(file_path, header=1, dtype=str)
# df.columns = ['date', 'week', 'period', 'prize', 'No1', 'No2', 'No3', 'No4', 'No5', 'No6', 'No7']

# final_json = []
# error_logs = []

# print(f"Đọc được {len(df)} dòng. Đang xử lý...")

# for ngay, group in df.groupby(df['date'].str.split().str[0], sort=False):
#     date_str = None
#     dayOfWeek = ""
    
#     try:
#         # Parse ngày để tính dayOfWeek
#         dt = pd.to_datetime(ngay, dayfirst=True, errors='coerce')
#         if pd.notna(dt):
#             date_str = dt.strftime('%Y-%m-%d')
#             dow_map = {
#                 'Monday': 'Thứ 2', 'Tuesday': 'Thứ 3', 'Wednesday': 'Thứ 4',
#                 'Thursday': 'Thứ 5', 'Friday': 'Thứ 6', 'Saturday': 'Thứ 7', 'Sunday': 'Chủ Nhật'
#             }
#             dayOfWeek = dow_map.get(dt.strftime('%A'), dt.strftime('%A'))
#     except:
#         date_str = str(ngay).strip()

#     if not date_str:
#         continue

#     day_entry = {
#         "date": date_str,
#         "dayOfWeek": dayOfWeek,
#         "week": int(clean_val(group.iloc[0].get('week', 0)) or 0),
#         "period": int(clean_val(group.iloc[0].get('period', 0)) or 0),
#         "isRestDay": False,
#         "results": {},
#         "allNumbers": []
#     }

#     # day_entry = {
#     #     "date": date_str,
#     #     "dayOfWeek": dayOfWeek,
#     #     "week": clean_val(group.iloc[0]['week']),
#     #     "period": clean_val(group.iloc[0]['period']),
#     #     "isRestDay": False,
#     #     "results": {},
#     #     "allNumbers": []
#     # }

    
#     actual_results = {}
#     for _, row in group.iterrows():
#         giai = clean_val(row['prize'])
#         if giai:
#             nums = [clean_val(row[f'No{i}']) for i in range(1, 8) if clean_val(row[f'No{i}'])]
#             if nums:
#                 actual_results[giai.upper().replace('GĐB', 'GDB')] = nums

#     if not actual_results:
#         day_entry["isRestDay"] = True
#     else:
#         for name, config in LOTTERY_CONFIG.items():
#             nums = actual_results.get(name, [])

#             if not nums:
#                 error_logs.append(f"[{date_str}] Thiếu giải {name}")
#                 continue

#             # Padding số 0
#             processed = [num.zfill(config['digits']) for num in nums]

#             # Chuyển thành string nếu chỉ có 1 số
#             if not config['is_array'] and processed:
#                 day_entry["results"][name] = processed[0]
#             else:
#                 day_entry["results"][name] = processed

#             day_entry["allNumbers"].extend(processed)

#     final_json.append(day_entry)

# # Xuất JSON
# with open(output_path, "w", encoding="utf-8") as f:
#     json.dump(final_json, f, ensure_ascii=False, indent=2)

# # Xuất log
# with open(log_path, "w", encoding="utf-8") as f:
#     if error_logs:
#         f.write("\n".join(error_logs))
#         print(f"\nCó {len(error_logs)} vấn đề được ghi vào log.")
#     else:
#         print("\nDữ liệu sạch sẽ, không có lỗi!")

# print(f"✅ Hoàn tất! Đã xuất {len(final_json)} ngày vào file:\n{output_path}")

import pandas as pd
import json
from datetime import datetime

# ================== CẤU HÌNH ==================
file_path = r"E:\xac-suat-thong-ke-finally\xac-suat-thong-ke.xlsx"   # ← Đổi đường dẫn nếu cần
output_path = r"E:\xac-suat-thong-ke-finally\data\xac-suat-thong-ke_clean.json"
log_path = r"E:\xac-suat-thong-ke-finally\log_kiem_tra_du_lieu.txt"

# Cấu hình độ dài và loại (array hay string)
LOTTERY_CONFIG = {
    "GDB": {"digits": 6, "is_array": False},
    "G1":  {"digits": 5, "is_array": False},
    "G2":  {"digits": 5, "is_array": False},
    "G3":  {"digits": 5, "is_array": True},
    "G4":  {"digits": 5, "is_array": True},
    "G5":  {"digits": 4, "is_array": False},
    "G6":  {"digits": 4, "is_array": True},
    "G7":  {"digits": 3, "is_array": False},
    "G8":  {"digits": 2, "is_array": False},
}

def clean_val(x):
    if pd.isna(x): 
        return None
    val = str(x).strip().replace('.0', '').replace(' ', '')
    if val.lower() in ['none', 'nan', '', 'null']:
        return None
    return val

# Đọc file
print("Đang đọc file Excel...")
df = pd.read_excel(file_path, header=1, dtype=str)
df.columns = ['date', 'week', 'period', 'prize', 'No1', 'No2', 'No3', 'No4', 'No5', 'No6', 'No7']

final_json = []
error_logs = []

print(f"Đọc được {len(df)} dòng. Đang xử lý...")

for ngay, group in df.groupby(df['date'].str.split().str[0], sort=False):
    date_str = None
    dayOfWeek = ""
    
    try:
        # Parse ngày để tính dayOfWeek
        dt = pd.to_datetime(ngay, dayfirst=True, errors='coerce')
        if pd.notna(dt):
            date_str = dt.strftime('%Y-%m-%d')
            dow_map = {
                'Monday': 'Thứ 2', 'Tuesday': 'Thứ 3', 'Wednesday': 'Thứ 4',
                'Thursday': 'Thứ 5', 'Friday': 'Thứ 6', 'Saturday': 'Thứ 7', 'Sunday': 'Chủ Nhật'
            }
            dayOfWeek = dow_map.get(dt.strftime('%A'), dt.strftime('%A'))
    except:
        date_str = str(ngay).strip()

    if not date_str:
        continue

    day_entry = {
        "date": date_str,
        "dayOfWeek": dayOfWeek,
        "week": int(clean_val(group.iloc[0].get('week', 0)) or 0),
        "period": int(clean_val(group.iloc[0].get('period', 0)) or 0),
        "isRestDay": False,
        "results": {},
        "allNumbers": []
    }

    actual_results = {}
    for _, row in group.iterrows():
        giai = clean_val(row['prize'])
        if giai:
            nums = [clean_val(row[f'No{i}']) for i in range(1, 8) if clean_val(row[f'No{i}'])]
            if nums:
                actual_results[giai.upper().replace('GĐB', 'GDB')] = nums

    # Nếu không có kết quả thì bỏ qua, không append
    if not actual_results:
        error_logs.append(f"[{date_str}] Ngày nghỉ, không có kết quả")
        continue

    # Nếu có kết quả thì xử lý và append
    for name, config in LOTTERY_CONFIG.items():
        nums = actual_results.get(name, [])

        if not nums:
            error_logs.append(f"[{date_str}] Thiếu giải {name}")
            continue

        # Padding số 0
        processed = [num.zfill(config['digits']) for num in nums]

        # Chuyển thành string nếu chỉ có 1 số
        if not config['is_array'] and processed:
            day_entry["results"][name] = processed[0]
        else:
            day_entry["results"][name] = processed

        day_entry["allNumbers"].extend(processed)

    final_json.append(day_entry)

# Xuất JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_json, f, ensure_ascii=False, indent=2)

# Xuất log
with open(log_path, "w", encoding="utf-8") as f:
    if error_logs:
        f.write("\n".join(error_logs))
        print(f"\nCó {len(error_logs)} vấn đề được ghi vào log.")
    else:
        print("\nDữ liệu sạch sẽ, không có lỗi!")

print(f"✅ Hoàn tất! Đã xuất {len(final_json)} ngày hợp lệ vào file:\n{output_path}")
