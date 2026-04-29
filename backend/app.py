from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database setup
BASE_DIR = os.path.dirname(__file__)
DATABASE_URL = os.getenv('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'data.db')}")

# Handle SQLite for development
if DATABASE_URL.startswith('sqlite'):
    engine_kwargs = {"connect_args": {"check_same_thread": False}}
else:
    engine_kwargs = {}

ENGINE = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
Base = declarative_base()

# Models
class Sede(Base):
    __tablename__ = 'sedes'
    id = Column(Integer, primary_key=True, index=True)
    regional = Column(String, default="")
    centro = Column(String, default="")
    nombre = Column(String, default="")
    direccion = Column(String, default="")
    ciudad = Column(String, default="")
    fecha_revision = Column(String, default="")
    responsable_empresa = Column(String, default="")
    temp_promedio = Column(Float, default=0.0)
    vel_viento = Column(Float, default=0.0)
    radiacion_solar = Column(Float, default=0.0)
    ano_construccion = Column(Integer, nullable=True)
    sede_comparte = Column(Boolean, default=False)
    propiedad = Column(String, default="")
    num_trabajadores = Column(Integer, default=0)
    num_aprendices = Column(Integer, default=0)
    num_visitantes = Column(Integer, default=0)
    tiene_renovables = Column(Boolean, default=False)
    tipos_renovables = Column(String, default="[]")
    area_total_m2 = Column(Float, default=0.0)
    area_util_m2 = Column(Float, default=0.0)
    funcionario_responsable = Column(String, default="")
    cedula_responsable = Column(String, default="")

    consumos = relationship("ConsumoMensual", back_populates="sede", cascade="all, delete-orphan")
    curva = relationship("CurvaCarga", back_populates="sede", cascade="all, delete-orphan")
    inventario = relationship("InventarioItem", back_populates="sede", cascade="all, delete-orphan")
    oportunidades = relationship("Oportunidad", back_populates="sede", cascade="all, delete-orphan")

class ConsumoMensual(Base):
    __tablename__ = 'consumos_mensuales'
    id = Column(Integer, primary_key=True, index=True)
    sede_id = Column(Integer, ForeignKey('sedes.id'))
    fecha = Column(String)
    energia_kwh = Column(Float, default=0.0)
    energia_cop = Column(Float, default=0.0)
    gas_m3 = Column(Float, default=0.0)
    gas_cop = Column(Float, default=0.0)
    acpm_gal = Column(Float, default=0.0)
    acpm_cop = Column(Float, default=0.0)
    gasolina_gal = Column(Float, default=0.0)
    gasolina_cop = Column(Float, default=0.0)

    sede = relationship("Sede", back_populates="consumos")

class CurvaCarga(Base):
    __tablename__ = 'curva_carga'
    id = Column(Integer, primary_key=True, index=True)
    sede_id = Column(Integer, ForeignKey('sedes.id'))
    hora = Column(Integer)
    potencia_kw = Column(Float)

    sede = relationship("Sede", back_populates="curva")

class InventarioItem(Base):
    __tablename__ = 'inventario'
    id = Column(Integer, primary_key=True, index=True)
    sede_id = Column(Integer, ForeignKey('sedes.id'))

    # General metadata
    hoja_tipo = Column(String, default='')  # categoría / hoja (iluminación, TIC, etc.)
    regional = Column(String, default='')
    centro_formacion = Column(String, default='')
    sede_nombre = Column(String, default='')
    grupo_principal = Column(String, default='')
    descripcion = Column(String, default='')
    marca = Column(String, default='')
    modelo = Column(String, default='')
    fabricante = Column(String, default='')
    proveedor = Column(String, default='')
    ano_instalacion = Column(Integer, nullable=True)
    observaciones = Column(String, default='')

    # Valor
    valor_unitario = Column(Float, default=0.0)
    cantidad = Column(Integer, default=0)
    valor_total = Column(Float, default=0.0)

    # Uso energético
    horas_uso_diario = Column(Float, default=0.0)
    dias_uso_mes = Column(Float, default=0.0)
    horas_uso_mes = Column(Float, default=0.0)
    potencia_kw = Column(Float, default=0.0)
    potencia_total_kw = Column(Float, default=0.0)
    consumo_mensual_kwh = Column(Float, default=0.0)

    # Otros datos (compatibilidad / categorías específicas)
    clasificacion_energetica = Column(String, default='')
    tipo_combustible = Column(String, default='')
    uso = Column(String, default='')
    ubicacion = Column(String, default='')
    tecnologia = Column(String, default='')
    refrigerante = Column(String, default='')
    capacidad_gas_kg = Column(Float, default=0.0)
    capacidad_gas_gr = Column(Float, default=0.0)
    total_gas_kg = Column(Float, default=0.0)
    consumo_combustible_gal = Column(Float, default=0.0)
    consumo_gas_m3 = Column(Float, default=0.0)
    clasificacion_equipo = Column(String, default='')
    evidencias = Column(String, default='[]')  # JSON list de URLs/nombres de archivo

    # Legacy fields for backwards compatibility
    potencia_unidad_kw = Column(Float, default=0.0)
    consumo_estimado_kwh_mes = Column(Float, default=0.0)

    sede = relationship("Sede", back_populates="inventario")

class Oportunidad(Base):
    __tablename__ = 'oportunidades'
    id = Column(Integer, primary_key=True, index=True)
    sede_id = Column(Integer, ForeignKey('sedes.id'))
    descripcion = Column(String)
    tipo = Column(String)
    potencial_ahorro = Column(Float, default=0.0)
    potencial_ahorro_cop = Column(Float, default=0.0)
    emisiones_ev = Column(Float, default=0.0)
    inversion = Column(Float, default=0.0)
    retorno_anios = Column(Float, default=0.0)

    sede = relationship("Sede", back_populates="oportunidades")

class RevisionEnergetica088(Base):
    __tablename__ = 'revisiones_energeticas_088'
    id = Column(Integer, primary_key=True, index=True)
    sede_id = Column(Integer, ForeignKey('sedes.id'))
    
    # 1. Información General
    fecha = Column(String, default="")
    regional = Column(String, default="")
    centro_formacion = Column(String, default="")
    sede_nombre = Column(String, default="")
    direccion = Column(String, default="")
    ciudad = Column(String, default="")
    area_total_m2 = Column(Float, default=0.0)
    area_util_m2 = Column(Float, default=0.0)
    temp_promedio_c = Column(Float, default=0.0)
    vel_viento_kmh = Column(Float, default=0.0)
    radiacion_solar_kwh_m2_dia = Column(Float, default=0.0)
    ano_construccion = Column(Integer, nullable=True)
    sede_comparte = Column(String, default="")
    propiedad_sede = Column(String, default="")
    num_trabajadores = Column(Integer, default=0)
    num_aprendices = Column(Integer, default=0)
    num_visitantes = Column(Integer, default=0)
    tiene_renovables = Column(String, default="")
    tipos_renovables = Column(String, default="")
    generacion_producida_kwh_anio = Column(Float, default=0.0)
    
    # 1.2 Régimen de trabajo (JSON con horarios por día)
    regimen_trabajo = Column(String, default='{}')
    
    # 1.3 Actividades (JSON con checkboxes)
    actividades = Column(String, default='{}')
    
    # 2.1 Curva de carga (JSON con datos)
    curva_carga_088 = Column(String, default='[]')
    
    # 3.1 Usos significativos de energía (JSON)
    usos_energia_electrica = Column(String, default='[]')
    usos_gas_natural = Column(String, default='[]')
    usos_acpm = Column(String, default='[]')
    usos_gasolina = Column(String, default='[]')
    matriz_energetica = Column(String, default='[]')
    
    # 3.2 Caracterización de usos significativos
    caracterizacion_usos = Column(String, default='[]')
    
    # Metadata
    fecha_creacion = Column(String, default="")
    fecha_modificacion = Column(String, default="")

# Create tables
Base.metadata.create_all(bind=ENGINE)

# Ensure inventory table has the extended schema (add missing columns when upgrading)
def ensure_inventario_schema(engine):
    # SQLite allows adding columns via ALTER TABLE.
    required = {
        'observaciones': 'TEXT DEFAULT ""',
        'grupo_principal': 'TEXT DEFAULT ""',
        'fabricante': 'TEXT DEFAULT ""',
        'proveedor': 'TEXT DEFAULT ""',
        'ano_instalacion': 'INTEGER',
        'valor_unitario': 'REAL DEFAULT 0.0',
        'valor_total': 'REAL DEFAULT 0.0',
        'horas_uso_diario': 'REAL DEFAULT 0.0',
        'dias_uso_mes': 'REAL DEFAULT 0.0',
        'horas_uso_mes': 'REAL DEFAULT 0.0',
        'potencia_kw': 'REAL DEFAULT 0.0',
        'potencia_total_kw': 'REAL DEFAULT 0.0',
        'consumo_mensual_kwh': 'REAL DEFAULT 0.0',
        'clasificacion_energetica': 'TEXT DEFAULT ""',
        'tipo_combustible': 'TEXT DEFAULT ""',
        'uso': 'TEXT DEFAULT ""',
        'ubicacion': 'TEXT DEFAULT ""',
        'tecnologia': 'TEXT DEFAULT ""',
        'refrigerante': 'TEXT DEFAULT ""',
        'capacidad_gas_kg': 'REAL DEFAULT 0.0',
        'capacidad_gas_gr': 'REAL DEFAULT 0.0',
        'total_gas_kg': 'REAL DEFAULT 0.0',
        'consumo_combustible_gal': 'REAL DEFAULT 0.0',
        'consumo_gas_m3': 'REAL DEFAULT 0.0',
        'clasificacion_equipo': 'TEXT DEFAULT ""',
        'evidencias': 'TEXT DEFAULT "[]"',
    }
    with engine.connect() as conn:
        existing = [r[1] for r in conn.execute(text("PRAGMA table_info(inventario)"))]
        for col, col_def in required.items():
            if col not in existing:
                conn.execute(text(f"ALTER TABLE inventario ADD COLUMN {col} {col_def}"))

ensure_inventario_schema(ENGINE)


def ensure_revision088_schema(engine):
    required = {
        'matriz_energetica': 'TEXT DEFAULT "[]"',
    }
    with engine.connect() as conn:
        existing = [r[1] for r in conn.execute(text("PRAGMA table_info(revisiones_energeticas_088)"))]
        for col, col_def in required.items():
            if col not in existing:
                conn.execute(text(f"ALTER TABLE revisiones_energeticas_088 ADD COLUMN {col} {col_def}"))

ensure_revision088_schema(ENGINE)

# FastAPI app
app = FastAPI(title="Sistema Energetico - API")

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files from ../frontend under /static
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))
# Ensure frontend directory exists so StaticFiles can be mounted; create if missing
if not os.path.isdir(FRONTEND_DIR):
    try:
        os.makedirs(FRONTEND_DIR, exist_ok=True)
    except Exception:
        pass
