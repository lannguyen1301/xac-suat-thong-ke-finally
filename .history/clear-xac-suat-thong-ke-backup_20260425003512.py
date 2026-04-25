# nháp
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
    "GDB": {"digits": 6, "count": 1},
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
    day_entry = {"Ngay": day_str, "Tuan": clean_val(group.iloc[0]['Tuan']), "Dot": clean_val(group.iloc[0]['Dot']), "NghiQuay": False, "results": {}, "allNumbers": []}

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
            
            day_entry["results"][config_name] = valid_nums
            day_entry["allNumbers"].extend(valid_nums)

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
        