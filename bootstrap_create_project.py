"""
Bootstrap script para crear el proyecto "Sistema energetico" en tu máquina local.

Qué hace este script:
- Crea la estructura de carpetas:
  - backend/ (FastAPI app)
  - frontend/ (React via CDN + Chart.js)
- Crea archivos: backend/app.py, backend/requirements.txt, frontend/index.html, frontend/app.jsx, frontend/styles.css, README.md
- El backend incluye modelos SQLAlchemy y datos de ejemplo (36 meses de consumos y curva de carga) cargados al iniciar.
- Instrucciones para ejecutar están en README.md

Ejecución:
1. Guarda este archivo en c:\\Users\\Aprendiz\\Desktop\\Sistema energetico
2. Abre CMD en esa carpeta y ejecuta: python bootstrap_create_project.py
3. Entra a backend, crea entorno virtual e instala dependencias:
   python -m venv .venv
   .\.venv\\Scripts\\activate
   pip install -r backend\\requirements.txt
4. Ejecuta el servidor:
   uvicorn backend.app:app --reload --port 8000
5. Abre http://localhost:8000 en tu navegador (sirve el frontend y la API)

Nota: El frontend usa React y Chart.js vía CDN para evitar pasos de build (fácil demo local). Para producción se recomienda crear una app React con bundler (Vite/CRA) y desplegar el backend y frontend correctamente.

"""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"Created: {path}")