# Mount static files (will serve files placed in frontend/ at /static/<filename>)
app.mount('/static', StaticFiles(directory=FRONTEND_DIR), name='static')

# If frontend index exists, root will return it
INDEX_PATH = os.path.join(FRONTEND_DIR, 'index.html')

# Helper: initialize demo data
def init_demo(session):
    # only run if no sedes
    if session.query(Sede).first():
        return

    sede = Sede(
        regional='Ejemplo Regional',
        centro='',
        nombre='Usos Finales de Energia 087',
        direccion='Calle Falsa 123',
        ciudad='Ciudad Ejemplo',
        fecha_revision=str(datetime.now().date()),
        responsable_empresa='Empresa Revisora',
        temp_promedio=25.0,
        vel_viento=5.0,
        radiacion_solar=4.5,
        ano_construccion=2010,
        sede_comparte=False,
        propiedad='Propia',
        num_trabajadores=50,
        num_aprendices=200,
        num_visitantes=30,
        tiene_renovables=False,
        tipos_renovables=json.dumps([]),
        area_total_m2=2000.0,
        area_util_m2=1500.0,
        funcionario_responsable='Juan Perez',
        cedula_responsable='12345678'
    )
    session.add(sede)
    session.commit()

    # 36 months example
    start_year = 2023
    start_month = 1
    for m in range(36):
        year = start_year + (start_month - 1 + m) // 12
        month = ((start_month - 1 + m) % 12) + 1
        fecha = f"{year:04d}-{month:02d}-01"
        c = ConsumoMensual(
            sede_id=sede.id,
            fecha=fecha,
            energia_kwh=30000.0,
            energia_cop=18000000.0,
            gas_m3=500.0,
            gas_cop=750000.0,
            acpm_gal=0.0,
            acpm_cop=0.0,
            gasolina_gal=0.0,
            gasolina_cop=0.0
        )
        session.add(c)
    session.commit()

    # curve values from Excel
    curva_vals = [1,1,1,1,1,2,9,10,11,10.3,12.5,14,10,5,7,13,14,13,10,7,6,6,2,1]
    for h, p in enumerate(curva_vals):
        ce = CurvaCarga(sede_id=sede.id, hora=h, potencia_kw=float(p))
        session.add(ce)
    session.commit()

    inv = InventarioItem(
        sede_id=sede.id,
        hoja_tipo='Iluminación',
        grupo_principal='Iluminación',
        descripcion='Luminarias LED 50W',
        marca='MarcaX',
        modelo='FL-100',
        fabricante='MarcaX Inc.',
        proveedor='Distribuidora Demo',
        ano_instalacion=2021,
        cantidad=200,
        valor_unitario=120000.0,
        horas_uso_diario=10.0,
        dias_uso_mes=30.0,
        potencia_kw=0.05,
        observaciones='Ejemplo desde bootstrap',
        clasificacion_energetica='LED',
        ubicacion='Edificio principal',
    )
    # compute derived values (simulating frontend calculations)
    inv_dict = compute_inventory_calculations({
        'cantidad': inv.cantidad,
        'valor_unitario': inv.valor_unitario,
        'horas_uso_diario': inv.horas_uso_diario,
        'dias_uso_mes': inv.dias_uso_mes,
        'potencia_kw': inv.potencia_kw,
    })
    inv.valor_total = inv_dict['valor_total']
    inv.horas_uso_mes = inv_dict['horas_uso_mes']
    inv.potencia_total_kw = inv_dict['potencia_total_kw']
    inv.consumo_mensual_kwh = inv_dict['consumo_mensual_kwh']
    session.add(inv)
    session.commit()

    opp = Oportunidad(
        sede_id=sede.id,
        descripcion='Cambio a LED',
        tipo='Reconversión tecnológica',
        potencial_ahorro=20000.0,
        potencial_ahorro_cop=12000000.0,
        emisiones_ev=5000.0,
        inversion=40000000.0,
        retorno_anios=3.33
    )
    session.add(opp)
    session.commit()

