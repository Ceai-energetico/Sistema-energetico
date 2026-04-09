const ReactHooks = React || window.React;
const { useState, useEffect, useRef } = ReactHooks;

const semana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo','Festivo'];
const regimenSlots = ['00:00-02:00','02:01-04:00','04:01-06:00','06:01-08:00','08:01-10:00','10:01-12:00','12:01-14:00','14:01-16:00','16:01-18:00','18:01-20:00','20:01-22:00','22:01-24:00'];

function safeJsonParse(raw, fallback) {
  if (raw === null || raw === undefined || raw === '') return fallback;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function defaultMatrizRow() {
  return { fecha:'', electrica_kwh:0, electrica_cop:0, gas_m3:0, gas_cop:0, acpm_gal:0, acpm_cop:0, gasolina_gal:0, gasolina_cop:0 };
}

function defaultUsoRow() {
  return { descripcion:'', consumo:0, participacion:0 };
}

function defaultCaracterizacionRow() {
  return { equipo:'', descripcion:'', consumo:'', notas:'' };
}

function downloadExcelFile(workbook, fileName) {
  if (typeof XLSX === 'undefined') {
    alert('La librería de Excel no está cargada. Recarga la página.');
    return;
  }
  XLSX.writeFile(workbook, fileName);
}

function buildSheetFromRows(rows) {
  return XLSX.utils.aoa_to_sheet(rows);
}

function createExcelWorkbook(revision) {
  const regimen = safeJsonParse(revision?.regimen_trabajo, {});
  const matriz = safeJsonParse(revision?.matriz_energetica, []);
  const usosElectrica = safeJsonParse(revision?.usos_energia_electrica, []);
  const usosGas = safeJsonParse(revision?.usos_gas_natural, []);
  const usosAcp = safeJsonParse(revision?.usos_acpm, []);
  const usosGasolina = safeJsonParse(revision?.usos_gasolina, []);
  const caracterizacion = safeJsonParse(revision?.caracterizacion_usos, []);

  const generalRows = [
    ['Campo', 'Valor'],
    ['Fecha', revision?.fecha || ''],
    ['Regional', revision?.regional || ''],
    ['Centro de formación', revision?.centro_formacion || ''],
    ['Sede', revision?.sede_nombre || ''],
    ['Dirección', revision?.direccion || ''],
    ['Ciudad', revision?.ciudad || ''],
    ['Área total (m²)', revision?.area_total_m2 ?? 0],
    ['Área útil (m²)', revision?.area_util_m2 ?? 0],
    ['Temp. promedio (°C)', revision?.temp_promedio_c ?? 0],
    ['Vel. viento (km/h)', revision?.vel_viento_kmh ?? 0],
    ['Radiación solar (kWh/m²día)', revision?.radiacion_solar_kwh_m2_dia ?? 0],
    ['Año de construcción', revision?.ano_construccion ?? ''],
    ['Sede comparte instalaciones', revision?.sede_comparte || ''],
    ['Propiedad de la sede', revision?.propiedad_sede || ''],
    ['Número de trabajadores', revision?.num_trabajadores ?? 0],
    ['Número de aprendices', revision?.num_aprendices ?? 0],
    ['Número de visitantes', revision?.num_visitantes ?? 0],
    ['Tiene renovables', revision?.tiene_renovables || ''],
    ['Tipos de renovables', revision?.tipos_renovables || ''],
    ['Generación producida al año (kWh/año)', revision?.generacion_producida_kwh_anio ?? 0],
  ];

  const regimenRows = [['Hora', ...semana]];
  regimenSlots.forEach(slot => {
    const row = [slot];
    semana.forEach(day => row.push((regimen[day] || {})[slot] ? 'Activo' : ''));
    regimenRows.push(row);
  });

  const matrizRows = [['Mes', 'kWh', 'COP electricidad', 'Gas m³', 'COP gas', 'ACPM gal', 'COP ACPM', 'Gasolina gal', 'COP gasolina']];
  matriz.forEach(row => {
    matrizRows.push([
      row.fecha || '',
      row.electrica_kwh || 0,
      row.electrica_cop || 0,
      row.gas_m3 || 0,
      row.gas_cop || 0,
      row.acpm_gal || 0,
      row.acpm_cop || 0,
      row.gasolina_gal || 0,
      row.gasolina_cop || 0,
    ]);
  });
  matrizRows.push([
    'TOTAL',
    matriz.reduce((sum, row) => sum + Number(row.electrica_kwh || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.electrica_cop || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.gas_m3 || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.gas_cop || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.acpm_gal || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.acpm_cop || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.gasolina_gal || 0), 0),
    matriz.reduce((sum, row) => sum + Number(row.gasolina_cop || 0), 0),
  ]);

  const usosRows = [['Categoría', 'Uso', 'Consumo estimado', 'Participación %']];
  usosElectrica.forEach(item => usosRows.push(['Eléctrica', item.descripcion || '', item.consumo || 0, item.participacion || 0]));
  usosGas.forEach(item => usosRows.push(['Gas natural', item.descripcion || '', item.consumo || 0, item.participacion || 0]));
  usosAcp.forEach(item => usosRows.push(['ACPM', item.descripcion || '', item.consumo || 0, item.participacion || 0]));
  usosGasolina.forEach(item => usosRows.push(['Gasolina', item.descripcion || '', item.consumo || 0, item.participacion || 0]));

  const caracterizacionRows = [['Equipo / Ubicación', 'Descripción', 'Consumo', 'Notas']];
  caracterizacion.forEach(item => caracterizacionRows.push([item.equipo || '', item.descripcion || '', item.consumo || '', item.notas || '']));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildSheetFromRows(generalRows), 'Información general');
  XLSX.utils.book_append_sheet(workbook, buildSheetFromRows(regimenRows), 'Régimen de trabajo');
  XLSX.utils.book_append_sheet(workbook, buildSheetFromRows(matrizRows), 'Matriz energética');
  XLSX.utils.book_append_sheet(workbook, buildSheetFromRows(usosRows), 'Usos significativos');
  XLSX.utils.book_append_sheet(workbook, buildSheetFromRows(caracterizacionRows), 'Caracterización');
  return workbook;
}