# backend/app.py
backend_app = r'''
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
import json

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "data.db")
ENGINE = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
Base = declarative_base()

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
    # relationships
    consumos = relationship("ConsumoMensual", back_populates="sede")
    curva = relationship("CurvaCarga", back_populates="sede")
    inventario = relationship("InventarioItem", back_populates="sede")
    oportunidades = relationship("Oportunidad", back_populates="sede")

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
    hoja_tipo = Column(String)
    descripcion = Column(String)
    marca = Column(String)
    modelo = Column(String)
    cantidad = Column(Integer, default=0)
    potencia_unidad_kw = Column(Float, default=0.0)
    horas_uso_mes = Column(Float, default=0.0)
    consumo_estimado_kwh_mes = Column(Float, default=0.0)
    observacion = Column(String)
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

Base.metadata.create_all(bind=ENGINE)

app = FastAPI(title="Sistema Energetico - API")

# servir frontend static
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')
if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# Helper to init demo data
def init_demo(session):
    sedes = session.query(Sede).all()
    if sedes:
        return
    # Crear sede ejemplo usando datos del Excel adjunto
    sede = Sede(
        regional="Ejemplo Regional",
        centro="Centro Demo",
        nombre="Sede Demo",
        direccion="Calle Falsa 123",
        ciudad="Ciudad Ejemplo",
        fecha_revision=str(datetime.now().date()),
        responsable_empresa="Empresa Revisora",
        temp_promedio=25.0,
        vel_viento=5.0,
        radiacion_solar=4.5,
        ano_construccion=2010,
        sede_comparte=False,
        propiedad="Propia",
        num_trabajadores=50,
        num_aprendices=200,
        num_visitantes=30,
        tiene_renovables=False,
        tipos_renovables=json.dumps([]),
        area_total_m2=2000.0,
        area_util_m2=1500.0,
        funcionario_responsable="Juan Perez",
        cedula_responsable="12345678"
    )
    session.add(sede)
    session.commit()

    # Cargar 36 meses ejemplo (energía: 30000 kWh por mes, costo 18,000,000 COP; gas 500 m3 costo 750,000 COP)
    start_month = datetime(2023,1,1)
    for m in range(36):
        dt = datetime(start_month.year + (start_month.month-1 + m)//12, ((start_month.month-1 + m) % 12) + 1, 1)
        c = ConsumoMensual(
            sede_id=sede.id,
            fecha=dt.strftime('%Y-%m-01'),
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

    # Curva de carga ejemplo (horas 0-23) según tabla del Excel
    curva_vals = [1,1,1,1,1,2,9,10,11,10.3,12.5,14,10,5,7,13,14,13,10,7,6,6,2,1]
    for h, p in enumerate(curva_vals):
        ce = CurvaCarga(sede_id=sede.id, hora=h, potencia_kw=float(p))
        session.add(ce)
    session.commit()

    # Inventario de ejemplo: algunas luminarias
    inv = InventarioItem(sede_id=sede.id, hoja_tipo='iluminacion', descripcion='Luminarias fluorescentes', marca='MarcaX', modelo='FL-100', cantidad=200, potencia_unidad_kw=0.5, horas_uso_mes=360, consumo_estimado_kwh_mes=200*0.5*360, observacion='Ejemplo desde bootstrap')
    session.add(inv)
    session.commit()

    # Oportunidad ejemplo
    opp = Oportunidad(sede_id=sede.id, descripcion='Cambio a LED', tipo='Reconversión tecnológica', potencial_ahorro=20000.0, potencial_ahorro_cop=12000000.0, emisiones_ev=5000.0, inversion=40000000.0, retorno_anios=3.33)
    session.add(opp)
    session.commit()

@app.on_event("startup")
def startup_event():
    session = SessionLocal()
    init_demo(session)
    session.close()

# Pydantic schemas
class SedeCreate(BaseModel):
    regional: str
    centro: str
    nombre: str

class ConsumoSchema(BaseModel):
    fecha: str
    energia_kwh: float
    energia_cop: float
    gas_m3: float
    gas_cop: float

class CurvaPoint(BaseModel):
    hora: int
    potencia_kw: float

# Endpoints
@app.get('/api/health')
def health():
    return {'status': 'ok'}

@app.get('/api/sedes')
def list_sedes():
    session = SessionLocal()
    sedes = session.query(Sede).all()
    out = []
    for s in sedes:
        out.append({
            'id': s.id,
            'regional': s.regional,
            'centro': s.centro,
            'nombre': s.nombre,
            'ciudad': s.ciudad
        })
    session.close()
    return out

@app.get('/api/sedes/{sede_id}')
def get_sede(sede_id: int):
    session = SessionLocal()
    s = session.query(Sede).filter(Sede.id==sede_id).first()
    if not s:
        session.close()
        raise HTTPException(status_code=404, detail='Sede no encontrada')
    # consumos
    consumos = []
    for c in s.consumos:
        consumos.append({
            'fecha': c.fecha,
            'energia_kwh': c.energia_kwh,
            'energia_cop': c.energia_cop,
            'gas_m3': c.gas_m3,
            'gas_cop': c.gas_cop
        })
    # curva
    curva = [{'hora': c.hora, 'potencia_kw': c.potencia_kw} for c in s.curva]
    # inventario
    invent = [{'descripcion': i.descripcion, 'hoja_tipo': i.hoja_tipo, 'cantidad': i.cantidad, 'potencia_unidad_kw': i.potencia_unidad_kw, 'consumo_estimado_kwh_mes': i.consumo_estimado_kwh_mes} for i in s.inventario]
    # oportunidades
    opps = [{ 'descripcion': o.descripcion, 'tipo': o.tipo, 'potencial_ahorro': o.potencial_ahorro, 'potencial_ahorro_cop': o.potencial_ahorro_cop } for o in s.oportunidades]
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
    session.close()
    return out

@app.get('/api/sedes/{sede_id}/pareto/energia')
def pareto_energia(sede_id: int):
    # Genera un Pareto simple desde inventario agrupando por descripcion
    session = SessionLocal()
    s = session.query(Sede).filter(Sede.id==sede_id).first()
    if not s:
        session.close()
        raise HTTPException(status_code=404, detail='Sede no encontrada')
    usage = {}
    for it in s.inventario:
        key = it.descripcion or 'Otros'
        usage[key] = usage.get(key, 0.0) + (it.consumo_estimado_kwh_mes or 0.0)
    items = sorted(usage.items(), key=lambda x: x[1], reverse=True)
    total = sum(v for k,v in items)
    acum = 0.0
    pareto = []
    for k,v in items:
        acum += v
        pct = (v/total*100) if total>0 else 0
        acum_pct = (acum/total*100) if total>0 else 0
        pareto.append({'uso': k, 'consumo': v, 'porcentaje': pct, 'acumulado_pct': acum_pct})
    session.close()
    return {'total': total, 'pareto': pareto}

# Endpoint para devolver archivo frontend principal (si se abre /)
@app.get('/')
async def root():
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {'msg': 'Frontend no encontrado. Ver README.'}
'''