# Startup event to initialize demo DB if empty
@app.on_event('startup')
def startup_event():
    session = SessionLocal()
    try:
        init_demo(session)
    finally:
        session.close()

# Pydantic schemas
class SedeOut(BaseModel):
    id: int
    regional: str
    centro: str
    nombre: str
    ciudad: str

    class Config:
        from_attributes = True

class InventarioItemBase(BaseModel):
    hoja_tipo: str = ''
    regional: str = ''
    centro_formacion: str = ''
    sede_nombre: str = ''
    grupo_principal: str = ''
    descripcion: str = ''
    marca: str = ''
    modelo: str = ''
    fabricante: str = ''
    proveedor: str = ''
    ano_instalacion: Optional[int] = None
    observaciones: str = ''

    valor_unitario: float = 0.0
    cantidad: int = 0

    horas_uso_diario: float = 0.0
    dias_uso_mes: float = 0.0
    potencia_kw: float = 0.0

    clasificacion_energetica: str = ''
    clasificacion_equipo: str = ''
    tipo_combustible: str = ''
    uso: str = ''
    ubicacion: str = ''
    tecnologia: str = ''
    refrigerante: str = ''
    capacidad_gas_kg: float = 0.0
    capacidad_gas_gr: float = 0.0
    total_gas_kg: float = 0.0
    consumo_combustible_gal: float = 0.0
    consumo_gas_m3: float = 0.0
    evidencias: Optional[List[str]] = None

    # Legacy fields (for backwards compatibility with older data)
    potencia_unidad_kw: float = 0.0
    consumo_estimado_kwh_mes: float = 0.0

    class Config:
        from_attributes = True

