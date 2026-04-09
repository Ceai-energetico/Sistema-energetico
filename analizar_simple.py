import pandas as pd
import openpyxl
import json

# Analizar con pandas
df = pd.read_excel('088.xlsx', sheet_name=0)

# Mostrar info básica
print("HOJAS:", df.shape)
print("\nCOLUMNAS:")
print(df.columns.tolist())
print("\nPRIMERAS FILAS (solo columnas con datos):")

# Mostrar solo columnas no vacías
non_empty_cols = [col for col in df.columns if df[col].notna().any()]
print(df[non_empty_cols].head(50).to_string())

# Guardar en JSON para análisis
print("\n\n=== ANÁLISIS DE DATOS ===")
print(f"Total de filas: {len(df)}")
print(f"Total de columnas: {len(df.columns)}")
print(f"Columnas no vacías: {len(non_empty_cols)}")
print(f"\nNombres de columnas con datos:")
for col in non_empty_cols:
    print(f"  - {col}: {df[col].dtype}, valores únicos: {df[col].nunique()}")
