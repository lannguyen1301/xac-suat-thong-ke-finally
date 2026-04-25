import pandas as pd
import json
from datetime import datetime

# ================== CẤU HÌNH ==================
file_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke.xlsx"
output_path = r"E:\xac-suat-thong-ke\xac-suat-thong-ke_clean.json"
log_path = r"E:\xac-suat-thong-ke\log_kiem_tra_du_lieu.txt"

# Cấu hình xổ số
LOTTERY_CONFIG = {
    "GDB": {"digits": 6, "count": 1, "is_array": False},
    "G1":  {"digits": 5, "count": 1, "is_array": False},
    "G2":  {"digits": 5, "count": 1, "is_array": False},
    "G3":  {"digits": 5, "count": 2, "is_array": True},
    "G4":  {"digits": 5, "count": 7, "is_array": True},
    "G5":  {"digits": 4, "count": 1, "is_array": False},
    "G6":  {"digits": 4, "count": 3, "is_array": True},
    "G7":  {"digits": 3, "count": 1, "is_array": False},
    "G8":  {"digits": 2, "count": 1, "is_array": False},
}

def clean_val(x):
    if pd.isna(x): 
        return None
    val = str(x).strip().replace('.0', '').replace(' ', '')
    if val.lower() in ['none', 'nan', 'nat', '', 'null']:
        return None
    return val

# Đọc file Excel
print("Đang đọc file Excel...")
df = pd.read_excel(file_path, header=1, dtype=str)
df.columns = ['date','week','period','prize','No1','No2','No3','No4','No5','No6','No7']

final_json = []
error_logs = []

print(f"Đọc được {len(df)} dòng dữ liệu. Đang xử lý...")

for ngay, group in df.groupby(df['date'].str.split().str[0], sort=False):
    try:
        dt = pd.to_datetime(ngay)
        date_str = dt.strftime('%Y-%m-%d')
        day_of_week = dt.strftime('%A')
        dow_map = {
            'Monday': 'Thứ 2', 'Tuesday': 'Thứ 3', 'Wednesday': 'Thứ 4',
            'Thursday': 'Thứ 5', 'Friday': 'Thứ 6', 'Saturday': 'Thứ 7', 'Sunday': 'Chủ Nhật'
        }
        dayOfWeek = dow_map.get(day_of_week, day_of_week)
    except:
        date_str = str(ngay).strip()
        dayOfWeek = ""

    day_entry = {
        "date": date_str,
        "dayOfWeek": dayOfWeek,
        "week": clean_val(group.iloc[0]['week']),
        "period": clean_val(group.iloc[0]['period']),
        "isRestDay": False,
        "results": {},
        "allNumbers": []
    }

    actual_results = {}
    for _, row in group.iterrows():
        giai_name = clean_val(row['prize'])
        if giai_name:
            nums = [clean_val(row[f'No{i}']) for i in range(1, 8) if clean_val(row[f'No{i}'])]
            if nums:
                actual_results[giai_name.upper().replace('GĐB', 'GDB')] = nums

    if not actual_results:
        day_entry["isRestDay"] = True
    else:
        for config_name, config in LOTTERY_CONFIG.items():
            res_list = actual_results.get(config_name, [])

            if not res_list:
                error_logs.append(f"[{date_str}] Thiếu giải {config_name}")
                continue

            if len(res_list) != config['count']:
                error_logs.append(f"[{date_str}] Sai số lượng giải {config_name}: có {len(res_list)} (cần {config['count']})")

            # Xử lý padding số 0 và chuyển array/string
            processed = []
            for num in res_list:
                if len(num) != config['digits']:
                    error_logs.append(f"[{date_str}] Sai độ dài {config_name}: {num} (cần {config['digits']} số)")
                padded = num.zfill(config['digits'])   # Padding số 0 phía trước
                processed.append(padded)

            # Quyết định dùng string hay array
            if config['is_array']:
                day_entry["results"][config_name] = processed
            else:
                day_entry["results"][config_name] = processed[0] if processed else ""

            day_entry["allNumbers"].extend(processed)

    final_json.append(day_entry)

# ================== XUẤT FILE ==================
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_json, f, ensure_ascii=False, indent=2)

with open(log_path, "w", encoding="utf-8") as f:
    if error_logs:
        f.write("\n".join(error_logs))
        print(f"\n(!) Có {len(error_logs)} vấn đề được ghi vào log: {log_path}")
    else:
        print("\n(+) Dữ liệu sạch sẽ, không phát hiện lỗi!")

print(f"✅ Hoàn tất! Đã xuất {len(final_json)} ngày vào file: {output_path}")