class InventarioItemCreate(InventarioItemBase):
    pass

class InventarioItemUpdate(InventarioItemBase):
    pass

class InventarioItemOut(InventarioItemBase):
    id: int
    sede_id: int
    valor_total: float = 0.0
    horas_uso_mes: float = 0.0
    potencia_total_kw: float = 0.0
    consumo_mensual_kwh: float = 0.0

    class Config:
        from_attributes = True

class RevisionEnergetica088In(BaseModel):
    fecha: str = ""
    regional: str = ""
    centro_formacion: str = ""
    sede_nombre: str = ""
    direccion: str = ""
    ciudad: str = ""
    area_total_m2: float = 0.0
    area_util_m2: float = 0.0
    temp_promedio_c: float = 0.0
    vel_viento_kmh: float = 0.0
    radiacion_solar_kwh_m2_dia: float = 0.0
    ano_construccion: Optional[int] = None
    sede_comparte: str = ""
    propiedad_sede: str = ""
    num_trabajadores: int = 0
    num_aprendices: int = 0
    num_visitantes: int = 0
    tiene_renovables: str = ""
    tipos_renovables: str = ""
    generacion_producida_kwh_anio: float = 0.0
    regimen_trabajo: str = "{}"
    actividades: str = "{}"
    curva_carga_088: str = "[]"
    matriz_energetica: str = "[]"
    usos_energia_electrica: str = "[]"
    usos_gas_natural: str = "[]"
    usos_acpm: str = "[]"
    usos_gasolina: str = "[]"
    caracterizacion_usos: str = "[]"