# backend/requirements.txt
backend_reqs = r'''
fastapi
uvicorn[standard]
SQLAlchemy
pydantic
jinja2
pandas
python-multipart
'''

# frontend/index.html using React via CDN and Chart.js
frontend_index = r'''
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sistema Energético - Demo</title>
    <link rel="stylesheet" href="/static/styles.css" />
    <!-- React via CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel para JSX en navegador (solo demo local) -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div id="root">Cargando aplicación...</div>

    <script type="text/babel" src="/static/app.jsx"></script>
  </body>
</html>
'''

# frontend/app.jsx (React) - simple UI that displays sede and charts
frontend_app = r'''
const { useState, useEffect } = React;

function App(){
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState(null);

  useEffect(()=>{
    fetch('/api/sedes').then(r=>r.json()).then(setSedes);
  },[]);

  useEffect(()=>{
    if(sede){
      // after sede loaded, render charts
      setTimeout(()=>{
        renderCurva(sede.curva_carga);
        renderMatriz(sede.consumos_36m);
      }, 200);
    }
  },[sede]);

  function selectSede(id){
    fetch(`/api/sedes/${id}`).then(r=>r.json()).then(setSede);
  }

  return (
    <div className="container">
      <h1>Sistema Energético - Demo</h1>
      <div className="flex">
        <div className="panel">
          <h2>Sedes</h2>
          <ul>
            {sedes.map(s=> (
              <li key={s.id}><button onClick={()=>selectSede(s.id)}>{s.nombre} - {s.centro}</button></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          {sede ? (
            <div>
              <h2>{sede.nombre} ({sede.ciudad})</h2>
              <p><strong>Regional:</strong> {sede.regional} · <strong>Centro:</strong> {sede.centro}</p>
              <p><strong>Temperatura avg (°C):</strong> {sede.temp_promedio} · <strong>Viento (km/h):</strong> {sede.vel_viento} · <strong>Radiación (kWh/m2día):</strong> {sede.radiacion_solar}</p>

              <h3>Curva de carga (día representativo)</h3>
              <canvas id="curvaChart" width="600" height="200"></canvas>

              <h3>Matriz energética (36 meses) - energía eléctrica kWh</h3>
              <canvas id="matrizChart" width="600" height="200"></canvas>

              <h3>Inventario (ejemplo)</h3>
              <table className="table">
                <thead><tr><th>Hoja</th><th>Descripción</th><th>Cantidad</th><th>Potencia (kW)</th><th>Consumo mes (kWh)</th></tr></thead>
                <tbody>
                  {sede.inventario.map((i,idx)=>(
                    <tr key={idx}><td>{i.hoja_tipo}</td><td>{i.descripcion}</td><td>{i.cantidad}</td><td>{i.potencia_unidad_kw}</td><td>{i.consumo_estimado_kwh_mes}</td></tr>
                  ))}
                </tbody>
              </table>

              <h3>Oportunidades</h3>
              <ul>
                {sede.oportunidades.map((o,idx)=>(<li key={idx}><strong>{o.tipo}</strong>: {o.descripcion} — Ahorro estimado: {o.potencial_ahorro} (kWh)</li>))}
              </ul>

            </div>
          ) : (
            <p>Selecciona una sede a la izquierda para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function renderCurva(curva){
  const ctx = document.getElementById('curvaChart').getContext('2d');
  const labels = curva.map(p=>p.hora);
  const data = curva.map(p=>p.potencia_kw);
  if(window.curvaChart) window.curvaChart.destroy();
  window.curvaChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Potencia (kW)', data, borderColor: 'blue', tension: 0.2 }]},
    options: { responsive: true }
  });
}

function renderMatriz(consumos){
  const ctx = document.getElementById('matrizChart').getContext('2d');
  const labels = consumos.map(c=>c.fecha);
  const data = consumos.map(c=>c.energia_kwh);
  if(window.matrizChart) window.matrizChart.destroy();
  window.matrizChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Energía (kWh)', data, backgroundColor: 'orange' }]},
    options: { responsive: true, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
'''

# frontend/styles.css
frontend_css = r'''
body{font-family: Arial, Helvetica, sans-serif; margin:20px;}
.container{max-width:1200px;margin:0 auto}
.flex{display:flex;gap:20px}
.panel{flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#fafafa}
.table{width:100%;border-collapse:collapse}
.table th, .table td{border:1px solid #ccc;padding:6px}
button{cursor:pointer}
'''

