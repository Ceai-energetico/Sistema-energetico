import pandas as pd
import openpyxl
import json

# Analizar hojas y datos
xls = pd.ExcelFile('088.xlsx')
print("=" * 80)
print("HOJAS DEL ARCHIVO:", xls.sheet_names)
print("=" * 80)

for sheet in xls.sheet_names:
    print(f"\n{'='*80}\nHOJA: {sheet}\n{'='*80}")
    df = pd.read_excel('088.xlsx', sheet_name=sheet)
    print(df.to_string())
    print("\n")
    
# También analizar con openpyxl para ver gráficos
wb = openpyxl.load_workbook('088.xlsx')
for sheet_name in wb.sheetnames:
    sheet = wb[sheet_name]
    print(f"\n{'='*80}\nAnálisis de objetos en: {sheet_name}\n{'='*80}")
    if hasattr(sheet, '_charts') and sheet._charts:
        print(f"Gráficos encontrados: {len(sheet._charts)}")
        for i, chart in enumerate(sheet._charts):
            print(f"  Gráfico {i+1}: {type(chart).__name__}")
            print(f"    - Tipo: {chart.type}")
            print(f"    - Descripción: {chart}")
    else:
        print("No hay gráficos en esta hoja")
