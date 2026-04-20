const ReactHooks = React || window.React;
const useState = ReactHooks.useState;
const useEffect = ReactHooks.useEffect;
const useRef = ReactHooks.useRef;

function formatNumber(n){
  if(n === null || n === undefined || Number.isNaN(Number(n))) return '-';
  return Number(n).toLocaleString('es-CO');
}

const AUTH_EMAIL = 'ceaienergetico@gmail.com';
const AUTH_PASSWORD = 'Energetico2026';
const SESSION_KEY = 'energia_app_session';
const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutos

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin(email.trim(), password)) return;
    setError('Correo o contraseña incorrectos. Intenta de nuevo.');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">⚡</div>
          <div>
            <h1>Ingreso Revisión Energética</h1>
            <p>Accede al sistema con el correo institucional y contraseña segura.</p>
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Example@gmail.com"
            required
          />
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Example123"
            required
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

const INVENTORY_TYPES = [
  { key: 'Equipos y Maquinaria Industrial', label: '⚙️ Equipos y Maquinaria Industrial' },
  { key: 'Servicios TIC', label: '🖥️ Servicios TIC' },
  { key: 'Ofimática', label: '🖨️ Ofimática' },
  { key: 'Equipos de Refrigeración', label: '❄️ Equipos de Refrigeración' },
  { key: 'Soporte Gases Refrigerantes', label: '🧊 Soporte Gases Refrigerantes' },
  { key: 'Iluminación', label: '💡 Iluminación' },
  { key: 'Consumo de Combustible', label: '⛽ Consumo de Combustible' },
  { key: 'Plantas Eléctricas', label: '⚡ Plantas Eléctricas' },
  { key: 'Gasodomésticos', label: '🔥 Gasodomésticos' },
];