class RevisionEnergetica088Out(RevisionEnergetica088In):
    id: int
    sede_id: int
    
    class Config:
        from_attributes = True


def compute_inventory_calculations(data: dict) -> dict:
    """Compute derived fields for an inventory item.

    Expected keys in data: cantidad, valor_unitario, horas_uso_diario,
    dias_uso_mes, potencia_kw.
    """
    cantidad = float(data.get('cantidad') or 0)
    valor_unitario = float(data.get('valor_unitario') or 0)
    horas_uso_diario = float(data.get('horas_uso_diario') or 0)
    dias_uso_mes = float(data.get('dias_uso_mes') or 0)
    potencia_kw = float(data.get('potencia_kw') or 0)

    valor_total = cantidad * valor_unitario
    horas_uso_mes = horas_uso_diario * dias_uso_mes
    potencia_total_kw = cantidad * potencia_kw
    consumo_mensual_kwh = potencia_total_kw * horas_uso_mes

    data['valor_total'] = round(valor_total, 4)
    data['horas_uso_mes'] = round(horas_uso_mes, 4)
    data['potencia_total_kw'] = round(potencia_total_kw, 4)
    data['consumo_mensual_kwh'] = round(consumo_mensual_kwh, 4)
    return data


def _parse_evidencias(raw: Optional[str]) -> List[str]:
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        pass
    # Fallback: treat as comma-separated string
    return [p.strip() for p in str(raw).split(',') if p.strip()]


def inventario_to_dict(item: InventarioItem) -> dict:
    return {
        'id': item.id,
        'sede_id': item.sede_id,
        'hoja_tipo': item.hoja_tipo,
        'regional': item.regional,
        'centro_formacion': item.centro_formacion,
        'sede_nombre': item.sede_nombre,
        'grupo_principal': item.grupo_principal,
        'descripcion': item.descripcion,
        'marca': item.marca,
        'modelo': item.modelo,
        'fabricante': item.fabricante,
        'proveedor': item.proveedor,
        'ano_instalacion': item.ano_instalacion,
        'observaciones': item.observaciones,
        'valor_unitario': item.valor_unitario,
        'cantidad': item.cantidad,
        'valor_total': item.valor_total,
        'horas_uso_diario': item.horas_uso_diario,
        'dias_uso_mes': item.dias_uso_mes,
        'horas_uso_mes': item.horas_uso_mes,
        'potencia_kw': item.potencia_kw,
        'potencia_total_kw': item.potencia_total_kw,
        'consumo_mensual_kwh': item.consumo_mensual_kwh,
        'clasificacion_energetica': item.clasificacion_energetica,
        'clasificacion_equipo': item.clasificacion_equipo,
        'tipo_combustible': item.tipo_combustible,
        'uso': item.uso,
        'ubicacion': item.ubicacion,
        'tecnologia': item.tecnologia,
        'refrigerante': item.refrigerante,
        'capacidad_gas_kg': item.capacidad_gas_kg,
        'total_gas_kg': item.total_gas_kg,
        'consumo_combustible_gal': item.consumo_combustible_gal,
        'consumo_gas_m3': item.consumo_gas_m3,
        'capacidad_gas_gr': getattr(item, 'capacidad_gas_gr', 0.0),
        'evidencias': _parse_evidencias(item.evidencias),
    }