# README.md
readme = r'''
Sistema Energético - Demo

Estructura creada por bootstrap_create_project.py

Backend (FastAPI): backend/app.py
Frontend (React via CDN): frontend/index.html (servido por FastAPI)

Instalación y ejecución:
1. Ejecuta este script: python bootstrap_create_project.py (ya lo hiciste para crear los archivos)
2. Entra a la carpeta backend:
   cd backend
3. Crea y activa un virtualenv:
   python -m venv .venv
   .\.venv\Scripts\activate
4. Instala dependencias:
   pip install -r requirements.txt
5. Ejecuta el servidor:
   uvicorn app:app --reload --port 8000
6. Abre tu navegador en http://localhost:8000

Notas:
- El backend inicializa una sede/demo con 36 meses de consumos y una curva de carga (valores de ejemplo tomados de los Excel que proporcionaste).
- Para producción se recomienda separar frontend y usar una build con bundler.
- Si deseas que importe los archivos Excel reales (GOR-F-087 y GOR-F-088) puedo añadir una ruta para subir y parsearlos automáticamente.
'''

# Crear archivos

def main():
    print('Creando estructura del proyecto en: ', ROOT)
    write(ROOT / 'backend' / 'app.py', backend_app)
    write(ROOT / 'backend' / 'requirements.txt', backend_reqs)
    # static files will be served under backend/static via FastAPI mounting frontend
    frontend_dir = ROOT / 'frontend'
    write(frontend_dir / 'index.html', frontend_index)
    write(frontend_dir / 'app.jsx', frontend_app)
    write(frontend_dir / 'styles.css', frontend_css)
    write(ROOT / 'README.md', readme)
    print('\nBootstrap completo. Sigue las instrucciones en README.md para ejecutar el proyecto localmente.')

if __name__ == '__main__':
    main()
'''}

# Write the bootstrap file to disk
write(Path(ROOT) / 'bootstrap_create_project.py', open(__file__).read() if False else bootstrap_create_project := open.__call__ and None)

# Note: we cannot execute open(__file__) from within the generator; instead we output the file content directly above.
# But because the runtime environment for this script generation is the assistant, below we actually write the bootstrap_create_project.py file contents.

# Instead of the attempted write above, write the prepared content explicitly:

content = '''"""
Bootstrap script para crear el proyecto "Sistema energetico" en tu máquina local.

Qué hace este script:
- Crea la estructura de carpetas:
  - backend/ (FastAPI app)
  - frontend/ (React via CDN + Chart.js)
- Crea archivos: backend/app.py, backend/requirements.txt, frontend/index.html, frontend/app.jsx, frontend/styles.css, README.md
- El backend incluye modelos SQLAlchemy y datos de ejemplo (36 meses de consumos y curva de carga) cargados al iniciar.
- Instrucciones para ejecutar están en README.md

Ejecución:
1. Guarda este archivo en c:\\Users\\Aprendiz\\Desktop\\Sistema energetico
2. Abre CMD en esa carpeta y ejecuta: python bootstrap_create_project.py
3. Entra a backend, crea entorno virtual e instala dependencias:
   python -m venv .venv
   .\\.venv\\Scripts\\activate
   pip install -r backend\\requirements.txt
4. Ejecuta el servidor:
   uvicorn backend.app:app --reload --port 8000
5. Abre http://localhost:8000 en tu navegador (sirve el frontend y la API)

Nota: El frontend usa React y Chart.js vía CDN para evitar pasos de build (fácil demo local). Para producción se recomienda crear una app React con bundler (Vite/CRA) y desplegar el backend y frontend correctamente.

"""

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"Created: {path}")

