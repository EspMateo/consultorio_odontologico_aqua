import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { buildApiUrl } from '../config';

// AQUA palette
const C = {
  cyan:      [6,   182, 212],
  navy:      [15,  23,  42 ],
  lightCyan: [224, 242, 254],
  slate:     [71,  85,  105],
  dark:      [30,  41,  59 ],
  white:     [255, 255, 255],
  gray:      [248, 250, 252],
};

const PAGE_W  = 210;
const MARGIN  = 14;
const CONTENT = PAGE_W - MARGIN * 2;

function addPageHeader(doc) {
  doc.setFillColor(...C.cyan);
  doc.rect(0, 0, PAGE_W, 14, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text('CONSULTORIO ODONTOLÓGICO AQUA', MARGIN, 9.5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, PAGE_W - MARGIN, 9.5, { align: 'right' });
}

function addFooter(doc) {
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.lightCyan);
    doc.rect(0, 289, PAGE_W, 8, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.slate);
    doc.text('Consultorio Odontológico AQUA — Documento confidencial', MARGIN, 294);
    doc.text(`Pág. ${i} / ${total}`, PAGE_W - MARGIN, 294, { align: 'right' });
  }
}

function sectionHeader(doc, title, y) {
  doc.setFillColor(...C.navy);
  doc.rect(MARGIN, y, CONTENT, 7, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(MARGIN, y, 3, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.white);
  doc.text(title.toUpperCase(), MARGIN + 6, y + 5);
  return y + 10;
}

function checkPage(doc, y, needed) {
  if (y + needed > 283) {
    doc.addPage();
    addPageHeader(doc);
    return MARGIN + 18;
  }
  return y;
}

function emptyNote(doc, text, y) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...C.slate);
  doc.text(text, MARGIN + 4, y + 5);
  return y + 10;
}

function bool(val) {
  return val ? 'Sí' : 'No';
}