# Endpoints
@app.get('/api/health')
def health():
    return {'status': 'ok'}

@app.get('/api/sedes', response_model=List[SedeOut])
def list_sedes():
    session = SessionLocal()
    try:
        sedes = session.query(Sede).all()
        return sedes
    finally:
        session.close()

@app.get('/api/sedes/{sede_id}')
def get_sede(sede_id: int):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')
        consumos = [
            {
                'fecha': c.fecha,
                'energia_kwh': c.energia_kwh,
                'energia_cop': c.energia_cop,
                'gas_m3': c.gas_m3,
                'gas_cop': c.gas_cop
            }
            for c in s.consumos
        ]
        curva = [{'hora': c.hora, 'potencia_kw': c.potencia_kw} for c in s.curva]
        invent = [inventario_to_dict(i) for i in s.inventario]
        opps = [
            {
                'descripcion': o.descripcion,
                'tipo': o.tipo,
                'potencial_ahorro': o.potencial_ahorro,
                'potencial_ahorro_cop': o.potencial_ahorro_cop
            }
            for o in s.oportunidades
        ]
        out = {
            'id': s.id,
            'regional': s.regional,
            'centro': s.centro,
            'nombre': s.nombre,
            'direccion': s.direccion,
            'ciudad': s.ciudad,
            'fecha_revision': s.fecha_revision,
            'temp_promedio': s.temp_promedio,
            'vel_viento': s.vel_viento,
            'radiacion_solar': s.radiacion_solar,
            'consumos_36m': consumos,
            'curva_carga': curva,
            'inventario': invent,
            'oportunidades': opps
        }
        return out
    finally:
        session.close()

@app.get('/api/sedes/{sede_id}/pareto/energia')
def pareto_energia(sede_id: int):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')
        usage = {}
        for it in s.inventario:
            key = it.descripcion or 'Otros'
            usage[key] = usage.get(key, 0.0) + (it.consumo_estimado_kwh_mes or 0.0)
        items = sorted(usage.items(), key=lambda x: x[1], reverse=True)
        total = sum(v for k, v in items)
        acum = 0.0
        pareto = []
        for k, v in items:
            acum += v
            pct = (v / total * 100) if total > 0 else 0
            acum_pct = (acum / total * 100) if total > 0 else 0
            pareto.append({'uso': k, 'consumo': v, 'porcentaje': pct, 'acumulado_pct': acum_pct})
        return {'total': total, 'pareto': pareto}
    finally:
        session.close()

@app.get('/api/sedes/{sede_id}/inventario', response_model=List[InventarioItemOut])
def list_inventario(sede_id: int):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')
        return [inventario_to_dict(i) for i in s.inventario]
    finally:
        session.close()

@app.post('/api/sedes/{sede_id}/inventario', response_model=InventarioItemOut)
def create_inventario_item(sede_id: int, payload: InventarioItemCreate):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')

        # Log the incoming payload for debugging
        print(f"DEBUG: Received payload: {payload.dict()}")

        data = payload.dict()
        data = compute_inventory_calculations(data)
        item = InventarioItem(sede_id=sede_id, **data)
        # ensure evidences stored as JSON string
        if data.get('evidencias') is not None:
            item.evidencias = json.dumps(data.get('evidencias') or [])
        session.add(item)
        session.commit()
        session.refresh(item)
        return inventario_to_dict(item)
    except Exception as e:
        print(f"DEBUG: Error creating inventory item: {e}")
        raise
    finally:
        session.close()

@app.put('/api/inventario/{item_id}', response_model=InventarioItemOut)
def update_inventario_item(item_id: int, payload: InventarioItemUpdate):
    session = SessionLocal()
    try:
        item = session.query(InventarioItem).filter(InventarioItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail='Item de inventario no encontrado')
        data = payload.dict()
        data = compute_inventory_calculations(data)
        for k, v in data.items():
            if hasattr(item, k):
                setattr(item, k, v)
        if data.get('evidencias') is not None:
            item.evidencias = json.dumps(data.get('evidencias') or [])
        session.commit()
        session.refresh(item)
        return inventario_to_dict(item)
    finally:
        session.close()