# backend/app.py
backend_app = r'''
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
import json

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "data.db")
ENGINE = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=ENGINE)
Base = declarative_base()

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
    # relationships
    consumos = relationship("ConsumoMensual", back_populates="sede")
    curva = relationship("CurvaCarga", back_populates="sede")
    inventario = relationship("InventarioItem", back_populates="sede")
    oportunidades = relationship("Oportunidad", back_populates="sede")

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
    hoja_tipo = Column(String)
    descripcion = Column(String)
    marca = Column(String)
    modelo = Column(String)
    cantidad = Column(Integer, default=0)
    potencia_unidad_kw = Column(Float, default=0.0)
    horas_uso_mes = Column(Float, default=0.0)
    consumo_estimado_kwh_mes = Column(Float, default=0.0)
    observacion = Column(String)
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

Base.metadata.create_all(bind=ENGINE)

app = FastAPI(title="Sistema Energetico - API")

# servir frontend static
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')
if os.path.isdir(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# Helper to init demo data
def init_demo(session):
    sedes = session.query(Sede).all()
    if sedes:
        return
    # Crear sede ejemplo usando datos del Excel adjunto
    sede = Sede(
        regional="Ejemplo Regional",
        centro="Centro Demo",
        nombre="Sede Demo",
        direccion="Calle Falsa 123",
        ciudad="Ciudad Ejemplo",
        fecha_revision=str(datetime.now().date()),
        responsable_empresa="Empresa Revisora",
        temp_promedio=25.0,
        vel_viento=5.0,
        radiacion_solar=4.5,
        ano_construccion=2010,
        sede_comparte=False,
        propiedad="Propia",
        num_trabajadores=50,
        num_aprendices=200,
        num_visitantes=30,
        tiene_renovables=False,
        tipos_renovables=json.dumps([]),
        area_total_m2=2000.0,
        area_util_m2=1500.0,
        funcionario_responsable="Juan Perez",
        cedula_responsable="12345678"
    )
    session.add(sede)
    session.commit()

    # Cargar 36 meses ejemplo (energía: 30000 kWh por mes, costo 18,000,000 COP; gas 500 m3 costo 750,000 COP)
    start_month = datetime(2023,1,1)
    for m in range(36):
        dt = datetime(start_month.year + (start_month.month-1 + m)//12, ((start_month.month-1 + m) % 12) + 1, 1)
        c = ConsumoMensual(
            sede_id=sede.id,
            fecha=dt.strftime('%Y-%m-01'),
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

    # Curva de carga ejemplo (horas 0-23) según tabla del Excel
    curva_vals = [1,1,1,1,1,2,9,10,11,10.3,12.5,14,10,5,7,13,14,13,10,7,6,6,2,1]
    for h, p in enumerate(curva_vals):
        ce = CurvaCarga(sede_id=sede.id, hora=h, potencia_kw=float(p))
        session.add(ce)
    session.commit()

    # Inventario de ejemplo: algunas luminarias
    inv = InventarioItem(sede_id=sede.id, hoja_tipo='iluminacion', descripcion='Luminarias fluorescentes', marca='MarcaX', modelo='FL-100', cantidad=200, potencia_unidad_kw=0.5, horas_uso_mes=360, consumo_estimado_kwh_mes=200*0.5*360, observacion='Ejemplo desde bootstrap')
    session.add(inv)
    session.commit()

    # Oportunidad ejemplo
    opp = Oportunidad(sede_id=sede.id, descripcion='Cambio a LED', tipo='Reconversión tecnológica', potencial_ahorro=20000.0, potencial_ahorro_cop=12000000.0, emisiones_ev=5000.0, inversion=40000000.0, retorno_anios=3.33)
    session.add(opp)
    session.commit()

@app.on_event("startup")
def startup_event():
    session = SessionLocal()
    init_demo(session)
    session.close()

# Pydantic schemas
class SedeCreate(BaseModel):
    regional: str
    centro: str
    nombre: str

class ConsumoSchema(BaseModel):
    fecha: str
    energia_kwh: float
    energia_cop: float
    gas_m3: float
    gas_cop: float

class CurvaPoint(BaseModel):
    hora: int
    potencia_kw: float

# Endpoints
@app.get('/api/health')
def health():
    return {'status': 'ok'}

@app.get('/api/sedes')
def list_sedes():
    session = SessionLocal()
    sedes = session.query(Sede).all()
    out = []
    for s in sedes:
        out.append({
            'id': s.id,
            'regional': s.regional,
            'centro': s.centro,
            'nombre': s.nombre,
            'ciudad': s.ciudad
        })
    session.close()
    return out

@app.get('/api/sedes/{sede_id}')
def get_sede(sede_id: int):
    session = SessionLocal()
    s = session.query(Sede).filter(Sede.id==sede_id).first()
    if not s:
        session.close()
        raise HTTPException(status_code=404, detail='Sede no encontrada')
    # consumos
    consumos = []
    for c in s.consumos:
        consumos.append({
            'fecha': c.fecha,
            'energia_kwh': c.energia_kwh,
            'energia_cop': c.energia_cop,
            'gas_m3': c.gas_m3,
            'gas_cop': c.gas_cop
        })
    # curva
    curva = [{'hora': c.hora, 'potencia_kw': c.potencia_kw} for c in s.curva]
    # inventario
    invent = [{'descripcion': i.descripcion, 'hoja_tipo': i.hoja_tipo, 'cantidad': i.cantidad, 'potencia_unidad_kw': i.potencia_unidad_kw, 'consumo_estimado_kwh_mes': i.consumo_estimado_kwh_mes} for i in s.inventario]
    # oportunidades
    opps = [{ 'descripcion': o.descripcion, 'tipo': o.tipo, 'potencial_ahorro': o.potencial_ahorro, 'potencial_ahorro_cop': o.potencial_ahorro_cop } for o in s.oportunidades]
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
    session.close()
    return out

@app.get('/api/sedes/{sede_id}/pareto/energia')
def pareto_energia(sede_id: int):
    # Genera un Pareto simple desde inventario agrupando por descripcion
    session = SessionLocal()
    s = session.query(Sede).filter(Sede.id==sede_id).first()
    if not s:
        session.close()
        raise HTTPException(status_code=404, detail='Sede no encontrada')
    usage = {}
    for it in s.inventario:
        key = it.descripcion or 'Otros'
        usage[key] = usage.get(key, 0.0) + (it.consumo_estimado_kwh_mes or 0.0)
    items = sorted(usage.items(), key=lambda x: x[1], reverse=True)
    total = sum(v for k,v in items)
    acum = 0.0
    pareto = []
    for k,v in items:
        acum += v
        pct = (v/total*100) if total>0 else 0
        acum_pct = (acum/total*100) if total>0 else 0
        pareto.append({'uso': k, 'consumo': v, 'porcentaje': pct, 'acumulado_pct': acum_pct})
    session.close()
    return {'total': total, 'pareto': pareto}

# Endpoint para devolver archivo frontend principal (si se abre root en el navegador)
@app.get('/')
async def root():
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {'msg': 'Frontend no encontrado. Ver README.'}
'''