const FORM_SCHEMAS = {
  'Servicios TIC': {
    sections: [
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'clasificacion_energetica', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Ofimática': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'clasificacion_energetica', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Iluminación': {
    sections: [
      { title: 'Información del equipo', fields: ['tecnologia', 'marca', 'modelo', 'fabricante', 'proveedor', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Equipos y Maquinaria Industrial': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'clasificacion_energetica', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Equipos de Refrigeración': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'tecnologia', 'marca', 'modelo', 'fabricante', 'proveedor', 'clasificacion_energetica', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Gas refrigerante', fields: ['refrigerante', 'capacidad_gas_kg', 'total_gas_kg'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Soporte Gases Refrigerantes': {
    sections: [
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Gas', fields: ['tipo_combustible', 'capacidad_gas_gr'] },
    ],
  },
  'Consumo de Combustible': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo'] },
      { title: 'Consumo', fields: ['tipo_combustible', 'cantidad', 'consumo_combustible_gal'] },
      { title: 'Uso', fields: ['horas_uso_diario', 'dias_uso_mes', 'uso'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Plantas Eléctricas': {
    sections: [
      { title: 'Información del equipo', fields: ['marca', 'modelo', 'cantidad'] },
      { title: 'Técnica', fields: ['potencia_kw', 'tipo_combustible', 'consumo_combustible_gal'] },
      { title: 'Observación', fields: ['observaciones', 'ubicacion'] },
    ],
  },
  'Gasodomésticos': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Gas', fields: ['tipo_combustible', 'consumo_gas_m3'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
};

const FIELD_META = {
  hoja_tipo: { label: 'Categoría / Hoja' },
  grupo_principal: { label: 'Grupo principal', placeholder: 'Ej: Equipos de TIC, Maquinaria industrial, Climatización, etc.' },
  descripcion: { label: 'Descripción del elemento', placeholder: 'Ej: UPS, router, servidor, compresor, etc.' },
  marca: { label: 'Marca', placeholder: 'Ej: Dell, HP, Schneider, ABB, etc.' },
  modelo: { label: 'Modelo', placeholder: 'Ej: ThinkCentre M90, ProDesk 600, SCL-500, etc.' },
  fabricante: { label: 'Fabricante', placeholder: 'Ej: Dell, HP, Siemens, Eaton, etc.' },
  proveedor: { label: 'Proveedor', placeholder: 'Ej: Distribuidor local, OEM, Almacén XYZ, etc.' },
  clasificacion_energetica: { label: 'Clasificación energética según estándar RETIQ', placeholder: 'Ej: A, A+, B, etc.' },
  ano_instalacion: { label: 'Año de instalación en la sede', type: 'number', placeholder: '2023' },
  cantidad: { label: 'Cantidad', type: 'number', placeholder: '1' },
  horas_uso_diario: { label: 'Cantidad de horas de uso estimadas diaria', type: 'number', step: 0.5, placeholder: '8' },
  dias_uso_mes: { label: 'Cantidad de días de uso al mes', type: 'number', step: 1, placeholder: '20' },
  potencia_kw: { label: 'Potencia de un equipo kW', type: 'number', step: 0.01, placeholder: '2.5' },
  valor_unitario: { label: 'Valor Unitario', type: 'number', step: 100, placeholder: '1500000' },
  tipo_combustible: { label: 'Tipo de combustible / gas', placeholder: 'Ej: Gasolina, Diesel, Gas natural, GLP, etc.' },
  refrigerante: { label: 'Refrigerante', placeholder: 'Ej: R-410A, R-22, R-404A, etc.' },
  capacidad_gas_kg: { label: 'Capacidad del gas en Kg', type: 'number', step: 0.01, placeholder: '5' },
  total_gas_kg: { label: 'Total gas refrigerante en Kg', type: 'number', step: 0.01, placeholder: '10' },
  capacidad_gas_gr: { label: 'Cantidad de refrigerante en gr', type: 'number', step: 1, placeholder: '500' },
  consumo_combustible_gal: { label: 'Consumo combustible mes galones', type: 'number', step: 0.1, placeholder: '50' },
  consumo_gas_m3: { label: 'Consumo total de gas mes m3', type: 'number', step: 0.1, placeholder: '100' },
  ubicacion: { label: 'Ubicación', type: 'text', placeholder: 'Ej: Sala de servidores, Oficina 101, Planta 2, etc.' },
  uso: { label: 'Uso', type: 'text', placeholder: 'Ej: Almacenamiento de datos, Oficina, Producción, Refrigeración, etc.' },
  observaciones: { label: 'Observación', type: 'textarea', placeholder: 'Ej: Equipo en buen estado, requiere mantenimiento mensual, etc.' },
  evidencias: { label: 'Evidencia fotográfica', type: 'files' },
};

function downloadCsv(items = [], fileName = 'inventario.csv'){
  const headers = [
    'Tipo', 'Descripción', 'Marca', 'Modelo', 'Cantidad', 'Potencia (kW)', 'Consumo (kWh/mes)', 'Ubicación', 'Observaciones', 'Evidencias'
  ];
  const rows = items.map(item => [
    item.hoja_tipo,
    item.descripcion,
    item.marca,
    item.modelo,
    item.cantidad,
    item.potencia_kw,
    item.consumo_mensual_kwh,
    item.ubicacion,
    item.observaciones,
    Array.isArray(item.evidencias) ? item.evidencias.join(' | ') : ''
  ]);
  const csvContent = [headers, ...rows].map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function Header({ user, onLogout }){
  return (
    <header className="header" style={{ background: 'linear-gradient(135deg, #0B7D4B 0%, #1ab66f 100%)', boxShadow: '0 8px 32px rgba(11, 125, 75, 0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px 32px' }}>
        <img src="https://i.postimg.cc/cHpqyBX5/Logo-sena.jpg" alt="SENA" className="sena-logo-img" style={{ width: '70px', height: '70px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
        <div className="brand-text-container" style={{ flex: 1 }}>
          <div className="brand-text-main" style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', margin: '0 0 4px 0' }}> Aplicativo Revisión Energética</div>
          <div className="brand-text-sub" style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', margin: 0, letterSpacing: '0.5px' }}> Laboratorio de Servicios Tecnológicos CEAI</div>
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>Conectado como <strong>{user.email}</strong></div>
            <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '10px 16px' }}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  )
}

function Sidebar({sedes, selectedId, onSelect, activeView, onViewChange}){
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">REVISIONES</div>
        <ul className="sidebar-list">
          {Array.isArray(sedes) && sedes.map(s => (
            <li key={s.id}>
              <button
                className={`sidebar-item ${selectedId===s.id ? 'active' : ''}`}
                onClick={()=>onSelect(s.id)}
              >
                <div className="sidebar-item-icon">📋</div>
                <div className="sidebar-item-content">
                  <div className="sidebar-item-title">{s.nombre === 'Sede Demo' ? '087' : s.nombre.split(' ')[0]}</div>
                  <div className="sidebar-item-subtitle">{s.nombre === 'Sede Demo' ? 'Usos finales de energía' : s.nombre}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section sidebar-section-tools">
        <div className="sidebar-section-title">HERRAMIENTAS</div>
        <button
          className={`sidebar-item sidebar-item-tool ${activeView === 'revision088' ? 'active' : ''}`}
          onClick={()=>onViewChange('revision088')}
        >
          <div className="sidebar-item-icon">⚙️</div>
          <div className="sidebar-item-content">
            <div className="sidebar-item-title">Revisión 088</div>
            <div className="sidebar-item-subtitle">Formulario completo</div>
          </div>
        </button>
      </div>
    </aside>
  )
}

function InfoCard({title, value, small}){
  return (
    <div className="info-card">
      <div className="info-title">{title}</div>
      <div className="info-value">{value}</div>
      {small && <div className="info-small">{small}</div>}
    </div>
  )
}

function CurvaChart({data}){
  const chartRef = React.useRef(null);
  
  useEffect(()=>{
    if(typeof Chart === 'undefined') return;
    if(!data || !data.length) return;
    const el = document.getElementById('curvaChart');
    if(!el) return;
    try{
      if(chartRef.current) chartRef.current.destroy();
      const ctx = el.getContext('2d');
      const labels = data.map(d=>d.hora);
      const values = data.map(d=>d.potencia_kw);
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Potencia (kW)', data: values, borderColor: '#0b74de', backgroundColor: 'rgba(11,116,222,0.08)', tension: 0.25, fill: true }]},
        options: { responsive: true, plugins:{legend:{display:false}}, scales:{y:{title:{display:true,text:'kW'}}} }
      });
    }catch(e){
      console.error('Error creando CurvaChart', e);
    }
    return ()=>{ if(chartRef.current) chartRef.current.destroy(); };
  }, [data]);

  return <canvas id="curvaChart" height="150"></canvas>
}

function MatrizChart({data}){
  const chartRef = React.useRef(null);
  
  useEffect(()=>{
    if(typeof Chart === 'undefined') return;
    if(!data || !data.length) return;
    const el = document.getElementById('matrizChart');
    if(!el) return;
    try{
      if(chartRef.current) chartRef.current.destroy();
      const ctx = el.getContext('2d');
      const labels = data.map(d=>d.fecha);
      const values = data.map(d=>d.energia_kwh);
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Energía (kWh)', data: values, backgroundColor: '#ff9f1c' }]},
        options: { responsive: true, plugins:{legend:{display:false}}, scales:{x:{ticks:{maxRotation:90,minRotation:45}}, y:{title:{display:true,text:'kWh'}}} }
      });
    }catch(e){
      console.error('Error creando MatrizChart', e);
    }
    return ()=>{ if(chartRef.current) chartRef.current.destroy(); };
  }, [data]);

  return <canvas id="matrizChart" height="150"></canvas>
}

function Detail({sede, onReload}){
  if(!sede) return <div className="empty">📍 Selecciona una sede para ver detalles.</div>
  const consumos = Array.isArray(sede.consumos_36m) ? sede.consumos_36m : [];
  const curva = Array.isArray(sede.curva_carga) ? sede.curva_carga : [];
  const inventario = Array.isArray(sede.inventario) ? sede.inventario : [];
  const oportunidades = Array.isArray(sede.oportunidades) ? sede.oportunidades : [];
  const [consolidado, setConsolidado] = useState(null);

  useEffect(()=>{
    if(!sede?.id) return;
    fetch(`/api/sedes/${sede.id}/consolidado`)
      .then(r=> r.ok ? r.json() : Promise.reject())
      .then(data=> setConsolidado(data))
      .catch(()=> setConsolidado(null));
  }, [sede?.id]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(INVENTORY_TYPES[0]?.key || '');
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({
    hoja_tipo: selectedTipo,
    grupo_principal: '',
    descripcion: '',
    marca: '',
    modelo: '',
    fabricante: '',
    proveedor: '',
    ano_instalacion: '',
    observaciones: '',
    valor_unitario: '',
    cantidad: '',
    horas_uso_diario: '',
    dias_uso_mes: '',
    potencia_kw: '',
    ubicacion: '',
    tipo_combustible: '',
    refrigerante: '',
    capacidad_gas_kg: '',
    total_gas_kg: '',
    capacidad_gas_gr: '',
    consumo_combustible_gal: '',
    consumo_gas_m3: '',
    uso: '',
    evidencias: [],
  });

  function resetForm(){
    setForm({
      hoja_tipo: selectedTipo || INVENTORY_TYPES[0]?.key || '',
      grupo_principal: '',
      descripcion: '',
      marca: '',
      modelo: '',
      fabricante: '',
      proveedor: '',
      ano_instalacion: '',
      observaciones: '',
      valor_unitario: '',
      cantidad: '',
      horas_uso_diario: '',
      dias_uso_mes: '',
      potencia_kw: '',
      ubicacion: '',
      tipo_combustible: '',
      refrigerante: '',
      capacidad_gas_kg: '',
      total_gas_kg: '',
      capacidad_gas_gr: '',
      consumo_combustible_gal: '',
      consumo_gas_m3: '',
      uso: '',
      evidencias: [],
    });
    setEditingId(null);
  }

  function startEdit(item){
    setForm({
      ...item,
      evidencias: Array.isArray(item.evidencias) ? item.evidencias : [],
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function updateForm(field, value){
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function computeCalculated(){
    const cantidad = Number(form.cantidad) || 0;
    const valor_unitario = Number(form.valor_unitario) || 0;
    const horas_uso_diario = Number(form.horas_uso_diario) || 0;
    const dias_uso_mes = Number(form.dias_uso_mes) || 0;
    const potencia_kw = Number(form.potencia_kw) || 0;
    const capacidad_gas_gr = Number(form.capacidad_gas_gr) || 0;

    const valor_total = cantidad * valor_unitario;
    const horas_uso_mes = horas_uso_diario * dias_uso_mes;
    const potencia_total_kw = cantidad * potencia_kw;
    const consumo_mensual_kwh = potencia_total_kw * horas_uso_mes;
    const calculo_gas_kg = capacidad_gas_gr / 1000;

    return { valor_total, horas_uso_mes, potencia_total_kw, consumo_mensual_kwh, calculo_gas_kg };
  }

  const { valor_total, horas_uso_mes, potencia_total_kw, consumo_mensual_kwh, calculo_gas_kg } = computeCalculated();

  function getFilteredInventario(){
    return inventario.filter(i => !selectedTipo || i.hoja_tipo === selectedTipo);
  }

  function renderField(fieldKey){
    const meta = FIELD_META[fieldKey] || {};
    const value = form[fieldKey] ?? '';

    if(fieldKey === 'evidencias'){
      return (
        <div className="form-group" key={fieldKey}>
          <label>{meta.label}</label>
          <input type="file" accept="image/*" capture="environment" multiple onChange={async e=>{
            const files = Array.from(e.target.files || []);
            if(!files.length) return;
            const dataUrls = await Promise.all(files.map(f=>readImageAsDataUrl(f)));
            updateForm('evidencias', [...(form.evidencias||[]), ...dataUrls]);
          }} />
          {Array.isArray(form.evidencias) && form.evidencias.length > 0 && (
            <div className="evidencias-preview">
              {form.evidencias.map((img, idx)=>(
                <div key={idx} className="thumb">
                  <img src={img} alt={`Evidencia ${idx+1}`} />
                  <button type="button" className="btn btn-secondary" onClick={()=>{
                    updateForm('evidencias', form.evidencias.filter((_,i)=>i!==idx));
                  }}>Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if(meta.type === 'textarea'){
      return (
        <div className="form-group" key={fieldKey}>
          <label>{meta.label}</label>
          <textarea rows={3} value={value} onChange={e=>updateForm(fieldKey, e.target.value)} placeholder={meta.placeholder || ''} />
        </div>
      );
    }

    const type = meta.type || 'text';
    return (
      <div className="form-group" key={fieldKey}>
        <label>{meta.label}</label>
        <input
          type={type}
          value={value}
          placeholder={meta.placeholder || ''}
          step={meta.step}
          onChange={e=>updateForm(fieldKey, e.target.value)}
        />
      </div>
    );
  }

  async function deleteItem(id){
    if(!confirm('¿Está seguro que desea eliminar este equipo?')) return;
    try{
      const res = await fetch(`/api/inventario/${id}`, {method:'DELETE'});
      if(!res.ok) throw new Error('Error eliminando');
      onReload && onReload(sede.id);
    }catch(e){
      console.error(e);
      alert('No se pudo eliminar el equipo');
    }
  }
  
  useEffect(()=>{
    if(!editingId){
      setForm(prev => ({ ...prev, hoja_tipo: selectedTipo }));
    }
  }, [selectedTipo]);

  async function saveItem(){
    try{
      const body = { ...form };
      body.hoja_tipo = body.hoja_tipo || selectedTipo;
      body.cantidad = Number(body.cantidad) || 0;
      body.valor_unitario = Number(body.valor_unitario) || 0;
      body.horas_uso_diario = Number(body.horas_uso_diario) || 0;
      body.dias_uso_mes = Number(body.dias_uso_mes) || 0;
      body.potencia_kw = Number(body.potencia_kw) || 0;
      body.capacidad_gas_kg = Number(body.capacidad_gas_kg) || 0;
      body.total_gas_kg = Number(body.total_gas_kg) || 0;
      body.capacidad_gas_gr = Number(body.capacidad_gas_gr) || 0;
      body.consumo_combustible_gal = Number(body.consumo_combustible_gal) || 0;
      body.consumo_gas_m3 = Number(body.consumo_gas_m3) || 0;
      body.evidencias = Array.isArray(body.evidencias) ? body.evidencias : [];

      if(body.hoja_tipo === 'Soporte Gases Refrigerantes'){
        // El campo en gramos se almacena como Kg en el backend (capacidad_gas_kg)
        body.capacidad_gas_kg = (Number(body.capacidad_gas_gr) || 0) / 1000;
      }
      
      let url, method;
      if(editingId){
        url = `/api/inventario/${editingId}`;
        method = 'PUT';
      } else {
        url = `/api/sedes/${sede.id}/inventario`;
        method = 'POST';
      }
      
      const res = await fetch(url, {
        method,
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
      if(!res.ok) throw new Error('Error guardando');
      setShowForm(false);
      resetForm();
      onReload && onReload(sede.id);
    }catch(e){
      console.error(e);
      alert('No se pudo guardar el equipo. Revisa la consola.');
    }
  }

  const total_kwh = consumos.reduce((a,b)=>a + (Number(b.energia_kwh) || 0), 0);
  const promedio = Math.round(total_kwh / (consumos.length || 1));

  return (
    <div className="detail">
      {consolidado && (
        <section className="card">
          <h3>Consolidado energético (mensual)</h3>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <div style={{flex:'1 1 220px',padding:12,border:'1px solid rgba(3,54,110,0.12)',borderRadius:8,background:'#fff'}}>
              <div style={{fontSize:12,color:'#556'}}>Consumo total (kWh)</div>
              <div style={{fontSize:20,fontWeight:700,color:'#03366e'}}>{formatNumber(consolidado.total_consumo_kwh)}</div>
            </div>
            <div style={{flex:'1 1 220px',padding:12,border:'1px solid rgba(3,54,110,0.12)',borderRadius:8,background:'#fff'}}>
              <div style={{fontSize:12,color:'#556'}}>Categorías</div>
              <ul style={{margin:0,padding:'0 0 0 16px',fontSize:12}}>
                {Array.isArray(consolidado.por_categoria) && consolidado.por_categoria.map((c, idx)=>(
                  <li key={idx}>{c.categoria}: {formatNumber(c.consumo_kwh)} kWh</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <div className="inventory-header">
          <div>
            <h3>📦 Inventario de Equipos</h3>
            <div className="inventory-filters">
              <div className="filter-group">
                <label>Tipo</label>
                <select value={selectedTipo} onChange={e=>setSelectedTipo(e.target.value)}>
                  <option value="">Todas</option>
                  {INVENTORY_TYPES.map(t=> <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              </div>

              <div className="inventory-actions">
                <button className="btn btn-primary" onClick={()=>{ setShowForm(true); resetForm(); }}>➕ Agregar equipo</button>
                <div style={{color:'#555', fontSize:12}}>{inventario.length} equipos</div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="modal-overlay" onClick={()=>{ setShowForm(false); resetForm(); }}>
              <div className="modal" onClick={e=>e.stopPropagation()}>
                <h2>{editingId ? '✏️ Editar Equipo' : '➕ Registrar Nuevo Equipo'}</h2>

                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Categoría / Hoja *</label>
                    <select value={form.hoja_tipo} onChange={e=>updateForm('hoja_tipo', e.target.value)}>
                      <option value="">-- Seleccionar --</option>
                      {INVENTORY_TYPES.map(t=>(
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  const schema = FORM_SCHEMAS[form.hoja_tipo] || FORM_SCHEMAS[selectedTipo];
                  if(!schema) return <div className="empty">Selecciona un tipo de formulario para ver los campos disponibles.</div>;
                  return schema.sections.map(section => (
                    <div key={section.title} className="form-section">
                      <h4 className="form-section-title">{section.title}</h4>
                      <div className="form-row">
                        {section.fields.map(renderField)}
                      </div>
                    </div>
                  ));
                })()}

                <div className="computed-box">
                  <strong>📊 Valores Calculados</strong>
                  <div className="computed-grid">
                    <div><strong>Valor Total:</strong> {formatNumber(valor_total)} COP</div>
                    <div><strong>Horas de uso estimadas al mes:</strong> {formatNumber(horas_uso_mes)} h</div>
                    <div><strong>Potencia total kW:</strong> {formatNumber(potencia_total_kw)} kW</div>
                    <div><strong>Consumo energía estimado mensual kWh:</strong> {formatNumber(consumo_mensual_kwh)} kWh</div>
                    {form.hoja_tipo === 'Soporte Gases Refrigerantes' && (
                      <div><strong>Cálculo en Kg:</strong> {formatNumber(calculo_gas_kg)} kg</div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={()=>{ setShowForm(false); resetForm(); }}>Cancelar</button>
                  <button className="btn btn-primary" onClick={saveItem}>Guardar</button>
                </div>
              </div>
            </div>
          )}

        {viewItem && (
          <div className="modal-overlay" onClick={()=>setViewItem(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <h2>👁️ Detalles del Equipo</h2>
              <div className="form-row" style={{gap:16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Tipo</label>
                  <div className="view-field">{viewItem.hoja_tipo}</div>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Descripción</label>
                  <div className="view-field">{viewItem.descripcion}</div>
                </div>
              </div>

              <div className="form-row" style={{gap:16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Marca</label>
                  <div className="view-field">{viewItem.marca || '—'}</div>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Modelo</label>
                  <div className="view-field">{viewItem.modelo || '—'}</div>
                </div>
              </div>

              <div className="form-row" style={{gap:16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Grupo</label>
                  <div className="view-field">{viewItem.grupo_principal || '—'}</div>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Ubicación</label>
                  <div className="view-field">{viewItem.ubicacion || '—'}</div>
                </div>
              </div>

              <div className="form-row" style={{gap:16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Cantidad</label>
                  <div className="view-field">{viewItem.cantidad}</div>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Potencia (kW)</label>
                  <div className="view-field">{viewItem.potencia_kw}</div>
                </div>
              </div>

              <div className="form-row" style={{gap:16}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Consumo mensual (kWh)</label>
                  <div className="view-field">{formatNumber(viewItem.consumo_mensual_kwh)}</div>
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Fotos</label>
                  {Array.isArray(viewItem.evidencias) && viewItem.evidencias.length ? (
                    <div className="evidencias-preview">
                      {viewItem.evidencias.map((img, idx)=>(
                        <div className="thumb" key={idx}>
                          <img src={img} alt={`Evidencia ${idx+1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="view-field">No hay fotos</div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={()=>setViewItem(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Grupo</th>
                <th>Fotos</th>
                <th>Cantidad</th>
                <th>Potencia (kW)</th>
                <th>Consumo (kWh/mes)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredInventario().map((i, idx)=> (
                <tr key={idx}>
                  <td>{i.hoja_tipo}</td>
                  <td>
                    <strong>{i.descripcion}</strong>
                  </td>
                  <td style={{fontSize:12,color:'#666'}}>{i.grupo_principal || '—'}</td>
                  <td style={{width:72}}>
                    {Array.isArray(i.evidencias) && i.evidencias[0] ? (
                      <img src={i.evidencias[0]} alt="Evidencia" style={{width:50,height:50,objectFit:'cover',borderRadius:10}} />
                    ) : (
                      <span style={{opacity:0.7,fontSize:12}}>—</span>
                    )}
                  </td>
                  <td style={{textAlign:'center'}}>{i.cantidad}</td>
                  <td style={{textAlign:'center'}}>{i.potencia_kw}</td>
                  <td style={{textAlign:'center',fontWeight:600,color:'#0B7D4B'}}>{formatNumber(i.consumo_mensual_kwh)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-secondary" onClick={()=>setViewItem(i)}>👁️ Ver</button>
                      <button className="btn-edit" onClick={()=>startEdit(i)}>✏️ Editar</button>
                      <button className="btn-delete" onClick={()=>deleteItem(i.id)}>🗑️ Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!getFilteredInventario().length && <div className="empty" style={{marginTop:16}}>No hay equipos registrados para este tipo. ¡Agrega uno!</div>}
        </div>
      </section>

      <section className="card">
        <h3>⚡ Consolidado Energético Mensual</h3>
        {consolidado ? (
          <div>
            <div className="consolidado-box">
              <div className="consolidado-title">📊 Consumo Total Mensual</div>
              <div className="consolidado-value">{formatNumber(consolidado.total_consumo_kwh)}</div>
              <div className="consolidado-unit">kWh</div>
            </div>
            
            <div className="consolidado-grid">
              {consolidado.por_categoria?.map((cat, idx)=> (
                <div key={idx} className="consolidado-item">
                  <div className="consolidado-item-label">{cat.categoria}</div>
                  <div className="consolidado-item-value">{formatNumber(cat.consumo_kwh)} kWh</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty">⏳ Cargando consolidado energético...</div>
        )}
      </section>

    </div>
  )
}

function App(){
  const [user, setUser] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('detail'); // 'detail' o 'revision088'
  const inactivityTimer = useRef(null);

  const saveSession = (lastActive = Date.now()) => {
    const payload = { email: AUTH_EMAIL, lastActive };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  };

  const logout = (silent = false) => {
    clearSession();
    if (!silent) alert('Tu sesión ha terminado. Ingresa nuevamente.');
  };

  const resetInactivityTimer = () => {
    if (!user) return;
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => logout(true), INACTIVITY_MS);
    saveSession(Date.now());
  };

  const handleActivity = () => {
    if (!user) return;
    resetInactivityTimer();
  };

  const login = (email, password) => {
    if (email.toLowerCase() === AUTH_EMAIL && password === AUTH_PASSWORD) {
      setUser({ email: AUTH_EMAIL });
      resetInactivityTimer();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.email === AUTH_EMAIL && Date.now() - parsed.lastActive < INACTIVITY_MS) {
          setUser({ email: AUTH_EMAIL });
          resetInactivityTimer();
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const events = ['mousemove','keydown','click','touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    return () => events.forEach(event => window.removeEventListener(event, handleActivity));
  }, [user]);

  useEffect(()=>{
    if(!user) return;
    fetch('/api/sedes')
      .then(r=>{
        if(!r.ok) throw new Error('Error al listar sedes');
        return r.json();
      })
      .then(data=>{
        setSedes(Array.isArray(data)?data:[]);
      })
      .catch(err=>{
        console.error(err);
        setError('No se pudieron cargar las sedes');
      });
  },[user]);

  // auto select first sede cuando sedes carguen
  useEffect(()=>{
    if(user && sedes && sedes.length > 0 && !sede){
      handleSelect(sedes[0].id);
    }
  }, [sedes, user]);

  function handleSelect(id){
    setActiveView('detail'); // Volver a vista detail cuando se selecciona sede
    fetch(`/api/sedes/${id}`)
      .then(r=>{
        if(!r.ok) throw new Error('Sede no encontrada');
        return r.json();
      })
      .then(data=>{
        setSede(data);
      })
      .catch(err=>{
        console.error(err);
        setError('No se pudo cargar la sede seleccionada');
      });
  }

  if(!user){
    return <Login onLogin={login} />;
  }

  return (
    <div className="app">
      <Header user={user} onLogout={() => logout(false)} />
      <div className="main">
        <Sidebar sedes={sedes} selectedId={sede?.id} sede={sede} onSelect={handleSelect} activeView={activeView} onViewChange={setActiveView} />
        <div className="content">
          {error && <div className="card" style={{background:'#fff3f3', borderLeft:'4px solid #d32f2f', color:'#7a1616'}}>⚠️ {error}</div>}
          {activeView === 'detail' && <Detail sede={sede} onReload={handleSelect} />}
          {activeView === 'revision088' && <RevisionEnergetica088 sede={sede} onBack={() => setActiveView('detail')} />}
        </div>
      </div>
      <footer className="footer">
        🌱 Sistema Energético - SENA Cali · Formato GOR-F-087 - Auditoría de Energía
      </footer>
    </div>
  )
}

// Render with React 18 createRoot, fallback to ReactDOM.render
try{
  if(typeof ReactDOM.createRoot === 'function'){
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
  } else if(typeof ReactDOM.render === 'function'){
    ReactDOM.render(<App/>, document.getElementById('root'));
  } else {
    console.error('ReactDOM no tiene métodos de render válidos');
  }
}catch(e){
  console.error('Error montando aplicación React', e);
}