export async function generarPdfPaciente(paciente) {
  // Fetch all clinical data in parallel
  const [diagRes, tratRes, presRes, fechasRes] = await Promise.allSettled([
    axios.get(buildApiUrl(`diagnosticos/paciente/${paciente.id}`)),
    axios.get(buildApiUrl(`tratamientos/paciente/${paciente.id}`)),
    axios.get(buildApiUrl(`presupuesto/paciente/${paciente.id}`)),
    axios.get(buildApiUrl(`historia-clinica/paciente/${paciente.id}/fechas`)),
  ]);

  const diagnosticos = diagRes.status  === 'fulfilled' ? (diagRes.value.data.diagnosticos || []) : [];
  const tratamientos = tratRes.status  === 'fulfilled' ? (tratRes.value.data.tratamientos  || tratRes.value.data || []) : [];
  const presupuestos = presRes.status  === 'fulfilled' ? (presRes.value.data || []) : [];
  const fechas       = fechasRes.status === 'fulfilled' ? (fechasRes.value.data || []) : [];

  // Fetch most recent historia clínica if dates exist
  let historia = null;
  if (fechas.length > 0) {
    const ultimaFecha = fechas[0];
    try {
      const hRes = await axios.get(buildApiUrl(`historia-clinica/paciente/${paciente.id}/fecha/${ultimaFecha}`));
      historia = hRes.data;
    } catch {}
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── PAGE 1 HEADER ──────────────────────────────────────────────────────────
  addPageHeader(doc);
  let y = 20;

  // Patient card
  doc.setFillColor(...C.lightCyan);
  doc.roundedRect(MARGIN, y, CONTENT, 34, 3, 3, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT, 34, 3, 3, 'S');
  doc.setFillColor(...C.cyan);
  doc.rect(MARGIN, y, 3, 34, 'F');

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text(`${paciente.name} ${paciente.lastname}`, MARGIN + 7, y + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.slate);

  const line2 = [
    paciente.ci        ? `CI: ${paciente.ci}`          : null,
    paciente.age       ? `Edad: ${paciente.age} años`   : null,
    paciente.gender    ? `Género: ${paciente.gender}`   : null,
  ].filter(Boolean).join('   |   ');

  const line3 = [
    paciente.telephone ? `Tel: ${paciente.telephone}`   : null,
    paciente.email     ? `Email: ${paciente.email}`     : null,
  ].filter(Boolean).join('   |   ');

  doc.text(line2, MARGIN + 7, y + 17);
  if (line3) doc.text(line3, MARGIN + 7, y + 23);
  if (paciente.generalMedicalHistory)
    doc.text(`Dir: ${paciente.generalMedicalHistory}`, MARGIN + 7, y + 29);

  y += 40;

  // ── HISTORIA CLÍNICA ───────────────────────────────────────────────────────
  y = checkPage(doc, y, 40);
  y = sectionHeader(doc, `Historia Clínica${fechas.length > 0 ? ` — ${fechas[0]}` : ''}`, y);

  if (historia) {
    // Motivo consulta
    if (historia.motivoConsulta) {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.navy);
      doc.text('Motivo de consulta:', MARGIN + 2, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...C.dark);
      const lines = doc.splitTextToSize(historia.motivoConsulta, CONTENT - 4);
      doc.text(lines, MARGIN + 2, y + 9);
      y += 9 + lines.length * 4 + 3;
    }

    y = checkPage(doc, y, 35);

    // Hábitos e higiene
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Hábitos e Higiene', '']],
      body: [
        ['Cepillado dental',      historia.cepilladoDental    || '—'],
        ['Cepillado encías',      historia.cepilladoEncias    || '—'],
        ['Cepillado lingual',     historia.cepilladoLingual   || '—'],
        ['Usa hilo dental',       bool(historia.usaHiloDental)],
        ['Higiene protésica',     bool(historia.higieneProtesica)],
        ['Fumador',               bool(historia.fumador)],
        ['Consume café',          bool(historia.consumeCafe)],
        ['Consume alcohol',       bool(historia.consumeAlcohol)],
        ['Obs. higiénicas',       historia.observacionesHigienicas || '—'],
      ],
      headStyles:         { fillColor: C.cyan, textColor: C.white, fontSize: 7.5, fontStyle: 'bold' },
      bodyStyles:         { fontSize: 7.5, textColor: C.dark },
      alternateRowStyles: { fillColor: C.gray },
      columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 50 } },
      theme: 'grid',
    });
    y = doc.lastAutoTable.finalY + 5;

    y = checkPage(doc, y, 35);

    // Antecedentes médicos
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Antecedentes Médicos', '']],
      body: [
        ['Enfermedades actuales',  historia.enfermedadesActuales   || 'Ninguna'],
        ['Alergias',               historia.alergias               || 'Ninguna'],
        ['Medicamentos',           historia.medicamentos           || 'Ninguno'],
        ['Posología',              historia.posologia              || '—'],
        ['Toma bifosfonatos',      bool(historia.tomaBifosfonatos)],
        ['En tratamiento médico',  bool(historia.enTratamiento)],
        ['Antecedentes familiares',historia.antecedentesFamiliares || '—'],
      ],
      headStyles:         { fillColor: C.cyan, textColor: C.white, fontSize: 7.5, fontStyle: 'bold' },
      bodyStyles:         { fontSize: 7.5, textColor: C.dark },
      alternateRowStyles: { fillColor: C.gray },
      columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 50 } },
      theme: 'grid',
    });
    y = doc.lastAutoTable.finalY + 5;

    // Apreciación general
    if (historia.apreciacionGeneral || historia.apreciacionGeneralDetalle) {
      y = checkPage(doc, y, 20);
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: [['Apreciación General', '']],
        body: [
          ['Estado general',   historia.apreciacionGeneral        || '—'],
          ['Observaciones',    historia.apreciacionGeneralDetalle || '—'],
        ],
        headStyles:         { fillColor: C.navy, textColor: C.white, fontSize: 7.5, fontStyle: 'bold' },
        bodyStyles:         { fontSize: 7.5, textColor: C.dark },
        alternateRowStyles: { fillColor: C.gray },
        columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 50 } },
        theme: 'grid',
      });
      y = doc.lastAutoTable.finalY + 5;
    }
  } else {
    y = emptyNote(doc, 'Sin historia clínica registrada.', y);
  }

  // ── DIAGNÓSTICO ────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 35);
  y = sectionHeader(doc, 'Diagnóstico y Pronóstico', y);

  if (diagnosticos.length > 0) {
    const diag = diagnosticos[0];
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Campo', 'Contenido']],
      body: [
        ['Fecha',         diag.fechaDiagnostico || '—'],
        ['Diagnóstico',   diag.diagnostico      || '—'],
        ['Pronóstico',    diag.pronostico        || '—'],
        ['Observaciones', diag.observaciones     || '—'],
      ],
      headStyles:         { fillColor: C.cyan, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles:         { fontSize: 8, textColor: C.dark },
      alternateRowStyles: { fillColor: C.gray },
      columnStyles:       { 0: { fontStyle: 'bold', cellWidth: 38 } },
      theme: 'grid',
    });
    y = doc.lastAutoTable.finalY + 8;
  } else {
    y = emptyNote(doc, 'Sin diagnósticos registrados.', y);
  }

  // ── PLAN DE TRATAMIENTO ────────────────────────────────────────────────────
  y = checkPage(doc, y, 35);
  y = sectionHeader(doc, 'Plan de Tratamiento', y);

  if (tratamientos.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [['Nombre', 'Estado', 'Duración', 'Inicio', 'Fin']],
      body: tratamientos.map(t => [
        t.nombre      || '—',
        t.activo ? 'Activo' : 'Completado',
        t.duracion    || '—',
        t.fechaInicio || '—',
        t.fechaFin    || '—',
      ]),
      headStyles:         { fillColor: C.cyan, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
      bodyStyles:         { fontSize: 8, textColor: C.dark },
      alternateRowStyles: { fillColor: C.gray },
      theme: 'grid',
    });
    y = doc.lastAutoTable.finalY + 8;
  } else {
    y = emptyNote(doc, 'Sin tratamientos registrados.', y);
  }

  // ── PRESUPUESTO ────────────────────────────────────────────────────────────
  if (presupuestos.length > 0) {
    const pres  = presupuestos[0];
    const items = pres.tratamientos || [];

    y = checkPage(doc, y, 40);
    y = sectionHeader(doc, `Presupuesto — ${pres.fechaRegistro || ''}`, y);

    if (items.length > 0) {
      const totalCosto  = items.reduce((s, t) => s + (t.precio  || 0), 0);
      const totalPagado = items.reduce((s, t) => s + (t.abonado || 0), 0);
      const totalDeuda  = totalCosto - totalPagado;

      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: [['Tratamiento', 'Precio', 'Abonado', 'Deuda', 'Estado']],
        body: [
          ...items.map(t => [
            t.nombre || '—',
            `$${(t.precio  || 0).toLocaleString()}`,
            `$${(t.abonado || 0).toLocaleString()}`,
            `$${((t.precio || 0) - (t.abonado || 0)).toLocaleString()}`,
            t.pagado ? 'Pagado' : 'Pendiente',
          ]),
          [
            { content: 'TOTAL', styles: { fontStyle: 'bold' } },
            { content: `$${totalCosto.toLocaleString()}`,  styles: { fontStyle: 'bold' } },
            { content: `$${totalPagado.toLocaleString()}`, styles: { fontStyle: 'bold' } },
            { content: `$${totalDeuda.toLocaleString()}`,  styles: { fontStyle: 'bold', textColor: totalDeuda > 0 ? [220, 38, 38] : [5, 150, 105] } },
            '',
          ],
        ],
        headStyles:         { fillColor: C.cyan, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
        bodyStyles:         { fontSize: 8, textColor: C.dark },
        alternateRowStyles: { fillColor: C.gray },
        theme: 'grid',
      });
      y = doc.lastAutoTable.finalY + 8;
    } else {
      y = emptyNote(doc, 'Presupuesto sin ítems.', y);
    }

    if (presupuestos.length > 1) {
      y = checkPage(doc, y, 25);
      y = sectionHeader(doc, 'Presupuestos Anteriores', y);
      autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN },
        head: [['Fecha', 'Nº ítems', 'Total']],
        body: presupuestos.slice(1).map(p => {
          const it  = p.tratamientos || [];
          const tot = it.reduce((s, t) => s + (t.precio || 0), 0);
          return [p.fechaRegistro || '—', it.length, `$${tot.toLocaleString()}`];
        }),
        headStyles:         { fillColor: C.navy, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
        bodyStyles:         { fontSize: 8, textColor: C.dark },
        alternateRowStyles: { fillColor: C.gray },
        theme: 'grid',
      });
      y = doc.lastAutoTable.finalY + 8;
    }
  } else {
    y = checkPage(doc, y, 20);
    y = sectionHeader(doc, 'Presupuesto', y);
    y = emptyNote(doc, 'Sin presupuesto registrado.', y);
  }

  addFooter(doc);

  const filename = `Expediente_${paciente.name}_${paciente.lastname}_${paciente.ci || paciente.id}.pdf`;
  doc.save(filename);
}