# backend/requirements.txt
backend_reqs = r'''
fastapi
uvicorn[standard]
SQLAlchemy
pydantic
jinja2
pandas
python-multipart
'''

# frontend/index.html using React via CDN and Chart.js
frontend_index = r'''
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sistema Energético - Demo</title>
    <link rel="stylesheet" href="/static/styles.css" />
    <!-- React via CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel para JSX en navegador (solo demo local) -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div id="root">Cargando aplicación...</div>

    <script type="text/babel" src="/static/app.jsx"></script>
  </body>
</html>
'''

# frontend/app.jsx (React) - simple UI that displays sede and charts
frontend_app = r'''
const { useState, useEffect } = React;

function App(){
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState(null);

  useEffect(()=>{
    fetch('/api/sedes').then(r=>r.json()).then(setSedes);
  },[]);

  useEffect(()=>{
    if(sede){
      // after sede loaded, render charts
      setTimeout(()=>{
        renderCurva(sede.curva_carga);
        renderMatriz(sede.consumos_36m);
      }, 200);
    }
  },[sede]);

  function selectSede(id){
    fetch(`/api/sedes/${id}`).then(r=>r.json()).then(setSede);
  }

  return (
    <div className="container">
      <h1>Sistema Energético - Demo</h1>
      <div className="flex">
        <div className="panel">
          <h2>Sedes</h2>
          <ul>
            {sedes.map(s=> (
              <li key={s.id}><button onClick={()=>selectSede(s.id)}>{s.nombre} - {s.centro}</button></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          {sede ? (
            <div>
              <h2>{sede.nombre} ({sede.ciudad})</h2>
              <p><strong>Regional:</strong> {sede.regional} · <strong>Centro:</strong> {sede.centro}</p>
              <p><strong>Temperatura avg (°C):</strong> {sede.temp_promedio} · <strong>Viento (km/h):</strong> {sede.vel_viento} · <strong>Radiación (kWh/m2día):</strong> {sede.radiacion_solar}</p>

              <h3>Curva de carga (día representativo)</h3>
              <canvas id="curvaChart" width="600" height="200"></canvas>

              <h3>Matriz energética (36 meses) - energía eléctrica kWh</h3>
              <canvas id="matrizChart" width="600" height="200"></canvas>

              <h3>Inventario (ejemplo)</h3>
              <table className="table">
                <thead><tr><th>Hoja</th><th>Descripción</th><th>Cantidad</th><th>Potencia (kW)</th><th>Consumo mes (kWh)</th></tr></thead>
                <tbody>
                  {sede.inventario.map((i,idx)=>(
                    <tr key={idx}><td>{i.hoja_tipo}</td><td>{i.descripcion}</td><td>{i.cantidad}</td><td>{i.potencia_unidad_kw}</td><td>{i.consumo_estimado_kwh_mes}</td></tr>
                  ))}
                </tbody>
              </table>

              <h3>Oportunidades</h3>
              <ul>
                {sede.oportunidades.map((o,idx)=>(<li key={idx}><strong>{o.tipo}</strong>: {o.descripcion} — Ahorro estimado: {o.potencial_ahorro} (kWh)</li>))}
              </ul>

            </div>
          ) : (
            <p>Selecciona una sede a la izquierda para ver detalles.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function renderCurva(curva){
  const ctx = document.getElementById('curvaChart').getContext('2d');
  const labels = curva.map(p=>p.hora);
  const data = curva.map(p=>p.potencia_kw);
  if(window.curvaChart) window.curvaChart.destroy();
  window.curvaChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Potencia (kW)', data, borderColor: 'blue', tension: 0.2 }]},
    options: { responsive: true }
  });
}

function renderMatriz(consumos){
  const ctx = document.getElementById('matrizChart').getContext('2d');
  const labels = consumos.map(c=>c.fecha);
  const data = consumos.map(c=>c.energia_kwh);
  if(window.matrizChart) window.matrizChart.destroy();
  window.matrizChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Energía (kWh)', data, backgroundColor: 'orange' }]},
    options: { responsive: true, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
'''

