const ReactHooks = React || window.React;
const useState = ReactHooks.useState;
const useEffect = ReactHooks.useEffect;
const useRef = ReactHooks.useRef;

function formatNumber(n){
  if(n === null || n === undefined || Number.isNaN(Number(n))) return '-';
  return Number(n).toLocaleString('es-CO');
}

function isMobileDevice(){
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

const AUTH_EMAIL = 'ceaienergetico@gmail.com';
const AUTH_PASSWORD = 'Energetico2026';
const SESSION_KEY = 'energia_app_session';
const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutos

const REGIONALES_CENTROS = {
  'San Andrés': ['Centro de Formación Turística, Gente de Mar y de Servicios'],
  'Bolívar': ['Centro Agroempresarial y Minero', 'Centro Internacional Náutico, Fluvial y Portuario', 'Centro para la Industria Petroquímica', 'Centro de Comercio y Servicios'],
  'Sucre': ['Centro de Innovación, la Tecnología y los Servicios'],
  'Córdoba': ['Centro Agropecuario y de Biotecnología El Porvenir', 'Centro de Comercio, Industria y Turismo de Córdoba'],
  'Antioquia': ['Centro de los Recursos Naturales Renovables - La Salada', 'Centro de Diseño y Manufactura del Cuero', 'Centro de Formación en Diseño, Confección y Moda', 'Centro para el Desarrollo del Hábitat y la Construcción', 'Centro Tecnológico de Mobiliario', 'Centro Tecnológico del Mobiliario', 'Centro Textil y de Gestión Industrial', 'Centro de Comercio', 'Centro de Servicios de Salud', 'Centro de Servicios y Gestión Empresarial', 'Complejo Tecnológico para la Gestión Agroempresarial', 'Complejo Tecnológico Minero Agroempresarial', 'Complejo Tecnológico, Industrial, Pecuario y Turístico', 'Complejo Tecnológico, Turismo y Agroindustria del Suroeste', 'Occidente Antioqueño', 'Centro de Formación Minero Ambiental'],
  'Chocó': ['Centro de Recursos Naturales, Industria y Biodiversidad'],
  'Caldas': ['Centro para la Formación Cafetera', 'Centro de Automatización Industrial', 'Centro de Procesos Industriales y Construcción', 'Centro de Comercio y Servicios', 'Centro Pecuario y Agroempresarial'],
  'Risaralda': ['Centro Atención Sector Agropecuario', 'Centro de Diseño e Innovación Tecnológica Industrial', 'Centro de Comercio y Servicios'],
  'Quindío': ['Centro Agroindustrial', 'Centro para el Desarrollo Tecnológico de la Construcción y la Industria', 'Centro de Comercio y Turismo'],
  'Valle del Cauca': ['Centro Agropecuario de Buga', 'Centro Náutico Pesquero de Buenaventura', 'Centro de Electricidad y Automatización Industrial', 'Centro de Construcción', 'Centro de Diseño Tecnológico Industrial', 'Centro Nacional de Asistencia Técnica a la Industria', 'Centro de Gestión Tecnológica de Servicios', 'Centro de Genética y Biotecnología', 'Centro de Biotecnología Industrial', 'Centro de Industria y la Construcción'],
  'Nariño': ['Centro Sur Colombiano de Logística Internacional', 'Centro Agroindustrial y Pesquero del Pacífico', 'Centro Internacional de Producción Limpia - Lope'],
  'Atlántico': ['Centro para el Desarrollo Agroecológico y Agroindustrial', 'Centro Industrial y Comercial', 'Centro Nacional Colombo Alemán', 'Centro de Comercio y Servicios'],
  'La Guajira': ['Centro Industrial y de Energías Alternativas', 'Centro Agroempresarial y Acuícola'],
  'Cesar': ['Centro Biotecnológico del Caribe', 'Centro Agroempresarial', 'Centro de Operación y Mantenimiento Minero'],
  'Norte de Santander': ['Centro de Formación para el Desarrollo Rural y Minero', 'Centro de la Industria, la Empresa y los Servicios'],
  'Santander': ['Centro de Atención al Sector Agropecuario', 'Centro Industrial de Mantenimiento Integral', 'Centro Industrial de Diseño y Manufactura', 'Centro de Servicios Empresariales y Turísticos', 'Centro Industrial de Mantenimiento y Manufactura', 'Centro Agroempresarial y Turístico de los Andes', 'Centro de Gestión Agroempresarial del Oriente', 'Tecnoparque (1)'],
  'Boyacá': ['Centro de Desarrollo Agropecuario y Agroindustrial', 'Centro Minero', 'Centro de Gestión Administrativa y Fortalecimiento Empresarial', 'Centro Industrial de Mantenimiento y Manufactura', 'Centro de Formación Agroindustrial y de Servicios'],
  'Arauca': ['Centro de Gestión y Desarrollo Agroindustrial de Arauca'],
  'Vichada': ['Centro de Producción y Transformación Agroindustrial de la Orinoquía'],
  'Casanare': ['Centro Agroindustrial y Fortalecimiento Empresarial de Casanare'],
  'Guainía': ['Centro Ambiental y Ecoturístico del Nororiente Amazónico'],
  'Meta': ['Centro de Gestión y Desarrollo Sostenible del Meta', 'Centro de Industria y Servicios del Meta'],
  'Guaviare': ['Centro de Desarrollo Agroindustrial, Turístico y Tecnológico del Guaviare'],
  'Vaupés': ['Centro Agropecuario y de Servicios Ambientales - Jirijirimo'],
  'Caquetá': ['Centro Tecnológico de la Amazonia'],
  'Amazonas': ['Centro para la Biodiversidad y el Turismo del Amazonas'],
  'Huila': ['Centro de Formación Agroindustrial', 'Centro de Formación Agroempresarial y Desarrollo Pecuario del Huila', 'Centro de Desarrollo Agroempresarial y Turístico del Huila', 'Centro de la Industria, la Empresa y los Servicios', 'Centro de Gestión y Desarrollo Sostenible Surcolombiano'],
  'Tolima': ['Centro Agropecuario La Granja', 'Centro de la Industria y la Construcción', 'Centro de Comercio y Servicios'],
  'Putumayo': ['Centro Agroforestal y Acuícola Arapaima'],
  'Cauca': ['Centro Agropecuario', 'Centro de Teleinformática y Producción Industrial', 'Centro de Comercio y Servicios'],
  'Cundinamarca': ['Centro Industrial de Desarrollo Empresarial de Soacha', 'Centro de Desarrollo Agroindustrial y Empresarial', 'Centro Agroecológico y Empresarial', 'Centro de la Tecnología de Diseño y la Productividad Empresarial', 'Centro de Biotecnología Agropecuaria', 'Centro de Desarrollo Agroempresarial de Chía'],
  'Distrito Capital': ['Centro de Tecnologías para la Construcción y la Madera', 'Centro de Electricidad, Electrónica y Telecomunicaciones', 'Centro de Gestión Industrial', 'Centro de Manufactura en Textil y Cuero', 'Centro de Tecnologías de las Artes Gráficas', 'Centro Metalmecánico', 'Centro de Materiales y Ensayos', 'Centro de Diseño y Metrología', 'Centro para la Industria de la Comunicación Gráfica', 'Centro de Gestión de Mercados, Logística y Tecnologías de la Información', 'Centro de Formación de Talento Humano en Salud', 'Centro de Formación Administrativa', 'Centro de Servicios Financieros', 'Centro Nacional de Hotelería, Turismo y Alimentos', 'Centro de Formación en Actividad Física y Cultura'],
  'Magdalena': ['Centro Acuícola y Agroindustrial de Gaira', 'Centro de Logística y Promoción Ecoturística del Magdalena'],
};

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
      { title: 'Información del equipo', fields: ['descripcion', 'clasificacion', 'marca', 'modelo', 'fabricante', 'proveedor', 'clasificacion_energetica', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Energía', fields: ['potencia_kw'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Iluminación': {
    sections: [
      { title: 'Tecnología', fields: ['tecnologia'] },
      { title: 'Información del equipo', fields: ['marca', 'modelo', 'fabricante', 'proveedor', 'ano_instalacion'] },
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
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'ano_instalacion'] },
      { title: 'Tecnología', fields: ['tecnologia', 'clasificacion_energetica'] },
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
      { title: 'Gas', fields: ['tipo_combustible', 'capacidad_gas_gr'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
    ],
  },
  'Consumo de Combustible': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo'] },
      { title: 'Consumo', fields: ['tipo_combustible', 'cantidad', 'consumo_combustible_gal'] },
      { title: 'Uso', fields: ['horas_uso_diario', 'dias_uso_mes', 'uso'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Plantas Eléctricas': {
    sections: [
      { title: 'Información del equipo', fields: ['marca', 'modelo', 'cantidad'] },
      { title: 'Técnica', fields: ['potencia_kw', 'tipo_combustible', 'consumo_combustible_gal'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
      { title: 'Observación', fields: ['observaciones'] },
    ],
  },
  'Gasodomésticos': {
    sections: [
      { title: 'Grupo principal', fields: ['grupo_principal'] },
      { title: 'Información del equipo', fields: ['descripcion', 'marca', 'modelo', 'fabricante', 'proveedor', 'ano_instalacion'] },
      { title: 'Valor', fields: ['valor_unitario'] },
      { title: 'Cantidad y uso', fields: ['cantidad', 'horas_uso_diario', 'dias_uso_mes'] },
      { title: 'Gas', fields: ['tipo_combustible', 'consumo_gas_m3'] },
      { title: 'Ubicación y fotos', fields: ['ubicacion', 'evidencias'] },
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
  tecnologia: { label: 'Tecnología', placeholder: 'Ej: Para luminarias: LED, Fluorescente, Halógena. Para refrigeración: Inverter, Convencional, etc.' },
  clasificacion: { label: 'Clasificación', placeholder: 'Ej: Portátil, de escritorio, todo en uno, etc.' },
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

function downloadExcel(items = [], fileName = 'inventario.xlsx'){
  if(typeof XLSX === 'undefined'){
    alert('XLSX no está disponible. Descargando como CSV en su lugar.');
    downloadCsv(items, 'inventario.csv');
    return;
  }
  
  const headers = ['Tipo', 'Regional', 'Centro', 'Sede', 'Descripción', 'Marca', 'Modelo', 'Clasificación Energética', 'Año Instalación', 'Cantidad', 'Potencia (kW)', 'Horas Uso Diario', 'Días Uso Mes', 'Consumo (kWh/mes)', 'Valor Unitario (COP)', 'Valor Total (COP)', 'Grupo Principal', 'Ubicación', 'Uso', 'Tecnología', 'Observaciones'];
  const rows = items.map(item => [
    item.hoja_tipo || '',
    item.regional || '',
    item.centro_formacion || '',
    item.sede_nombre || '',
    item.descripcion || '',
    item.marca || '',
    item.modelo || '',
    item.clasificacion_energetica || '',
    item.ano_instalacion || '',
    item.cantidad || '',
    item.potencia_kw || '',
    item.horas_uso_diario || '',
    item.dias_uso_mes || '',
    item.consumo_mensual_kwh || '',
    item.valor_unitario || '',
    (Number(item.cantidad || 0) * Number(item.valor_unitario || 0)).toFixed(0),
    item.grupo_principal || '',
    item.ubicacion || '',
    item.uso || '',
    item.tecnologia || '',
    item.observaciones || ''
  ]);
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
  XLSX.writeFile(wb, fileName);
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function Header({ user, onLogout, sedes, selectedId, onSelect, activeView, onViewChange }){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header" style={{ background: 'linear-gradient(135deg, #0B7D4B 0%, #1ab66f 100%)', boxShadow: '0 8px 32px rgba(11, 125, 75, 0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isMobileDevice() ? '6px' : '24px', padding: isMobileDevice() ? '8px 10px' : '20px 32px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobileDevice() ? '4px' : '24px', minWidth: 0, flex: 1 }}>
            <img src="https://i.postimg.cc/cHpqyBX5/Logo-sena.jpg" alt="SENA" className="sena-logo-img" style={{ width: isMobileDevice() ? '40px' : '70px', height: isMobileDevice() ? '40px' : '70px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.95)', padding: isMobileDevice() ? '3px' : '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0 }} />
            <div className="brand-text-container" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="brand-text-main" style={{ fontSize: isMobileDevice() ? '12px' : '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px', margin: '0', lineHeight: '1', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}> Aplicativo Revisión</div>
              {!isMobileDevice() && <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: '1'}}> Energética</div>}
              <div className="brand-text-sub" style={{ fontSize: isMobileDevice() ? '7px' : '12px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', margin: '2px 0 0 0', letterSpacing: isMobileDevice() ? '-0.3px' : '0.3px', lineHeight: '1', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}> Laboratorio CEAI</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button 
              className="hamburger-menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', padding: '8px', transition: 'transform 0.3s' }}
              aria-label="Menu"
            >
              ☰
            </button>
            {user && (
              <button className="btn btn-secondary" onClick={onLogout} style={{ padding: '10px 16px', flexShrink: 0 }}>Cerrar sesión</button>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu-open">
          <div style={{ color: '#fff', marginBottom: '16px', fontSize: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            Conectado como <strong style={{ display: 'block', wordBreak: 'break-all', marginTop: '4px' }}>{user?.email || ''}</strong>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>REVISIONES</div>
            {Array.isArray(sedes) && sedes.map(s => (
              <button
                key={s.id}
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  background: selectedId === s.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 12px',
                  textAlign: 'left',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onClick={() => {
                  onSelect(s.id);
                  setMobileMenuOpen(false);
                }}
              >
                <div style={{ marginBottom: '2px' }}>{s.nombre === 'Sede Demo' ? '📋 087' : s.nombre.split(' ')[0]}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{s.nombre === 'Sede Demo' ? 'Usos finales de energía' : s.nombre}</div>
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>HERRAMIENTAS</div>
            <button
              style={{
                display: 'block',
                width: '100%',
                background: activeView === 'revision088' ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '12px 12px',
                textAlign: 'left',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onClick={() => {
                onViewChange('revision088');
                setMobileMenuOpen(false);
              }}
            >
              <div style={{ marginBottom: '2px' }}>⚙️ Revisión 088</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Formulario completo</div>
            </button>
          </div>

          <button className="btn btn-secondary" onClick={onLogout} style={{ width: '100%', padding: '10px 16px' }}>Cerrar sesión</button>
        </div>
      )}
    </>
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
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [filterRegional, setFilterRegional] = useState('');
  const [filterCentro, setFilterCentro] = useState('');
  const [form, setForm] = useState({
    hoja_tipo: selectedTipo,
    regional: '',
    centro_formacion: '',
    sede_nombre: '',
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
      regional: '',
      centro_formacion: '',
      sede_nombre: '',
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
    return inventario.filter(i => {
      const tipoCumple = !selectedTipo || i.hoja_tipo === selectedTipo;
      const regionalCumple = !filterRegional || i.regional === filterRegional;
      const centroCumple = !filterCentro || i.centro_formacion === filterCentro;
      return tipoCumple && regionalCumple && centroCumple;
    });
  }

  function renderField(fieldKey){
    const meta = FIELD_META[fieldKey] || {};
    const value = form[fieldKey] ?? '';

    // Renderizado especial para valor_unitario con formato de moneda en tiempo real
    if(fieldKey === 'valor_unitario'){
      const numericValue = Number(value) || 0;
      const formattedValue = formatNumber(numericValue);
      return (
        <div className="form-group" key={fieldKey}>
          <label>{meta.label} (COP)</label>
          <div style={{position:'relative', display:'flex', alignItems:'center'}}>
            <input
              type={meta.type}
              value={value}
              placeholder={meta.placeholder || ''}
              step={meta.step}
              onChange={e=>updateForm(fieldKey, e.target.value)}
              style={{paddingRight:'80px'}}
            />
            <div style={{position:'absolute', right:'12px', fontSize:'13px', fontWeight:'600', color:'#0B7D4B', pointerEvents:'none', whiteSpace:'nowrap'}}>
              ${formattedValue}
            </div>
          </div>
        </div>
      );
    }

    if(fieldKey === 'evidencias'){
      const isMobile = isMobileDevice();
      return (
        <div className="form-group" key={fieldKey}>
          <label>{meta.label}</label>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <input type="file" accept="image/*" capture="environment" multiple onChange={async e=>{
              const files = Array.from(e.target.files || []);
              if(!files.length) return;
              const dataUrls = await Promise.all(files.map(f=>readImageAsDataUrl(f)));
              updateForm('evidencias', [...(form.evidencias||[]), ...dataUrls]);
            }} />
            <button type="button" className="btn btn-secondary" disabled={!isMobile} title={!isMobile ? 'El botón de cámara solo está disponible en dispositivos móviles (celulares y tablets)' : ''} style={{opacity: !isMobile ? 0.5 : 1, cursor: !isMobile ? 'not-allowed' : 'pointer'}} onClick={()=>{
              if(!isMobile) {
                alert('El botón de cámara solo funciona en dispositivos móviles (celulares, tablets, etc.).\\nEstás usando una computadora, por favor selecciona fotos desde tu dispositivo móvil.');
                return;
              }
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.capture = 'environment';
              input.onchange = async (e) => {
                const files = Array.from(e.target.files || []);
                if(!files.length) return;
                const dataUrls = await Promise.all(files.map(f=>readImageAsDataUrl(f)));
                updateForm('evidencias', [...(form.evidencias||[]), ...dataUrls]);
              };
              input.click();
            }}>📷 Cámara</button>
          </div>
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

      // Ensure all numeric fields are valid numbers
      const numericFields = [
        'cantidad', 'valor_unitario', 'horas_uso_diario', 'dias_uso_mes', 'potencia_kw',
        'capacidad_gas_kg', 'total_gas_kg', 'capacidad_gas_gr', 'consumo_combustible_gal', 'consumo_gas_m3'
      ];

      numericFields.forEach(field => {
        const value = Number(body[field]);
        body[field] = isNaN(value) ? 0 : value;
      });

      body.evidencias = Array.isArray(body.evidencias) ? body.evidencias : [];

      if(body.hoja_tipo === 'Soporte Gases Refrigerantes'){
        // El campo en gramos se almacena como Kg en el backend (capacidad_gas_kg)
        body.capacidad_gas_kg = (Number(body.capacidad_gas_gr) || 0) / 1000;
      }

      // Ensure string fields are not null
      const stringFields = [
        'regional', 'centro_formacion', 'sede_nombre', 'grupo_principal', 'descripcion',
        'marca', 'modelo', 'fabricante', 'proveedor', 'observaciones', 'clasificacion_energetica',
        'clasificacion_equipo', 'tipo_combustible', 'uso', 'ubicacion', 'tecnologia', 'refrigerante'
      ];

      stringFields.forEach(field => {
        body[field] = body[field] || '';
      });

      console.log('DEBUG: Sending body:', body);

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
      if(!res.ok) {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        throw new Error(`Error guardando: ${res.status} ${errorText}`);
      }
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
              <div className="filter-group">
                <label>Regional</label>
                <select value={filterRegional} onChange={e=>{
                  setFilterRegional(e.target.value);
                  setFilterCentro('');
                }}>
                  <option value="">Todas</option>
                  {Object.keys(REGIONALES_CENTROS).sort().map((regional, idx) => (
                    <option key={idx} value={regional}>{regional}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Centro</label>
                <select value={filterCentro} onChange={e=>setFilterCentro(e.target.value)} disabled={!filterRegional}>
                  <option value="">Todos</option>
                  {filterRegional && REGIONALES_CENTROS[filterRegional] && REGIONALES_CENTROS[filterRegional].map((centro, idx) => (
                    <option key={idx} value={centro}>{centro}</option>
                  ))}
                </select>
              </div>
              </div>

              <div className="inventory-actions">
                <button className="btn btn-primary" onClick={()=>{ setShowForm(true); resetForm(); }}>➕ Agregar equipo</button>
                <button className="btn btn-secondary" onClick={()=>downloadExcel(getFilteredInventario(), 'inventario_sena.xlsx')}>📊 Exportar Excel</button>
                <div style={{color:'#555', fontSize:12}}>{getFilteredInventario().length} / {inventario.length} equipos</div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="modal-overlay" onClick={()=>{ setShowForm(false); resetForm(); }}>
              <div className="modal" style={{maxWidth:'950px', maxHeight:'90vh', overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
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

                <div className="form-section">
                  <h4 className="form-section-title">Información de la sede</h4>
                  <div className="form-row">
                    <div className="form-group" style={{flex:1}}>
                      <label>Regional</label>
                      <select value={form.regional || ''} onChange={e => {
                        updateForm('regional', e.target.value);
                        updateForm('centro_formacion', '');
                      }}>
                        <option value="">Seleccionar regional</option>
                        {Object.keys(REGIONALES_CENTROS).sort().map((regional, idx) => (
                          <option key={idx} value={regional}>{regional}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{flex:1}}>
                      <label>Centro de formación</label>
                      <select value={form.centro_formacion || ''} onChange={e => updateForm('centro_formacion', e.target.value)} disabled={!form.regional}>
                        <option value="">Seleccionar centro</option>
                        {form.regional && REGIONALES_CENTROS[form.regional] && REGIONALES_CENTROS[form.regional].map((centro, idx) => (
                          <option key={idx} value={centro}>{centro}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{flex:1}}>
                      <label>Sede</label>
                      <input type="text" placeholder="Ej: Sede principal, Sede Bogotá" value={form.sede_nombre || ''} onChange={e => updateForm('sede_nombre', e.target.value)} />
                    </div>
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
            <div className="modal" style={{maxWidth:'900px', maxHeight:'90vh', overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
              <h2>👁️ Detalles del Equipo</h2>

              <div className="form-section">
                <h4>Información de la Sede</h4>
                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Regional</label>
                    <div className="view-field">{viewItem.regional || '—'}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Centro de formación</label>
                    <div className="view-field">{viewItem.centro_formacion || '—'}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Sede</label>
                    <div className="view-field">{viewItem.sede_nombre || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Información del Equipo</h4>
                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Tipo</label>
                    <div className="view-field">{viewItem.hoja_tipo}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Descripción</label>
                    <div className="view-field">{viewItem.descripcion}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Marca</label>
                    <div className="view-field">{viewItem.marca || '—'}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Modelo</label>
                    <div className="view-field">{viewItem.modelo || '—'}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Grupo Principal</label>
                    <div className="view-field">{viewItem.grupo_principal || '—'}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Ubicación</label>
                    <div className="view-field">{viewItem.ubicacion || '—'}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Cantidad</label>
                    <div className="view-field">{viewItem.cantidad || '—'}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Potencia (kW)</label>
                    <div className="view-field">{viewItem.potencia_kw || '—'}</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{flex:1}}>
                    <label>Consumo mensual (kWh)</label>
                    <div className="view-field">{formatNumber(viewItem.consumo_mensual_kwh)}</div>
                  </div>
                  <div className="form-group" style={{flex:1}}>
                    <label>Valor Unitario</label>
                    <div className="view-field" style={{fontSize:'16px', fontWeight:'600', color:'#0B7D4B'}}>${formatNumber(viewItem.valor_unitario)} COP</div>
                  </div>
                </div>

                {viewItem.observaciones && (
                  <div className="form-row">
                    <div className="form-group" style={{flex:1}}>
                      <label>Observaciones</label>
                      <div className="view-field">{viewItem.observaciones}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h4>Evidencia Fotográfica</h4>
                {Array.isArray(viewItem.evidencias) && viewItem.evidencias.length ? (
                  <div className="evidencias-preview-detail" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:12}}>
                    {viewItem.evidencias.map((img, idx)=>(
                      <div key={idx} className="thumb-detail" style={{cursor:'pointer', position:'relative', borderRadius:8, overflow:'hidden'}} onClick={()=>setFullscreenImage(img)} title="Presiona para ver en pantalla completa">
                        <img src={img} alt={`Evidencia ${idx+1}`} style={{width:'100%', height:'150px', objectFit:'cover', borderRadius:8}} />
                        <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, opacity:0, transition:'opacity 0.3s', hover:{opacity:1}}} className="zoom-indicator">🔍</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="view-field">No hay fotos</div>
                )}
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={()=>setViewItem(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {fullscreenImage && (
          <div className="modal-overlay" onClick={()=>setFullscreenImage(null)} style={{background:'rgba(0,0,0,0.95)', zIndex:2000}}>
            <div style={{position:'relative', width:'90vw', height:'90vh', display:'flex', alignItems:'center', justifyContent:'center'}} onClick={e=>e.stopPropagation()}>
              <button className="btn btn-secondary" onClick={()=>setFullscreenImage(null)} style={{position:'absolute', top:20, right:20, zIndex:2001, padding:'10px 16px', fontSize:14}}>✕ Cerrar</button>
              <img src={fullscreenImage} alt="Foto ampliada" style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:12}} />
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
      <Header user={user} onLogout={() => logout(false)} sedes={sedes} selectedId={sede?.id} onSelect={handleSelect} activeView={activeView} onViewChange={setActiveView} />
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