@app.delete('/api/inventario/{item_id}')
def delete_inventario_item(item_id: int):
    session = SessionLocal()
    try:
        item = session.query(InventarioItem).filter(InventarioItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail='Item de inventario no encontrado')
        session.delete(item)
        session.commit()
        return {'ok': True}
    finally:
        session.close()

@app.get('/api/sedes/{sede_id}/consolidado')
def consolidado_sede(sede_id: int):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')
        total = 0.0
        per_category = {}
        for it in s.inventario:
            key = it.hoja_tipo or 'Otros'
            consumo = float(it.consumo_mensual_kwh or 0.0)
            per_category[key] = per_category.get(key, 0.0) + consumo
            total += consumo
        detalle = [{'categoria': k, 'consumo_kwh': v} for k, v in per_category.items()]
        return {'total_consumo_kwh': total, 'por_categoria': detalle}
    finally:
        session.close()

# Endpoints para Revisión Energética 088
@app.post('/api/sedes/{sede_id}/revision088', response_model=RevisionEnergetica088Out)
def create_revision088(sede_id: int, payload: RevisionEnergetica088In):
    session = SessionLocal()
    try:
        s = session.query(Sede).filter(Sede.id == sede_id).first()
        if not s:
            raise HTTPException(status_code=404, detail='Sede no encontrada')
        data = payload.dict()
        data['sede_id'] = sede_id
        data['fecha_creacion'] = str(datetime.now())
        data['fecha_modificacion'] = str(datetime.now())
        rev = RevisionEnergetica088(**data)
        session.add(rev)
        session.commit()
        session.refresh(rev)
        return rev
    finally:
        session.close()

@app.get('/api/sedes/{sede_id}/revision088')
def get_revision088(sede_id: int):
    session = SessionLocal()
    try:
        rev = session.query(RevisionEnergetica088).filter(RevisionEnergetica088.sede_id == sede_id).first()
        if not rev:
            # Return empty/default revision
            return {
                'id': None,
                'sede_id': sede_id,
                'fecha': '',
                'regional': '',
                'centro_formacion': '',
                'sede_nombre': '',
                'direccion': '',
                'ciudad': '',
                'area_total_m2': 0.0,
                'area_util_m2': 0.0,
                'temp_promedio_c': 0.0,
                'vel_viento_kmh': 0.0,
                'radiacion_solar_kwh_m2_dia': 0.0,
                'ano_construccion': None,
                'sede_comparte': '',
                'propiedad_sede': '',
                'num_trabajadores': 0,
                'num_aprendices': 0,
                'num_visitantes': 0,
                'tiene_renovables': '',
                'tipos_renovables': '',
                'generacion_producida_kwh_anio': 0.0,
                'regimen_trabajo': '{}',
                'actividades': '{}',
                'curva_carga_088': '[]',
                'usos_energia_electrica': '[]',
                'usos_gas_natural': '[]',
                'usos_acpm': '[]',
                'usos_gasolina': '[]',
                'matriz_energetica': '[]',
                'caracterizacion_usos': '[]',
            }
        return rev
    finally:
        session.close()

@app.put('/api/revision088/{rev_id}', response_model=RevisionEnergetica088Out)
def update_revision088(rev_id: int, payload: RevisionEnergetica088In):
    session = SessionLocal()
    try:
        rev = session.query(RevisionEnergetica088).filter(RevisionEnergetica088.id == rev_id).first()
        if not rev:
            raise HTTPException(status_code=404, detail='Revisión 088 no encontrada')
        data = payload.dict()
        data['fecha_modificacion'] = str(datetime.now())
        for k, v in data.items():
            if hasattr(rev, k):
                setattr(rev, k, v)
        session.commit()
        session.refresh(rev)
        return rev
    finally:
        session.close()

@app.delete('/api/revision088/{rev_id}')
def delete_revision088(rev_id: int):
    session = SessionLocal()
    try:
        rev = session.query(RevisionEnergetica088).filter(RevisionEnergetica088.id == rev_id).first()
        if not rev:
            raise HTTPException(status_code=404, detail='Revisión 088 no encontrada')
        session.delete(rev)
        session.commit()
        return {'ok': True}
    finally:
        session.close()

# Serve frontend index
@app.get('/')
async def root():
    if os.path.exists(INDEX_PATH):
        return FileResponse(INDEX_PATH)
    return {"msg": "Frontend no encontrado. Revisa README."}