# frontend/styles.css
frontend_css = r'''
body{font-family: Arial, Helvetica, sans-serif; margin:20px;}
.container{max-width:1200px;margin:0 auto}
.flex{display:flex;gap:20px}
.panel{flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;background:#fafafa}
.table{width:100%;border-collapse:collapse}
.table th, .table td{border:1px solid #ccc;padding:6px}
button{cursor:pointer}
'''

# README.md
readme = r'''
Sistema Energético - Demo

Estructura creada por bootstrap_create_project.py

Backend (FastAPI): backend/app.py
Frontend (React via CDN): frontend/index.html (servido por FastAPI)

Instalación y ejecución:
1. Ejecuta este script: python bootstrap_create_project.py (ya lo hiciste para crear los archivos)
2. Entra a la carpeta backend:
   cd backend
3. Crea y activa un virtualenv:
   python -m venv .venv
   .\.venv\Scripts\activate
4. Instala dependencias:
   pip install -r requirements.txt
5. Ejecuta el servidor:
   uvicorn app:app --reload --port 8000
6. Abre tu navegador en http://localhost:8000

Notas:
- El backend inicializa una sede/demo con 36 meses de consumos y una curva de carga (valores de ejemplo tomados de los Excel que proporcionaste).
- Para producción se recomienda separar frontend y usar una build con bundler.
- Si deseas que importe los archivos Excel reales (GOR-F-087 y GOR-F-088) puedo añadir una ruta para subir y parsearlos automáticamente.
'''

# perform writes
write(ROOT / 'backend' / 'app.py', backend_app)
write(ROOT / 'backend' / 'requirements.txt', backend_reqs)
write(ROOT / 'frontend' / 'index.html', frontend_index)
write(ROOT / 'frontend' / 'app.jsx', frontend_app)
write(ROOT / 'frontend' / 'styles.css', frontend_css)
write(ROOT / 'README.md', readme)

print('Bootstrap completo. Revisa README.md y sigue los pasos para ejecutar.')
'''

# Now actually write the bootstrap file
write(Path(os.path.join(os.getcwd(), 'bootstrap_create_project.py')), content)

print('He creado el script bootstrap_create_project.py en el directorio del proyecto. Ejecuta python bootstrap_create_project.py para generar el proyecto.')