function RevisionEnergetica088({ sede, onBack }) {
  const [revision, setRevision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [lastSaved, setLastSaved] = useState(null);
  const curvaChartRef = useRef(null);
  const matrizEnergyChartRef = useRef(null);
  const matrizCostChartRef = useRef(null);
  const paretoChartRefs = {
    electrica: useRef(null),
    gas: useRef(null),
    acpm: useRef(null),
    gasolina: useRef(null),
  };

  useEffect(() => {
    if (!sede?.id) return;
    setLoading(true);
    fetch(`/api/sedes/${sede.id}/revision088`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => {
        setRevision(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setRevision(null);
        setLoading(false);
      });
  }, [sede?.id]);

  const updateField = (field, value) => {
    setRevision(prev => ({ ...prev, [field]: value }));
  };

  const updateNumericField = (field, value) => {
    const number = parseFloat(value);
    setRevision(prev => ({ ...prev, [field]: Number.isNaN(number) ? 0 : number }));
  };

  const updateJsonField = (field, value) => {
    setRevision(prev => ({ ...prev, [field]: JSON.stringify(value) }));
  };

  const regimen = safeJsonParse(revision?.regimen_trabajo, {});
  const actividades = safeJsonParse(revision?.actividades, {});
  const curva = safeJsonParse(revision?.curva_carga_088, []);
  const matriz = safeJsonParse(revision?.matriz_energetica, []);
  const usos = {
    electrica: safeJsonParse(revision?.usos_energia_electrica, []),
    gas: safeJsonParse(revision?.usos_gas_natural, []),
    acpm: safeJsonParse(revision?.usos_acpm, []),
    gasolina: safeJsonParse(revision?.usos_gasolina, []),
  };
  const caracterizacion = safeJsonParse(revision?.caracterizacion_usos, []);

  const scheduleActiveCounts = regimenSlots.map(slot => {
    return semana.reduce((count, day) => {
      const value = (regimen[day] || {})[slot];
      return count + (value ? 1 : 0);
    }, 0);
  });

  const matrixTotals = {
    electrica: matriz.reduce((sum, row) => sum + Number(row.electrica_kwh || 0), 0),
    gas: matriz.reduce((sum, row) => sum + Number(row.gas_m3 || 0), 0),
    acpm: matriz.reduce((sum, row) => sum + Number(row.acpm_gal || 0), 0),
    gasolina: matriz.reduce((sum, row) => sum + Number(row.gasolina_gal || 0), 0),
    electricaCost: matriz.reduce((sum, row) => sum + Number(row.electrica_cop || 0), 0),
    gasCost: matriz.reduce((sum, row) => sum + Number(row.gas_cop || 0), 0),
    acpmCost: matriz.reduce((sum, row) => sum + Number(row.acpm_cop || 0), 0),
    gasolinaCost: matriz.reduce((sum, row) => sum + Number(row.gasolina_cop || 0), 0),
  };

  const matrizSinDatos = !matrixTotals.electrica && !matrixTotals.gas && !matrixTotals.acpm && !matrixTotals.gasolina && !matrixTotals.electricaCost && !matrixTotals.gasCost && !matrixTotals.acpmCost && !matrixTotals.gasolinaCost;

  const paretoData = category => {
    const items = usos[category] || [];
    const sorted = [...items].sort((a, b) => Number(b.consumo || 0) - Number(a.consumo || 0));
    const total = sorted.reduce((sum, item) => sum + Number(item.consumo || 0), 0);
    let acum = 0;
    return sorted.map(item => {
      acum += Number(item.consumo || 0);
      const pct = total ? Number(item.consumo || 0) / total * 100 : 0;
      return {
        label: item.descripcion || 'Uso',
        consumo: Number(item.consumo || 0),
        porcentaje: pct,
        acumulado: total ? acum / total * 100 : 0,
      };
    });
  };

  const totalUsos = {
    electrica: usos.electrica.reduce((sum, item) => sum + Number(item.consumo || 0), 0),
    gas: usos.gas.reduce((sum, item) => sum + Number(item.consumo || 0), 0),
    acpm: usos.acpm.reduce((sum, item) => sum + Number(item.consumo || 0), 0),
    gasolina: usos.gasolina.reduce((sum, item) => sum + Number(item.consumo || 0), 0),
  };

  useEffect(() => {
    const el = document.getElementById('grafico-curva-088');
    if (!el) return;
    if (curvaChartRef.current) curvaChartRef.current.destroy();
    try {
      const normalizedCurva = Array.from({ length: 24 }, (_, index) => curva[index] || { hora: index + 1, potencia: 0 });
      const ctx = el.getContext('2d');
      const labels = normalizedCurva.map((d, index) => d.hora || index + 1);
      const values = normalizedCurva.map(d => Number(d.potencia || 0));
      curvaChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Potencia (kW)',
              data: values,
              borderColor: '#0B7D4B',
              backgroundColor: 'rgba(11, 125, 75, 0.16)',
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#0B7D4B',
              borderWidth: 2,
              spanGaps: true,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: { legend: { position: 'bottom' } },
          scales: {
            x: { title: { display: true, text: 'Hora del día' } },
            y: { beginAtZero: true, title: { display: true, text: 'Potencia (kW)' } },
          },
        },
      });
    } catch (e) {
      console.error('Error crear gráfico curva:', e);
    }
    return () => { if (curvaChartRef.current) curvaChartRef.current.destroy(); };
  }, [curva]);

  useEffect(() => {
    if (activeTab !== 'matriz') return;
    if (matrizEnergyChartRef.current) matrizEnergyChartRef.current.destroy();
    if (matrizCostChartRef.current) matrizCostChartRef.current.destroy();
    try {
      const energyEl = document.getElementById('grafico-matriz-energia');
      const costEl = document.getElementById('grafico-matriz-costo');
      if (energyEl && !matrizSinDatos) {
        matrizEnergyChartRef.current = new Chart(energyEl.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Energía eléctrica', 'Gas natural', 'ACPM', 'Gasolina'],
            datasets: [{
              data: [matrixTotals.electrica, matrixTotals.gas, matrixTotals.acpm, matrixTotals.gasolina],
              backgroundColor: ['#0B7D4B', '#1ab66f', '#ff9f1c', '#3c8dbc'],
              borderColor: '#ffffff',
              borderWidth: 2,
            }],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: context => `${context.label}: ${context.parsed || 0}`,
                },
              },
            },
          },
        });
      }
      if (costEl && !matrizSinDatos) {
        matrizCostChartRef.current = new Chart(costEl.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Energía eléctrica', 'Gas natural', 'ACPM', 'Gasolina'],
            datasets: [{
              data: [matrixTotals.electricaCost, matrixTotals.gasCost, matrixTotals.acpmCost, matrixTotals.gasolinaCost],
              backgroundColor: ['#0B7D4B', '#1ab66f', '#ff9f1c', '#3c8dbc'],
              borderColor: '#ffffff',
              borderWidth: 2,
            }],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: context => `${context.label}: ${context.parsed || 0}`,
                },
              },
            },
          },
        });
      }
    } catch (e) {
      console.error('Error crear gráficos matriz:', e);
    }
    return () => {
      if (matrizEnergyChartRef.current) matrizEnergyChartRef.current.destroy();
      if (matrizCostChartRef.current) matrizCostChartRef.current.destroy();
    };
  }, [matriz, activeTab]);

  const createParetoChart = (category) => {
    const data = paretoData(category);
    const el = document.getElementById(`grafico-pareto-${category}`);
    if (!el) return;
    if (paretoChartRefs[category].current) paretoChartRefs[category].current.destroy();
    try {
      paretoChartRefs[category].current = new Chart(el.getContext('2d'), {
        type: 'bar',
        data: {
          labels: data.map(item => item.label || 'Uso'),
          datasets: [
            {
              type: 'bar',
              label: 'Consumo estimado',
              data: data.map(item => item.consumo),
              backgroundColor: '#0B7D4B',
            },
            {
              type: 'line',
              label: 'Acumulado %',
              data: data.map(item => item.acumulado),
              borderColor: '#ff9f1c',
              backgroundColor: 'rgba(255,159,28,0.12)',
              yAxisID: 'y1',
              tension: 0.3,
              fill: false,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Consumo estimado' } },
            y1: { beginAtZero: true, position: 'right', title: { display: true, text: 'Acumulado (%)' }, grid: { drawOnChartArea: false }, max: 100 },
          },
          plugins: { legend: { position: 'bottom' } },
        },
      });
    } catch (e) {
      console.error(`Error crear gráfico Pareto ${category}:`, e);
    }
  };

  useEffect(() => {
    if (activeTab !== 'usos') return;
    ['electrica', 'gas', 'acpm', 'gasolina'].forEach(createParetoChart);
    return () => {
      Object.values(paretoChartRefs).forEach(ref => { if (ref.current) ref.current.destroy(); });
    };
  }, [usos, activeTab]);

  const exportRevisionExcel = () => {
    if (!revision) return;
    const workbook = createExcelWorkbook(revision);
    downloadExcelFile(workbook, `revision088_sede_${sede.id}.xlsx`);
  };

  async function guardar() {
    if (!revision) return;
    const payload = {
      ...revision,
      regimen_trabajo: JSON.stringify(regimen),
      actividades: JSON.stringify(actividades),
      curva_carga_088: JSON.stringify(curva),
      matriz_energetica: JSON.stringify(matriz),
      usos_energia_electrica: JSON.stringify(usos.electrica),
      usos_gas_natural: JSON.stringify(usos.gas),
      usos_acpm: JSON.stringify(usos.acpm),
      usos_gasolina: JSON.stringify(usos.gasolina),
      caracterizacion_usos: JSON.stringify(caracterizacion),
    };
    try {
      const url = revision.id ? `/api/revision088/${revision.id}` : `/api/sedes/${sede.id}/revision088`;
      const method = revision.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error guardando revisión');
      const data = await res.json();
      setRevision(data);
      setLastSaved(new Date().toLocaleTimeString('es-ES'));
      alert('Revisión 088 guardada correctamente.');
    } catch (e) {
      console.error(e);
      alert('Error guardando revisión 088.');
    }
  }

  if (loading) return <div className="empty">Cargando revisión 088...</div>;
  if (!revision) return <div className="empty">Error cargando datos</div>;

  return (
    <div className="revision-088-container">
      <div className="revision-header">
        <button className="btn btn-secondary" onClick={onBack}>← Volver</button>
        <h2>📋 Revisión Energética 088</h2>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-secondary" onClick={exportRevisionExcel}>⬇️ Exportar Excel</button>
        <button className="btn btn-primary" onClick={guardar}>💾 Guardar</button>
        {lastSaved && <div style={{ fontSize: 12, color: '#fff' }}>Guardado: {lastSaved}</div>}
      </div>

      <div className="tabs-revision">
        {['general', 'curva', 'actividades', 'matriz', 'usos'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'general' && '📍 General'}
            {tab === 'curva' && '⏰ Régimen y curva'}
            {tab === 'actividades' && '🏗️ Actividades'}
            {tab === 'matriz' && '📈 Matriz energética'}
            {tab === 'usos' && '⚡ Usos energéticos'}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <section className="card">
          <h3>1. Información General de la sede</h3>
          <div className="form-section">
            <h4>Información básica</h4>
            <div className="form-row">
              <div className="form-group"><label>Fecha</label><input type="date" value={revision.fecha || ''} onChange={e => updateField('fecha', e.target.value)} /></div>
              <div className="form-group"><label>Regional</label><input value={revision.regional || ''} onChange={e => updateField('regional', e.target.value)} /></div>
              <div className="form-group"><label>Centro de formación</label><input value={revision.centro_formacion || ''} onChange={e => updateField('centro_formacion', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Sede</label><input value={revision.sede_nombre || ''} onChange={e => updateField('sede_nombre', e.target.value)} /></div>
              <div className="form-group"><label>Dirección</label><input value={revision.direccion || ''} onChange={e => updateField('direccion', e.target.value)} /></div>
              <div className="form-group"><label>Ciudad</label><input value={revision.ciudad || ''} onChange={e => updateField('ciudad', e.target.value)} /></div>
            </div>
          </div>

          <div className="form-section">
            <h4>Datos físicos y climáticos</h4>
            <div className="form-row">
              <div className="form-group"><label>Área total (m²)</label><input type="number" value={revision.area_total_m2 || ''} onChange={e => updateNumericField('area_total_m2', e.target.value)} /></div>
              <div className="form-group"><label>Área útil (m²)</label><input type="number" value={revision.area_util_m2 || ''} onChange={e => updateNumericField('area_util_m2', e.target.value)} /></div>
              <div className="form-group"><label>Temperatura promedio (°C)</label><input type="number" step="0.1" value={revision.temp_promedio_c || ''} onChange={e => updateNumericField('temp_promedio_c', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Vel. viento (km/h)</label><input type="number" step="0.1" value={revision.vel_viento_kmh || ''} onChange={e => updateNumericField('vel_viento_kmh', e.target.value)} /></div>
              <div className="form-group"><label>Radiación solar (kWh/m²día)</label><input type="number" step="0.1" value={revision.radiacion_solar_kwh_m2_dia || ''} onChange={e => updateNumericField('radiacion_solar_kwh_m2_dia', e.target.value)} /></div>
              <div className="form-group"><label>Año de construcción</label><input type="number" value={revision.ano_construccion || ''} onChange={e => updateField('ano_construccion', e.target.value ? parseInt(e.target.value) : '')} /></div>
            </div>
          </div>

          <div className="form-section">
            <h4>Información operacional</h4>
            <div className="form-row">
              <div className="form-group"><label>¿Sede comparte instalaciones?</label><select value={revision.sede_comparte || ''} onChange={e => updateField('sede_comparte', e.target.value)}><option value="">Seleccionar</option><option value="Sí">Sí</option><option value="No">No</option></select></div>
              <div className="form-group"><label>Propiedad de la sede</label><input value={revision.propiedad_sede || ''} onChange={e => updateField('propiedad_sede', e.target.value)} placeholder="Propia / Arriendo / Comodato" /></div>
              <div className="form-group"><label>Número de trabajadores</label><input type="number" value={revision.num_trabajadores || ''} onChange={e => updateNumericField('num_trabajadores', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Número de aprendices</label><input type="number" value={revision.num_aprendices || ''} onChange={e => updateNumericField('num_aprendices', e.target.value)} /></div>
              <div className="form-group"><label>Número de visitantes</label><input type="number" value={revision.num_visitantes || ''} onChange={e => updateNumericField('num_visitantes', e.target.value)} /></div>
              <div className="form-group"><label>Cuenta con renovables</label><select value={revision.tiene_renovables || ''} onChange={e => updateField('tiene_renovables', e.target.value)}><option value="">Seleccionar</option><option value="Sí">Sí</option><option value="No">No</option></select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Tipos de renovables</label><input value={revision.tipos_renovables || ''} onChange={e => updateField('tipos_renovables', e.target.value)} placeholder="Ej: Solar, Eólica" /></div>
              <div className="form-group"><label>Generación anual (kWh/año)</label><input type="number" step="0.1" value={revision.generacion_producida_kwh_anio || ''} onChange={e => updateNumericField('generacion_producida_kwh_anio', e.target.value)} /></div>
            </div>
          </div>
        </section>
      )}


      {activeTab === 'actividades' && (
        <section className="card">
          <h3>1.3 Actividades que se desarrollan</h3>
          <div className="form-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {['Administrativas','Industriales','Agrícolas','Pecuarias','Gastronómicas','Laboratorios','Automotriz','Informática y/o diseño de software','Salud','Agroindustrial'].map(act => (
              <label key={act} className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={Boolean(actividades[act])} onChange={e => {
                  const next = { ...actividades, [act]: e.target.checked };
                  updateJsonField('actividades', next);
                }} />
                <span>{act}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'curva' && (
        <section className="card">
          <h3>1.2 Régimen de trabajo y curva de carga</h3>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16, minHeight: 340 }}>
            <canvas id="grafico-curva-088" height="300"></canvas>
          </div>
          <div className="form-section">
            <h4>Horario de operación</h4>
            <p style={{ margin: 0, color: '#4c4c4c' }}>Llena el horario por día y la gráfica mostrará la curva de carga de acuerdo a las horas activas y la potencia en kW.</p>
          </div>
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table className="table" style={{ minWidth: '1000px' }}>
              <thead>
                <tr>
                  <th>Hora</th>
                  {semana.map(day => <th key={day}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {regimenSlots.map(slot => (
                  <tr key={slot}>
                    <td>{slot}</td>
                    {semana.map(day => (
                      <td key={`${slot}-${day}`}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <input type="checkbox" checked={Boolean((regimen[day] || {})[slot])} onChange={e => {
                            const next = { ...regimen };
                            next[day] = { ...next[day], [slot]: e.target.checked };
                            updateJsonField('regimen_trabajo', next);
                          }} />
                          <span style={{ fontSize: 12 }}>{(regimen[day] || {})[slot] ? 'Activo' : ''}</span>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="form-section" style={{ marginTop: 16 }}>
            <h4>Datos de potencia por hora</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>
              {Array.from({ length: 24 }).map((_, index) => {
                const current = curva[index] || { hora: index + 1, potencia: 0 };
                return (
                  <div key={index} className="form-group">
                    <label>{index + 1}:00</label>
                    <input type="number" step="0.1" value={current.potencia || ''} onChange={e => {
                      const next = [...curva];
                      next[index] = { hora: index + 1, potencia: parseFloat(e.target.value) || 0 };
                      updateJsonField('curva_carga_088', next);
                    }} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'matriz' && (
        <section className="card">
          <h3>2.2 Matriz energética</h3>
          <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <h4>Registro mensual</h4>
              <button className="btn btn-secondary" onClick={() => updateJsonField('matriz_energetica', [...matriz, defaultMatrizRow()])}>+ Agregar mes</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: 1120 }}>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>kWh</th>
                    <th>COP</th>
                    <th>Gas m³</th>
                    <th>COP</th>
                    <th>ACPM gal</th>
                    <th>COP</th>
                    <th>Gasolina gal</th>
                    <th>COP</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {matriz.map((row, index) => (
                    <tr key={index}>
                      <td><input className="form-group" value={row.fecha || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], fecha: e.target.value }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="0.1" value={row.electrica_kwh || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], electrica_kwh: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="100" value={row.electrica_cop || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], electrica_cop: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="0.1" value={row.gas_m3 || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], gas_m3: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="100" value={row.gas_cop || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], gas_cop: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="0.1" value={row.acpm_gal || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], acpm_gal: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="100" value={row.acpm_cop || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], acpm_cop: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="0.1" value={row.gasolina_gal || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], gasolina_gal: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><input className="form-group" type="number" step="100" value={row.gasolina_cop || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], gasolina_cop: parseFloat(e.target.value) || 0 }; updateJsonField('matriz_energetica', next); }} /></td>
                      <td><button className="btn btn-delete" onClick={() => { const next = [...matriz]; next.splice(index, 1); updateJsonField('matriz_energetica', next); }}>Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th>{matrixTotals.electrica}</th>
                    <th>{matrixTotals.electricaCost}</th>
                    <th>{matrixTotals.gas}</th>
                    <th>{matrixTotals.gasCost}</th>
                    <th>{matrixTotals.acpm}</th>
                    <th>{matrixTotals.acpmCost}</th>
                    <th>{matrixTotals.gasolina}</th>
                    <th>{matrixTotals.gasolinaCost}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="form-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minHeight: 280 }}>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, minHeight: 260, height: 300 }}>
              <h4>Matriz energética</h4>
              <canvas id="grafico-matriz-energia" height="220" style={{ width: '100%', height: '100%' }}></canvas>
              {matrizSinDatos && <div style={{ color: '#777', fontSize: 13, marginTop: 14 }}>Agrega datos en la matriz para ver el gráfico.</div>}
            </div>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, minHeight: 260, height: 300 }}>
              <h4>Matriz de costo energético</h4>
              <canvas id="grafico-matriz-costo" height="220" style={{ width: '100%', height: '100%' }}></canvas>
              {matrizSinDatos && <div style={{ color: '#777', fontSize: 13, marginTop: 14 }}>Agrega datos en la matriz para ver el gráfico.</div>}
            </div>
          </div>
          {matrizSinDatos && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: '#fff5e6', color: '#5c4d00' }}>
              Ingresa al menos un mes con valores en la matriz energética para que se desplieguen los gráficos.
            </div>
          )}
        </section>
      )}

      {activeTab === 'usos' && (
        <section className="card">
          <h3>3. Usos significativos de la energía</h3>

          <div className="form-section">
            <h4>Uso final de energía eléctrica</h4>
            {usos.electrica.map((item, index) => (
              <div key={index} style={{ background: '#f0f8ff', padding: 14, borderRadius: 12, marginBottom: 12 }}>
                <div className="form-row">
                  <div className="form-group"><label>Uso</label><input value={item.descripcion || ''} onChange={e => { const next = [...usos.electrica]; next[index] = { ...next[index], descripcion: e.target.value }; updateJsonField('usos_energia_electrica', next); }} /></div>
                  <div className="form-group"><label>Consumo mensual estimado (kWh/mes)</label><input type="number" step="0.1" value={item.consumo || ''} onChange={e => { const next = [...usos.electrica]; next[index] = { ...next[index], consumo: parseFloat(e.target.value) || 0 }; updateJsonField('usos_energia_electrica', next); }} /></div>
                  <div className="form-group"><label>Participación %</label><input type="number" step="0.1" value={item.participacion || ''} onChange={e => { const next = [...usos.electrica]; next[index] = { ...next[index], participacion: parseFloat(e.target.value) || 0 }; updateJsonField('usos_energia_electrica', next); }} /></div>
                </div>
                <button className="btn btn-delete" onClick={() => { const next = [...usos.electrica]; next.splice(index, 1); updateJsonField('usos_energia_electrica', next); }}>Eliminar</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => updateJsonField('usos_energia_electrica', [...usos.electrica, defaultUsoRow()])}>+ Agregar uso eléctrico</button>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 16, minHeight: 260 }}>
              <canvas id="grafico-pareto-electrica" height="220"></canvas>
            </div>
          </div>

          <div className="form-section">
            <h4>Uso final de gas natural</h4>
            {usos.gas.map((item, index) => (
              <div key={index} style={{ background: '#f0fff5', padding: 14, borderRadius: 12, marginBottom: 12 }}>
                <div className="form-row">
                  <div className="form-group"><label>Uso</label><input value={item.descripcion || ''} onChange={e => { const next = [...usos.gas]; next[index] = { ...next[index], descripcion: e.target.value }; updateJsonField('usos_gas_natural', next); }} /></div>
                  <div className="form-group"><label>Consumo mensual estimado (m³/mes)</label><input type="number" step="0.1" value={item.consumo || ''} onChange={e => { const next = [...usos.gas]; next[index] = { ...next[index], consumo: parseFloat(e.target.value) || 0 }; updateJsonField('usos_gas_natural', next); }} /></div>
                  <div className="form-group"><label>Participación %</label><input type="number" step="0.1" value={item.participacion || ''} onChange={e => { const next = [...usos.gas]; next[index] = { ...next[index], participacion: parseFloat(e.target.value) || 0 }; updateJsonField('usos_gas_natural', next); }} /></div>
                </div>
                <button className="btn btn-delete" onClick={() => { const next = [...usos.gas]; next.splice(index, 1); updateJsonField('usos_gas_natural', next); }}>Eliminar</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => updateJsonField('usos_gas_natural', [...usos.gas, defaultUsoRow()])}>+ Agregar uso gas natural</button>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 16, minHeight: 260 }}>
              <canvas id="grafico-pareto-gas" height="220"></canvas>
            </div>
          </div>

          <div className="form-section">
            <h4>Uso final de ACPM</h4>
            {usos.acpm.map((item, index) => (
              <div key={index} style={{ background: '#fff8ec', padding: 14, borderRadius: 12, marginBottom: 12 }}>
                <div className="form-row">
                  <div className="form-group"><label>Uso</label><input value={item.descripcion || ''} onChange={e => { const next = [...usos.acpm]; next[index] = { ...next[index], descripcion: e.target.value }; updateJsonField('usos_acpm', next); }} /></div>
                  <div className="form-group"><label>Consumo mensual estimado (gal/mes)</label><input type="number" step="0.1" value={item.consumo || ''} onChange={e => { const next = [...usos.acpm]; next[index] = { ...next[index], consumo: parseFloat(e.target.value) || 0 }; updateJsonField('usos_acpm', next); }} /></div>
                  <div className="form-group"><label>Participación %</label><input type="number" step="0.1" value={item.participacion || ''} onChange={e => { const next = [...usos.acpm]; next[index] = { ...next[index], participacion: parseFloat(e.target.value) || 0 }; updateJsonField('usos_acpm', next); }} /></div>
                </div>
                <button className="btn btn-delete" onClick={() => { const next = [...usos.acpm]; next.splice(index, 1); updateJsonField('usos_acpm', next); }}>Eliminar</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => updateJsonField('usos_acpm', [...usos.acpm, defaultUsoRow()])}>+ Agregar uso ACPM</button>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 16, minHeight: 260 }}>
              <canvas id="grafico-pareto-acpm" height="220"></canvas>
            </div>
          </div>

          <div className="form-section">
            <h4>Uso final de Gasolina</h4>
            {usos.gasolina.map((item, index) => (
              <div key={index} style={{ background: '#eef4ff', padding: 14, borderRadius: 12, marginBottom: 12 }}>
                <div className="form-row">
                  <div className="form-group"><label>Uso</label><input value={item.descripcion || ''} onChange={e => { const next = [...usos.gasolina]; next[index] = { ...next[index], descripcion: e.target.value }; updateJsonField('usos_gasolina', next); }} /></div>
                  <div className="form-group"><label>Consumo mensual estimado (gal/mes)</label><input type="number" step="0.1" value={item.consumo || ''} onChange={e => { const next = [...usos.gasolina]; next[index] = { ...next[index], consumo: parseFloat(e.target.value) || 0 }; updateJsonField('usos_gasolina', next); }} /></div>
                  <div className="form-group"><label>Participación %</label><input type="number" step="0.1" value={item.participacion || ''} onChange={e => { const next = [...usos.gasolina]; next[index] = { ...next[index], participacion: parseFloat(e.target.value) || 0 }; updateJsonField('usos_gasolina', next); }} /></div>
                </div>
                <button className="btn btn-delete" onClick={() => { const next = [...usos.gasolina]; next.splice(index, 1); updateJsonField('usos_gasolina', next); }}>Eliminar</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => updateJsonField('usos_gasolina', [...usos.gasolina, defaultUsoRow()])}>+ Agregar uso gasolina</button>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 16, minHeight: 260 }}>
              <canvas id="grafico-pareto-gasolina" height="220"></canvas>
            </div>
          </div>

          <div className="form-section">
            <h4>Caracterización de los usos</h4>
            {caracterizacion.map((item, index) => (
              <div key={index} style={{ background: '#fafafa', padding: 14, borderRadius: 12, marginBottom: 12 }}>
                <div className="form-row">
                  <div className="form-group"><label>Equipo/Uso</label><input value={item.equipo || ''} onChange={e => { const next = [...caracterizacion]; next[index] = { ...next[index], equipo: e.target.value }; updateJsonField('caracterizacion_usos', next); }} /></div>
                  <div className="form-group"><label>Descripción</label><input value={item.descripcion || ''} onChange={e => { const next = [...caracterizacion]; next[index] = { ...next[index], descripcion: e.target.value }; updateJsonField('caracterizacion_usos', next); }} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Consumo</label><input value={item.consumo || ''} onChange={e => { const next = [...caracterizacion]; next[index] = { ...next[index], consumo: e.target.value }; updateJsonField('caracterizacion_usos', next); }} /></div>
                  <div className="form-group"><label>Notas</label><textarea value={item.notas || ''} onChange={e => { const next = [...caracterizacion]; next[index] = { ...next[index], notas: e.target.value }; updateJsonField('caracterizacion_usos', next); }} /></div>
                </div>
                <button className="btn btn-delete" onClick={() => { const next = [...caracterizacion]; next.splice(index, 1); updateJsonField('caracterizacion_usos', next); }}>Eliminar</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={() => updateJsonField('caracterizacion_usos', [...caracterizacion, defaultCaracterizacionRow()])}>+ Agregar caracterización</button>
          </div>
        </section>
      )}
    </div>
  );
}
