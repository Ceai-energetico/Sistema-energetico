const ReactHooks = React || window.React;
const { useState, useEffect, useRef } = ReactHooks;

const semana = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo','Festivo'];
const regimenSlots = ['00:00-02:00','02:01-04:00','04:01-06:00','06:01-08:00','08:01-10:00','10:01-12:00','12:01-14:00','14:01-16:00','16:01-18:00','18:01-20:00','20:01-22:00','22:01-24:00'];
const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState({});
  const curvaChartRef = useRef(null);
  const matrizEnergyChartRef = useRef(null);
  const matrizCostChartRef = useRef(null);
  const paretoChartRefs = {
    electrica: useRef(null),
    gas: useRef(null),
    acpm: useRef(null),
    gasolina: useRef(null),
  };

  const chartsList = [
    { id: 'grafico-curva-088', name: 'curva', label: 'Curva de Carga' },
    { id: 'grafico-matriz-energia', name: 'matriz_energia', label: 'Matriz Energética' },
    { id: 'grafico-matriz-costo', name: 'matriz_costo', label: 'Matriz de Costo' },
    { id: 'grafico-pareto-electrica', name: 'pareto_electrica', label: 'Pareto Eléctrica' },
    { id: 'grafico-pareto-gas', name: 'pareto_gas', label: 'Pareto Gas' },
    { id: 'grafico-pareto-acpm', name: 'pareto_acpm', label: 'Pareto ACPM' },
    { id: 'grafico-pareto-gasolina', name: 'pareto_gasolina', label: 'Pareto Gasolina' },
  ];

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

  // Auto-guardar cuando cambien los usos
  useEffect(() => {
    if (!revision || !revision.id) return;
    
    const autoSaveTimer = setTimeout(async () => {
      try {
        const payload = {
          ...revision,
          regimen_trabajo: revision.regimen_trabajo ? JSON.stringify(safeJsonParse(revision.regimen_trabajo, {})) : '{}',
          actividades: revision.actividades ? JSON.stringify(safeJsonParse(revision.actividades, {})) : '{}',
          curva_carga_088: revision.curva_carga_088 ? JSON.stringify(safeJsonParse(revision.curva_carga_088, [])) : '[]',
          matriz_energetica: revision.matriz_energetica ? JSON.stringify(safeJsonParse(revision.matriz_energetica, [])) : '[]',
          usos_energia_electrica: revision.usos_energia_electrica ? JSON.stringify(safeJsonParse(revision.usos_energia_electrica, [])) : '[]',
          usos_gas_natural: revision.usos_gas_natural ? JSON.stringify(safeJsonParse(revision.usos_gas_natural, [])) : '[]',
          usos_acpm: revision.usos_acpm ? JSON.stringify(safeJsonParse(revision.usos_acpm, [])) : '[]',
          usos_gasolina: revision.usos_gasolina ? JSON.stringify(safeJsonParse(revision.usos_gasolina, [])) : '[]',
          caracterizacion_usos: revision.caracterizacion_usos ? JSON.stringify(safeJsonParse(revision.caracterizacion_usos, [])) : '[]',
        };

        const res = await fetch(`/api/revision088/${revision.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (res.ok) {
          setLastSaved(new Date().toLocaleTimeString('es-ES'));
        }
      } catch (e) {
        console.error('Error en auto-guardado:', e);
      }
    }, 1000);

    return () => clearTimeout(autoSaveTimer);
  }, [revision?.usos_energia_electrica, revision?.usos_gas_natural, revision?.usos_acpm, revision?.usos_gasolina, revision?.fecha, revision?.regional, revision?.centro_formacion, revision?.sede_nombre, revision?.direccion, revision?.ciudad, revision?.area_total_m2, revision?.area_util_m2, revision?.temp_promedio_c, revision?.vel_viento_kmh, revision?.radiacion_solar_kwh_m2_dia, revision?.ano_construccion, revision?.sede_comparte, revision?.propiedad_sede, revision?.num_trabajadores, revision?.num_aprendices, revision?.num_visitantes, revision?.tiene_renovables, revision?.tipos_renovables, revision?.generacion_producida_kwh_anio, revision?.regimen_trabajo, revision?.actividades, revision?.curva_carga_088, revision?.matriz_energetica, revision?.caracterizacion_usos]);

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

  const downloadCanvasImage = (canvas, fileName, type = 'image/png') => {
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL(type);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Error descargando imagen:', e);
      alert('Error al descargar la imagen. Intenta de nuevo.');
    }
  };

  const exportSelectedCharts = () => {
    chartsList.forEach(chart => {
      if (selectedCharts[chart.id]) {
        const canvas = document.getElementById(chart.id);
        if (canvas) {
          downloadCanvasImage(canvas, `revision088_${chart.name}.png`, 'image/png');
        }
      }
    });
    setShowExportModal(false);
    setSelectedCharts({});
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
      const maxPower = Math.max(1, ...values);
      const displaySchedule = scheduleActiveCounts.some(v => v > 0);
      curvaChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Potencia (kW)',
              data: values,
              borderColor: '#0B7D4B',
              backgroundColor: 'rgba(11, 125, 75, 0.18)',
              tension: 0.35,
              fill: true,
              pointRadius: 3,
              pointBackgroundColor: '#0B7D4B',
              borderWidth: 2.5,
              spanGaps: true,
            },
            ...(displaySchedule ? [{
              label: 'Horas activas',
              data: scheduleActiveCounts,
              borderColor: '#1ab66f',
              backgroundColor: 'rgba(26, 182, 111, 0.12)',
              tension: 0.35,
              fill: false,
              pointRadius: 2,
              borderDash: [5, 5],
              yAxisID: 'y1',
            }] : []),
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'nearest', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 14, padding: 16, font: { size: 12, weight: 600 } } },
            tooltip: { enabled: true, backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, titleFont: { size: 13, weight: 600 }, bodyFont: { size: 12 } },
          },
          scales: {
            x: {
              title: { display: true, text: 'Hora del día', font: { size: 12, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)', drawBorder: true },
            },
            y: {
              beginAtZero: true,
              suggestedMax: Math.ceil(maxPower * 1.2 * 10) / 10,
              title: { display: true, text: 'Potencia (kW)', font: { size: 12, weight: 600 } },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y1: {
              display: displaySchedule,
              beginAtZero: true,
              max: 7,
              position: 'right',
              title: { display: true, text: 'Horas activas', font: { size: 12, weight: 600 } },
              grid: { drawOnChartArea: false },
            },
          },
        },
      });
    } catch (e) {
      console.error('Error crear gráfico curva:', e);
    }
    return () => { if (curvaChartRef.current) curvaChartRef.current.destroy(); };
  }, [curva, scheduleActiveCounts]);

  useEffect(() => {
    if (activeTab !== 'matriz') return;
    if (matrizEnergyChartRef.current) matrizEnergyChartRef.current.destroy();
    if (matrizCostChartRef.current) matrizCostChartRef.current.destroy();
    try {
      const energyEl = document.getElementById('grafico-matriz-energia');
      const costEl = document.getElementById('grafico-matriz-costo');
      const energyData = [matrixTotals.electrica, matrixTotals.gas, matrixTotals.acpm, matrixTotals.gasolina];
      const costData = [matrixTotals.electricaCost, matrixTotals.gasCost, matrixTotals.acpmCost, matrixTotals.gasolinaCost];
      const colors = ['#0B7D4B', '#1ab66f', '#ff9f1c', '#3c8dbc'];
      
      if (energyEl && !matrizSinDatos) {
        matrizEnergyChartRef.current = new Chart(energyEl.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Eléctrica', 'Gas natural', 'ACPM', 'Gasolina'],
            datasets: [{
              data: energyData,
              backgroundColor: colors,
              borderColor: '#ffffff',
              borderWidth: 2.5,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600 },
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { 
                  boxWidth: 12, 
                  padding: 14, 
                  font: { size: 12, weight: 600 },
                  generateLabels: function(chart) {
                    const data = chart.data;
                    return data.labels.map((label, i) => ({
                      text: label,
                      fillStyle: colors[i],
                      hidden: false,
                      index: i
                    }));
                  }
                } 
              },
              tooltip: { 
                enabled: true, 
                backgroundColor: 'rgba(0,0,0,0.85)', 
                padding: 12, 
                titleFont: { size: 13, weight: 600 }, 
                bodyFont: { size: 12 },
                callbacks: { 
                  label: context => {
                    const total = energyData.reduce((a, b) => a + b, 0);
                    const value = context.parsed;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${context.label}: ${value.toFixed(2)} (${percentage}%)`;
                  }
                }
              },
            },
          },
        });
      }
      
      if (costEl && !matrizSinDatos) {
        matrizCostChartRef.current = new Chart(costEl.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Eléctrica', 'Gas natural', 'ACPM', 'Gasolina'],
            datasets: [{
              data: costData,
              backgroundColor: colors,
              borderColor: '#ffffff',
              borderWidth: 2.5,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 600 },
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { 
                  boxWidth: 12, 
                  padding: 14, 
                  font: { size: 12, weight: 600 },
                  generateLabels: function(chart) {
                    const data = chart.data;
                    return data.labels.map((label, i) => ({
                      text: label,
                      fillStyle: colors[i],
                      hidden: false,
                      index: i
                    }));
                  }
                } 
              },
              tooltip: { 
                enabled: true, 
                backgroundColor: 'rgba(0,0,0,0.85)', 
                padding: 12, 
                titleFont: { size: 13, weight: 600 }, 
                bodyFont: { size: 12 },
                callbacks: { 
                  label: context => {
                    const total = costData.reduce((a, b) => a + b, 0);
                    const value = context.parsed;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    return `${context.label}: $${value.toFixed(0)} (${percentage}%)`;
                  }
                }
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
      const categoryLabels = {
        electrica: 'Usos Significativos de energía eléctrica',
        gas: 'Usos Significativos de gas natural',
        acpm: 'Usos Significativos de ACPM',
        gasolina: 'Usos Significativos de gasolina'
      };
      
      paretoChartRefs[category].current = new Chart(el.getContext('2d'), {
        type: 'bar',
        data: {
          labels: data.map(item => item.label),
          datasets: [
            {
              type: 'bar',
              label: 'Consumo mensual estimado (kWh/mes)',
              data: data.map(item => item.consumo),
              backgroundColor: '#4472C4',
              borderRadius: 4,
              borderSkipped: false,
              maxBarThickness: 40,
              yAxisID: 'y',
              barPercentage: 0.7,
            },
            {
              type: 'line',
              label: 'Acumulado (%)',
              data: data.map(item => item.acumulado),
              borderColor: '#FF6B35',
              backgroundColor: 'transparent',
              yAxisID: 'y1',
              tension: 0.4,
              fill: false,
              pointRadius: 6,
              pointBackgroundColor: '#FF6B35',
              pointBorderColor: '#fff',
              pointBorderWidth: 2.5,
              borderWidth: 3,
              pointHoverRadius: 8,
              datalabels: {
                display: true,
              }
            },
          ],
        },
        options: {
          indexAxis: undefined,
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 30,
            }
          },
          plugins: { 
            title: {
              display: true,
              text: categoryLabels[category],
              font: { size: 14, weight: 'bold' },
              padding: { bottom: 20 }
            },
            legend: { 
              position: 'bottom', 
              labels: { 
                boxWidth: 15, 
                padding: 20, 
                font: { size: 12, weight: 500 },
                usePointStyle: false,
              } 
            },
            tooltip: { 
              enabled: true, 
              backgroundColor: 'rgba(0,0,0,0.85)', 
              padding: 12, 
              titleFont: { size: 13, weight: 600 }, 
              bodyFont: { size: 12 },
              callbacks: {
                label: context => {
                  if (context.datasetIndex === 0) {
                    return `Consumo: ${context.parsed.y.toFixed(1)} kWh/mes`;
                  } else {
                    return `Acumulado: ${context.parsed.y.toFixed(1)}%`;
                  }
                }
              }
            },
          },
          scales: {
            x: { 
              title: { display: true, text: 'Usos finales de energía', font: { size: 12, weight: 600 } },
              grid: { display: false, drawBorder: true },
              ticks: { font: { size: 11, weight: 500 } }
            },
            y: { 
              type: 'linear',
              position: 'left',
              beginAtZero: true, 
              title: { display: true, text: 'Consumo mensual estimado (kWh/mes)', font: { size: 12, weight: 600 } }, 
              grid: { color: 'rgba(0,0,0,0.1)', drawBorder: true },
              ticks: { font: { size: 11 } }
            },
            y1: { 
              type: 'linear',
              position: 'right', 
              beginAtZero: true,
              max: 100,
              title: { display: true, text: '%', font: { size: 12, weight: 600 } }, 
              grid: { drawOnChartArea: false, drawBorder: true },
              ticks: { 
                font: { size: 11 }, 
                callback: function(value) { 
                  return value + '%'; 
                },
                stepSize: 20
              }
            },
          },
        },
        plugins: [{
          id: 'datalabels',
          afterDatasetsDraw(chart) {
            const { ctx, data, chartArea: { left, right, top, bottom, width, height } } = chart;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              if (datasetIndex === 1) {
                const yScale = chart.scales[dataset.yAxisID];
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.data.forEach((elem, index) => {
                  const data = dataset.data[index];
                  const label = `${Math.round(data)}%`;
                  const x = elem.x;
                  const y = elem.y - 15;
                  ctx.fillStyle = '#FF6B35';
                  ctx.font = 'bold 12px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(label, x, y);
                });
              }
            });
          }
        }]
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
        <div className="revision-header__info">
          <button className="btn btn-secondary" onClick={onBack}>← Volver</button>
        </div>
        <div className="revision-header-actions">
          <button className="btn btn-secondary" onClick={exportRevisionExcel}>⬇️ Exportar Excel</button>
          <button className="btn btn-secondary" onClick={() => setShowExportModal(true)}>🖼️ Exportar PNG</button>
          <button className="btn btn-primary" onClick={guardar}>💾 Guardar</button>
          {lastSaved && <div className="revision-header__saved">Guardado: {lastSaved}</div>}
        </div>
      </div>

      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>📊 Selecciona los gráficos a exportar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, marginBottom: 20 }}>
              {chartsList.map(chart => (
                <label key={chart.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedCharts[chart.id] || false}
                    onChange={(e) => setSelectedCharts(prev => ({ ...prev, [chart.id]: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{chart.label}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={exportSelectedCharts}>Descargar seleccionados</button>
            </div>
          </div>
        </div>
      )}

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
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 16, minHeight: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                      <td><select className="form-group" value={row.fecha || ''} onChange={e => { const next = [...matriz]; next[index] = { ...next[index], fecha: e.target.value }; updateJsonField('matriz_energetica', next); }} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}><option value="">Seleccionar mes</option>{meses.map((mes, i) => <option key={i} value={mes}>{mes}</option>)}</select></td>
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

          <div className="form-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, minHeight: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <h4 style={{ marginBottom: 16, color: '#0B7D4B', fontWeight: 700, fontSize: 15 }}>Matriz energética</h4>
              <div style={{ position: 'relative', height: 280 }}>
                <canvas id="grafico-matriz-energia" height="220"></canvas>
              </div>
              {matrizSinDatos && <div style={{ color: '#777', fontSize: 13, marginTop: 14, textAlign: 'center' }}>Agrega datos en la matriz para ver el gráfico.</div>}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, minHeight: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <h4 style={{ marginBottom: 16, color: '#0B7D4B', fontWeight: 700, fontSize: 15 }}>Matriz de costo energético</h4>
              <div style={{ position: 'relative', height: 280 }}>
                <canvas id="grafico-matriz-costo" height="220"></canvas>
              </div>
              {matrizSinDatos && <div style={{ color: '#777', fontSize: 13, marginTop: 14, textAlign: 'center' }}>Agrega datos en la matriz para ver el gráfico.</div>}
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
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, marginTop: 20, minHeight: 340, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <canvas id="grafico-pareto-electrica" height="280"></canvas>
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
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, marginTop: 20, minHeight: 340, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <canvas id="grafico-pareto-gas" height="280"></canvas>
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
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, marginTop: 20, minHeight: 340, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <canvas id="grafico-pareto-acpm" height="280"></canvas>
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
            <div style={{ background: 'linear-gradient(135deg, #f8faf9 0%, #f0f7f4 100%)', padding: 20, borderRadius: 14, marginTop: 20, minHeight: 340, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(11, 125, 75, 0.1)' }}>
              <canvas id="grafico-pareto-gasolina" height="280"></canvas>
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
