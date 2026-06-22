/* Data, research, and orientation layer for the connected workspace. */
const SCHEMA_VERSION = "3.0";
const PHASE_SECTIONS = {
  P01: [["Problem framing", "problem-framing"], ["Literature landscape", "literature"], ["Market landscape", "market-analysis"], ["Circular opportunity", "circular-opportunity"]],
  P02: [["Stakeholders", "stakeholders"], ["Interviews", "primary-research"], ["Observations", "field-observation"], ["Needs synthesis", "user-needs"]],
  P03: [["User needs", "user-needs"], ["Design inputs", "design-inputs"], ["Acceptance criteria", "acceptance-criteria"], ["Risk and traceability", "traceability"]],
  P04: [["Concept generation", "concepts"], ["Tradeoff criteria", "tradeoff-analysis"], ["Virtual screening", "virtual-evidence"], ["Selection decision", "decision"]],
  P05: [["Architecture", "architecture"], ["Materials and BOM", "bill-of-materials"], ["Engineering analysis", "engineering-analysis"], ["Design baseline", "design-control"]],
  P06: [["Build plan", "prototype-plan"], ["Build record", "prototype-build"], ["Measurements", "raw-data"], ["Design learning", "design-learning"]],
  P07: [["Verification strategy", "verification"], ["Validation strategy", "validation"], ["Test coverage", "coverage"], ["Evidence conclusion", "evidence-conclusion"]],
  P08: [["Process design", "process-design"], ["Manufacturing inputs", "manufacturing"], ["Packaging and logistics", "logistics"], ["Scale-up risk", "scale-up"]],
  P09: [["Production record", "production"], ["Quality variation", "quality"], ["Distribution", "distribution"], ["Impact update", "lifecycle-impact"]],
  P10: [["Use scenario", "use-phase"], ["Maintenance", "maintenance"], ["Service evidence", "service"], ["Life extension", "life-extension"]],
  P11: [["Recovery pathway", "recovery"], ["Disassembly", "disassembly"], ["Recycling evidence", "recycling"], ["Next generation", "design-feedback"]],
  P12: [["Evidence audit", "audit"], ["Decision history", "governance"], ["Responsible AI", "responsible-ai"], ["Project package", "submission"]]
};

const DEFAULT_RESEARCH = [
  { id: "RS-001", kind: "literature", title: "Flexible packaging recovery landscape", citation: "I2CE evidence synthesis (2026)", year: 2026, source: "Internal review", url: "", phaseId: "P01", phaseSection: "Literature landscape", owner: "Noah Williams", status: "Approved", question: "Which recovery constraints should shape the design boundary?", method: "Structured review of technical reports, policy sources, and recovery guidance.", findings: "Material ambiguity, incompatible barriers, and contamination are the primary recovery constraints.", limitations: "Regional infrastructure differs and several sources use modeled yields.", strength: "Moderate", relevance: "Defines REQ-003 and REQ-004 evidence needs.", themes: ["recovery", "circularity", "materials"], workItemIds: ["WI-001", "WI-004"], requirementIds: ["REQ-003", "REQ-004"], attachmentIds: [] },
  { id: "RS-002", kind: "literature", title: "Barrier performance and circular material content", citation: "Technical evidence matrix (2026)", year: 2026, source: "Supplier and journal sources", url: "", phaseId: "P03", phaseSection: "Acceptance criteria", owner: "Priya Shah", status: "In review", question: "Can recycled content and barrier performance share one acceptance framework?", method: "Compared reported barrier and seal outcomes across material structures.", findings: "Performance depends more on coating compatibility and seal-window control than recycled content alone.", limitations: "Source test methods are not fully harmonized.", strength: "Moderate", relevance: "Supports the threshold logic for REQ-001 and REQ-002.", themes: ["barrier", "acceptance-criteria", "materials"], workItemIds: ["WI-003"], requirementIds: ["REQ-001", "REQ-002"], attachmentIds: [] },
  { id: "RS-003", kind: "market", title: "Incumbent multilayer flexible package", organization: "Category baseline", segment: "Incumbent", geography: "North America", maturity: "Commercial", priceModel: "Volume contract", strengths: "Established performance, supply availability, and filling-line compatibility.", gaps: "Limited recovery pathway and weak material transparency.", sustainability: "Lightweighting claim; limited circular feedstock.", opportunityScore: 58, source: "Market scan and supplier interviews", phaseId: "P01", phaseSection: "Market landscape", owner: "Maya Chen", status: "Approved", relevance: "Commercial and technical baseline for REQ-005.", themes: ["incumbent", "cost", "market-baseline"], workItemIds: ["WI-001", "WI-006"], requirementIds: ["REQ-005"], attachmentIds: [] },
  { id: "RS-004", kind: "market", title: "Mono-material circular package", organization: "Emerging solution class", segment: "Direct competitor", geography: "Global", maturity: "Scaling", priceModel: "Premium material conversion", strengths: "Clear recovery narrative and improving barrier performance.", gaps: "Qualification effort, price premium, and regional recovery variation.", sustainability: "Recyclability and recycled-content pathways.", opportunityScore: 82, source: "Competitor claims cross-checked with technical sources", phaseId: "P04", phaseSection: "Tradeoff criteria", owner: "Maya Chen", status: "In review", relevance: "Sets concept comparison criteria for circularity and cost.", themes: ["competitor", "recyclability", "concept-selection"], workItemIds: ["WI-006"], requirementIds: ["REQ-002", "REQ-003", "REQ-005"], attachmentIds: [] }
];

let researchKind = "literature";
let pendingFiles = [];
let pitchSlide = 0;

const PITCH_SLIDES = [
  { number: "01", kicker: "The challenge", title: "Circular product teams lose the thread between disciplines.", body: "Materials, geometry, manufacturing, environmental impact, field needs, and recovery decisions are often stored in separate tools and documents.", proof: "The result is slow iteration, weak traceability, and sustainability evidence arriving after key design choices." },
  { number: "02", kicker: "The system", title: "GENX connects the full product lifecycle.", body: "The framework links advanced material innovation, parametric product design, use-phase analysis, and end-of-life systems through LCA, MBSE, simulation, and a shared digital thread.", proof: "One architecture can support increasingly complex circular applications." },
  { number: "03", kicker: "Our responsibility", title: "This dashboard operates the Design Innovation Framework.", body: "It coordinates material research, requirements, market evidence, product design, simulation, prototype builds, manufacturing, testing, validation, and phase decisions.", proof: "Every task creates evidence that is reusable by the next phase." },
  { number: "04", kicker: "Two proving grounds", title: "Circular packaging first; sustainable healthcare next.", body: "A biodegradable bio-based bottle provides a controlled circular product system. Portable diagnostics and biosensing then test the same framework against sterility, electronics, connectivity, portability, and medical-waste constraints.", proof: "The use cases change. The evidence architecture remains consistent." },
  { number: "05", kicker: "How it works", title: "Plan → document → compare → decide.", body: "Members start from assigned work, capture structured notebook records and files, run virtual and real experiments from one protocol, and review requirements and evidence at phase gates.", proof: "No evidence object is detached from its project role." },
  { number: "06", kicker: "The outcome", title: "A scalable circular product innovation system.", body: "Students, mentors, communities, and industry partners can explore design spaces, make lifecycle-informed tradeoffs, and preserve an auditable research memory across the full product lifecycle.", proof: "Better decisions earlier, clearer collaboration, and reusable learning across projects." }
];

function asTags(value) {
  return Array.isArray(value) ? value.filter(Boolean) : String(value || "").split(",").map(tag => tag.trim()).filter(Boolean);
}

function phaseSectionOptions(phaseId, selected = "") {
  return (PHASE_SECTIONS[phaseId] || []).map(([label]) => `<option ${label === selected ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
}

function normalizeWorkspace() {
  state.schemaVersion = SCHEMA_VERSION;
  state.dataLake = state.dataLake || { namespace: "i2ce.design-innovation", projectId: "PRJ-CIRCULAR-PACKAGING", connectorStatus: "Staging ready", lastSync: "Not connected", objectStore: "Pending production connector" };
  state.attachments = state.attachments || [];
  state.research = state.research || clone(DEFAULT_RESEARCH);
  const now = `${TODAY}T12:00:00.000Z`;
  const collections = [["work_item", state.workItems], ["notebook_entry", state.notebookEntries], ["protocol", state.protocols], ["experiment_run", state.runs], ["requirement", state.requirements], ["material", state.materials], ["knowledge_record", state.knowledge], ["research_record", state.research]];
  collections.forEach(([entityType, records]) => records.forEach(record => {
    record.entityType = record.entityType || entityType;
    record.schemaVersion = SCHEMA_VERSION;
    record.createdAt = record.createdAt || now;
    record.updatedAt = record.updatedAt || now;
    record.sourceType = record.sourceType || "workspace-entry";
    record.provenance = record.provenance || { capturedBy: record.owner || record.operator || CURRENT_USER, capturedAt: record.date || TODAY, method: "Human-entered; review required" };
    record.attachmentIds = record.attachmentIds || [];
    record.manualTags = record.manualTags || asTags(record.tags);
    record.autoTags = generateAutoTags(record);
    record.tags = [...new Set([...record.manualTags, ...record.autoTags])];
    if (record.phaseId && !record.phaseSection) record.phaseSection = (PHASE_SECTIONS[record.phaseId] || [])[0]?.[0] || "General";
  }));
}

function generateAutoTags(record) {
  const phaseTag = record.phaseId ? `phase:${record.phaseId.toLowerCase()}` : "";
  const sectionTag = record.phaseSection ? `section:${record.phaseSection.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : "";
  const text = `${record.title || ""} ${record.objective || ""} ${record.findings || ""} ${record.results || ""}`.toLowerCase();
  const keywords = ["market", "literature", "supplier", "carbon", "recovery", "barrier", "cost", "risk", "prototype", "verification"].filter(word => text.includes(word));
  return [...new Set([record.entityType ? `type:${record.entityType}` : "", phaseTag, sectionTag, record.mode ? `mode:${record.mode}` : "", record.kind ? `research:${record.kind}` : "", ...(record.requirementIds || []).map(id => `requirement:${id.toLowerCase()}`), ...(record.materialIds || []).map(id => `material:${id.toLowerCase()}`), ...keywords].filter(Boolean))];
}

normalizeWorkspace();
localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

const baseRenderNotebook = renderNotebook;
renderNotebook = function() {
  baseRenderNotebook();
  renderNotebookEnhancements();
};

const baseRenderPhases = renderPhases;
renderPhases = function() {
  baseRenderPhases();
  renderPhaseSections();
};

const baseOpenDrawer = openDrawer;
openDrawer = function(workId) {
  baseOpenDrawer(workId);
  const work = workById(workId);
  if (!work) return;
  const phase = phaseById(work.phaseId);
  const next = PHASES[phase.number];
  const body = el("workDrawer").querySelector(".drawer-body");
  const section = document.createElement("section");
  section.className = "drawer-section task-role-section";
  section.innerHTML = `<h3>Role in the project system</h3><div class="task-role-flow"><div><span>Upstream inputs</span><strong>${escapeHtml(work.requirementIds.join(", ") || "Project context and research")}</strong></div><i>→</i><div class="current"><span>This task creates</span><strong>${escapeHtml(phase.outputs[0])}</strong></div><i>→</i><div><span>Downstream use</span><strong>${escapeHtml(next?.title || "Auditable project package")}</strong></div></div>`;
  body?.prepend(section);
};

const baseSetView = setView;
setView = function(view) {
  baseSetView(view);
  const labels = { research: "Research intelligence", map: "Project map" };
  if (labels[view]) el("breadcrumbView").textContent = labels[view];
  if (view === "research") renderResearch();
  if (view === "map") renderProjectMap();
};

const baseRenderAll = renderAll;
renderAll = function() {
  normalizeWorkspace();
  baseRenderAll();
  renderEnhancementChrome();
  renderResearch();
  renderProjectMap();
  renderPitchDeck();
};

function renderPitchDeck() {
  const slide = PITCH_SLIDES[pitchSlide];
  el("pitchDeckContent").innerHTML = `<div class="pitch-slide"><div class="pitch-slide-number">${slide.number}</div><div class="pitch-slide-copy"><span class="eyebrow">${escapeHtml(slide.kicker)}</span><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.body)}</p><footer>${escapeHtml(slide.proof)}</footer></div></div>`;
  el("pitchDots").innerHTML = PITCH_SLIDES.map((item, index) => `<button class="${index === pitchSlide ? "active" : ""}" data-pitch-dot="${index}" aria-label="Open pitch slide ${index + 1}">${item.number}</button>`).join("");
  el("pitchCounter").textContent = `${String(pitchSlide + 1).padStart(2, "0")} / ${String(PITCH_SLIDES.length).padStart(2, "0")}`;
}

function movePitch(direction) {
  pitchSlide = (pitchSlide + direction + PITCH_SLIDES.length) % PITCH_SLIDES.length;
  renderPitchDeck();
}

function renderEnhancementChrome() {
  el("researchNavCount").textContent = state.research.length;
  el("lakeStatusLabel").textContent = `${state.dataLake.connectorStatus} · ${state.attachments.length} files`;
}

function renderNotebookEnhancements() {
  const staged = state.attachments.filter(file => file.storageStatus !== "Synced").length;
  const tagged = state.notebookEntries.filter(entry => entry.autoTags?.length).length;
  el("notebookIntakeStrip").innerHTML = `<div><span class="eyebrow">Data intake</span><strong>Structured, tagged, and ready for downstream use</strong></div><div class="intake-stat"><b>${tagged}/${state.notebookEntries.length}</b><span>entries autotagged</span></div><div class="intake-stat"><b>${state.attachments.length}</b><span>file records</span></div><div class="intake-stat"><b>${staged}</b><span>awaiting lake sync</span></div><button class="button secondary small" data-new-entry-work="">Capture data</button>`;
  const entry = state.notebookEntries.find(item => item.id === selectedEntryId);
  if (!entry) return;
  const preview = el("notebookPreview");
  preview.querySelector(".entry-data-context")?.remove();
  const tags = [...new Set([...(entry.autoTags || []), ...(entry.manualTags || [])])];
  const files = state.attachments.filter(file => entry.attachmentIds?.includes(file.id));
  const context = document.createElement("section");
  context.className = "entry-data-context";
  context.innerHTML = `<div><span class="eyebrow">Data-lake identity</span><strong>${entry.entityType} · schema ${entry.schemaVersion}</strong><small>${escapeHtml(entry.phaseSection || "General")} · ${escapeHtml(entry.provenance?.method || "Human-entered")}</small></div><div class="tag-cloud">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>${files.length ? `<div class="file-grid">${files.map(file => `<div class="file-chip"><b>${escapeHtml(file.name)}</b><small>${formatBytes(file.size)} · ${escapeHtml(file.storageStatus)}</small></div>`).join("")}</div>` : ""}`;
  preview.querySelector(".entry-footer")?.before(context);
}

function renderPhaseSections() {
  const phase = phaseById(selectedPhaseId);
  const sections = PHASE_SECTIONS[phase.id] || [];
  el("phaseSections").innerHTML = sections.map(([label, tag], index) => {
    const entries = state.notebookEntries.filter(item => item.phaseId === phase.id && item.phaseSection === label);
    const research = state.research.filter(item => item.phaseId === phase.id && item.phaseSection === label);
    return `<button class="phase-section-card" data-create-section="${escapeHtml(label)}" data-phase="${phase.id}"><span class="section-index">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(label)}</strong><small>${entries.length + research.length} records · #${tag}</small><span>Create record +</span></button>`;
  }).join("");
}

function renderResearch() {
  const records = state.research.filter(item => item.kind === researchKind);
  el("researchTabs").querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.researchKind === researchKind));
  const linked = records.filter(item => item.workItemIds?.length && item.requirementIds?.length).length;
  const approved = records.filter(item => item.status === "Approved").length;
  el("researchMetrics").innerHTML = [[records.length, `${researchKind === "literature" ? "Sources" : "Market records"}`], [approved, "Approved evidence"], [linked, "Fully connected"], [new Set(records.flatMap(item => item.themes || [])).size, "Themes"]].map(([value, label]) => `<div class="metric-card"><span class="metric-label">${label}</span><strong class="metric-value">${value}</strong></div>`).join("");
  const literatureHead = `<tr><th>Source and question</th><th>Finding</th><th>Evidence</th><th>Connections</th><th>Status</th></tr>`;
  const marketHead = `<tr><th>Solution</th><th>Segment</th><th>Strengths / gaps</th><th>Opportunity</th><th>Status</th></tr>`;
  const rows = records.map(item => researchKind === "literature" ? `<tr data-edit-research="${item.id}"><td class="table-title"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.citation || item.source)} · ${item.year || "n.d."}<br>${escapeHtml(item.question)}</small></td><td>${escapeHtml(item.findings)}</td><td><span class="badge neutral">${escapeHtml(item.strength)}</span><br><small>${escapeHtml(item.limitations)}</small></td><td>${item.phaseId}<br><small>${(item.requirementIds || []).join(", ") || "Project-wide"}</small></td><td><span class="badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td></tr>` : `<tr data-edit-research="${item.id}"><td class="table-title"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.organization)} · ${escapeHtml(item.geography)}</small></td><td>${escapeHtml(item.segment)}<br><small>${escapeHtml(item.maturity)}</small></td><td><b>+</b> ${escapeHtml(item.strengths)}<br><small><b>Gap</b> ${escapeHtml(item.gaps)}</small></td><td><span class="opportunity-score">${item.opportunityScore || 0}</span><br><small>${escapeHtml(item.priceModel)}</small></td><td><span class="badge ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td></tr>`).join("");
  el("researchTablePanel").innerHTML = `<div class="panel-heading"><div><span class="eyebrow">${researchKind === "literature" ? "Evidence extraction matrix" : "Comparable market landscape"}</span><h2>${researchKind === "literature" ? "Literature review" : "Market analysis"}</h2></div><span class="badge neutral">Click a row to edit</span></div><div class="data-table-wrap"><table class="data-table research-table"><thead>${researchKind === "literature" ? literatureHead : marketHead}</thead><tbody>${rows || `<tr><td colspan="5">${empty("No records yet")}</td></tr>`}</tbody></table></div>`;
  const themes = [...new Set(records.flatMap(item => item.themes || []))];
  el("researchSynthesis").innerHTML = `<div class="panel-heading"><div><span class="eyebrow">Synthesis</span><h2>Decision themes</h2></div></div><div class="theme-list">${themes.map(theme => { const count = records.filter(item => item.themes?.includes(theme)).length; return `<div><span>${escapeHtml(theme)}</span><b style="--width:${Math.max(18, count / Math.max(records.length, 1) * 100)}%"></b><strong>${count}</strong></div>`; }).join("")}</div>`;
  const phaseCounts = PHASES.map(phase => [phase, records.filter(item => item.phaseId === phase.id).length]).filter(([, count]) => count);
  el("researchCoverage").innerHTML = `<div class="panel-heading"><div><span class="eyebrow">Research to work</span><h2>Phase coverage</h2></div></div><div class="coverage-list">${phaseCounts.map(([phase, count]) => `<button data-open-phase="${phase.id}"><span>${phase.id} · ${escapeHtml(phase.title)}</span><strong>${count}</strong></button>`).join("") || empty("No phase links")}</div>`;
}

function renderProjectMap() {
  const nodes = [
    ["Need", "P01", state.research.filter(r => r.phaseId === "P01").length], ["Research", "research", state.research.length], ["Requirements", "P03", state.requirements.length], ["Concept", "P04", state.workItems.filter(w => w.phaseId === "P04").length], ["Build", "P06", state.runs.filter(r => r.mode === "real").length], ["Evidence", "P07", state.notebookEntries.filter(e => e.status === "Signed").length], ["Lifecycle", "P11", state.materials.length], ["Gate", "P12", state.gateDecisions.length]
  ];
  el("projectNavigationMap").innerHTML = `<div class="panel-heading"><div><span class="eyebrow">Live navigation map</span><h2>${escapeHtml(state.project.name)}</h2></div><span class="badge success">${escapeHtml(state.project.health)}</span></div><div class="scope-map">${nodes.map(([label, target, count], index) => `<button ${target === "research" ? 'data-jump="research"' : `data-open-phase="${target}"`} class="scope-node ${target === state.project.currentPhase ? "current" : ""}"><i>${String(index + 1).padStart(2, "0")}</i><strong>${label}</strong><span>${count} records</span></button>${index < nodes.length - 1 ? '<span class="scope-arrow">→</span>' : ""}`).join("")}</div>`;
  const signed = state.notebookEntries.filter(e => e.status === "Signed").length;
  const virtual = state.runs.filter(r => r.mode === "virtual").length;
  const real = state.runs.filter(r => r.mode === "real").length;
  const covered = state.requirements.filter(req => requirementEvidence(req.id).length).length;
  const phaseBars = PHASES.map((phase, index) => { const count = state.workItems.filter(w => w.phaseId === phase.id).length + state.notebookEntries.filter(e => e.phaseId === phase.id).length + state.research.filter(r => r.phaseId === phase.id).length; return `<button data-open-phase="${phase.id}" style="--angle:${index * 30}deg;--size:${24 + Math.min(count, 8) * 6}px" title="${escapeHtml(phase.title)}: ${count} records"><span>${phase.number}</span></button>`; }).join("");
  el("projectVisuals").innerHTML = `<article class="panel visual-card"><div class="visual-title"><span class="eyebrow">Key image 01</span><h2>Evidence composition</h2></div><div class="donut-wrap"><div class="evidence-donut" style="--signed:${signed * 22}deg;--virtual:${virtual * 28}deg"><strong>${signed + virtual + real}</strong><span>evidence objects</span></div><div class="visual-legend"><span><i class="signed"></i>Signed notebook ${signed}</span><span><i class="virtual"></i>Virtual runs ${virtual}</span><span><i class="real"></i>Real runs ${real}</span></div></div></article><article class="panel visual-card"><div class="visual-title"><span class="eyebrow">Key image 02</span><h2>Phase activity orbit</h2></div><div class="phase-orbit"><div class="orbit-core">Project<span>12 phases</span></div>${phaseBars}</div></article><article class="panel visual-card"><div class="visual-title"><span class="eyebrow">Key image 03</span><h2>Requirement coverage</h2></div><div class="coverage-gauge" style="--coverage:${covered / Math.max(state.requirements.length, 1) * 360}deg"><strong>${covered}/${state.requirements.length}</strong><span>requirements with evidence</span></div><div class="coverage-chips">${state.requirements.map(req => `<span class="${requirementEvidence(req.id).length ? "covered" : ""}">${req.id}</span>`).join("")}</div></article>`;
  const tasks = [...state.workItems].sort((a, b) => a.due.localeCompare(b.due));
  el("mapTaskList").innerHTML = `<div class="panel-heading"><div><span class="eyebrow">Task role in the system</span><h2>Inputs, output, and downstream use</h2></div></div><div class="role-grid">${tasks.map(task => { const phase = phaseById(task.phaseId); const next = PHASES[phase.number]; return `<button data-open-work="${task.id}"><span class="role-id">${task.id} · ${phase.id}</span><strong>${escapeHtml(task.title)}</strong><small><b>Uses</b> ${task.requirementIds.join(", ") || "project context"}</small><small><b>Creates</b> ${escapeHtml(phase.outputs[0])}</small><small><b>Feeds</b> ${next ? escapeHtml(next.title) : "project package"}</small></button>`; }).join("")}</div>`;
}

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function simpleChecksum(file) {
  const value = `${file.name}:${file.size}:${file.lastModified}`;
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  return `meta-${Math.abs(hash).toString(16)}`;
}

function stageFiles(fileList, entityId, phaseId, tags) {
  return [...fileList].map(file => {
    const record = { id: nextId("FILE", [...state.attachments, ...pendingFiles]), entityType: "attachment", schemaVersion: SCHEMA_VERSION, name: file.name, type: file.type || "application/octet-stream", size: file.size, lastModified: new Date(file.lastModified).toISOString(), checksum: simpleChecksum(file), entityId, phaseId, tags, uploadedBy: CURRENT_USER, uploadedAt: new Date().toISOString(), storageStatus: "Staged for data lake", objectKey: `${state.dataLake.projectId}/${phaseId}/${entityId}/${file.name.replace(/[^a-zA-Z0-9._-]+/g, "-")}` };
    pendingFiles.push(record);
    return record;
  });
}

openEntryModal = function(entry = null, defaults = {}) {
  pendingFiles = [];
  const item = entry || { id: "", title: "", type: defaults.type || "Work session", workItemId: defaults.workItemId || "", phaseId: defaults.phaseId || state.project.currentPhase, phaseSection: defaults.phaseSection || (PHASE_SECTIONS[defaults.phaseId || state.project.currentPhase]?.[0]?.[0]), protocolId: defaults.protocolId || "", runId: defaults.runId || "", mode: defaults.mode || "combined", owner: CURRENT_USER, date: TODAY, status: "Draft", objective: "", method: "", observations: "", results: "", interpretation: "", nextAction: "", manualTags: [], requirementIds: [], materialIds: [], attachmentIds: [] };
  const manualTags = item.manualTags || asTags(item.tags).filter(tag => !tag.includes(":"));
  openModal("Structured data capture", entry ? `Edit ${entry.id}` : "New notebook entry", `<form class="form-grid" id="entryForm"><div class="field full"><label for="entryTitle">Entry title</label><input id="entryTitle" value="${escapeHtml(item.title)}" required></div><div class="field"><label for="entryType">Record type</label><select id="entryType">${["Work session","Plan","Observation","Analysis","Meeting note","Decision","Experiment result"].map(value => `<option ${value === item.type ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label for="entryStatus">State</label><select id="entryStatus"><option ${item.status === "Draft" ? "selected" : ""}>Draft</option><option ${item.status === "Signed" ? "selected" : ""}>Signed</option></select></div><div class="form-divider">Connected context</div><div class="field"><label for="entryWork">Work item</label><select id="entryWork">${optionList(state.workItems, item.workItemId, work => `${work.id} · ${work.title}`, "Project-wide entry")}</select></div><div class="field"><label for="entryPhase">Phase</label><select id="entryPhase">${phaseOptions(item.phaseId)}</select></div><div class="field"><label for="entrySection">Phase section</label><select id="entrySection">${phaseSectionOptions(item.phaseId, item.phaseSection)}</select></div><div class="field"><label for="entryMode">Evidence mode</label><select id="entryMode">${["virtual","real","combined"].map(value => `<option ${value === item.mode ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label for="entryProtocol">Protocol</label><select id="entryProtocol">${optionList(state.protocols, item.protocolId, protocol => `${protocol.id} v${protocol.version} · ${protocol.title}`)}</select></div><div class="field"><label for="entryRun">Experiment run</label><select id="entryRun">${optionList(state.runs, item.runId, run => `${run.id} · ${run.mode} · ${run.result}`)}</select></div><div class="field"><label for="entryDate">Date</label><input id="entryDate" type="date" value="${item.date}" required></div><div class="field"><label for="entryRequirements">Requirement IDs</label><input id="entryRequirements" value="${escapeHtml(item.requirementIds.join(", "))}" placeholder="REQ-001, REQ-002"></div><div class="field full"><label for="entryMaterials">Material IDs</label><input id="entryMaterials" value="${escapeHtml(item.materialIds.join(", "))}" placeholder="MAT-001, MAT-002"></div><div class="form-divider">Notebook record</div>${[["Objective","entryObjective",item.objective],["Method / protocol","entryMethod",item.method],["Observations / raw data","entryObservations",item.observations],["Results","entryResults",item.results],["Interpretation","entryInterpretation",item.interpretation],["Next action","entryNext",item.nextAction]].map(field => `<div class="field full"><label for="${field[1]}">${field[0]}</label><textarea id="${field[1]}" ${field[0] === "Objective" ? "required" : ""}>${escapeHtml(field[2])}</textarea></div>`).join("")}<div class="form-divider">Files, provenance, and tags</div><div class="field full upload-field"><label for="entryFiles">Upload files</label><input id="entryFiles" type="file" multiple><span class="field-help">File metadata, checksum, relationships, and object-store key are staged now. Production deployment must stream binary content to governed object storage.</span><div id="pendingFileList" class="pending-files"></div></div><div class="field full"><label for="entryTags">Manual tags</label><input id="entryTags" value="${escapeHtml(manualTags.join(", "))}" placeholder="baseline, supplier, decision"><div id="suggestedTags" class="tag-cloud"></div></div><div class="modal-actions"><button type="button" class="button secondary" data-cancel-modal>Cancel</button><button type="submit" class="button primary">${item.status === "Signed" ? "Save signed entry" : "Save entry"}</button></div></form>`);
  const updateTags = () => { const draft = { entityType: "notebook_entry", phaseId: el("entryPhase").value, phaseSection: el("entrySection").value, mode: el("entryMode").value, title: el("entryTitle").value, objective: el("entryObjective").value, requirementIds: splitIds(el("entryRequirements").value), materialIds: splitIds(el("entryMaterials").value) }; el("suggestedTags").innerHTML = `<small>Generated tags</small>${generateAutoTags(draft).map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}`; };
  el("entryPhase").onchange = () => { el("entrySection").innerHTML = phaseSectionOptions(el("entryPhase").value); updateTags(); };
  el("entryWork").onchange = event => { const work = workById(event.target.value); if (!work) return; el("entryPhase").value = work.phaseId; el("entrySection").innerHTML = phaseSectionOptions(work.phaseId); el("entryProtocol").value = work.protocolIds[0] || ""; el("entryRequirements").value = work.requirementIds.join(", "); el("entryMaterials").value = work.materialIds.join(", "); updateTags(); };
  ["entryTitle","entryObjective","entrySection","entryMode","entryRequirements","entryMaterials"].forEach(id => el(id).addEventListener("input", updateTags));
  el("entryFiles").onchange = event => { pendingFiles = []; const tags = generateAutoTags({ entityType: "attachment", phaseId: el("entryPhase").value, phaseSection: el("entrySection").value }); stageFiles(event.target.files, item.id || "pending-entry", el("entryPhase").value, tags); el("pendingFileList").innerHTML = pendingFiles.map(file => `<div><strong>${escapeHtml(file.name)}</strong><span>${formatBytes(file.size)} · ${file.checksum}</span></div>`).join(""); };
  updateTags();
  el("entryForm").onsubmit = event => { event.preventDefault(); const id = item.id || nextId("NB", state.notebookEntries); pendingFiles.forEach(file => { file.entityId = id; file.objectKey = file.objectKey.replace("pending-entry", id); }); const data = { ...item, id, entityType: "notebook_entry", schemaVersion: SCHEMA_VERSION, title: el("entryTitle").value.trim(), type: el("entryType").value, workItemId: el("entryWork").value, phaseId: el("entryPhase").value, phaseSection: el("entrySection").value, protocolId: el("entryProtocol").value, runId: el("entryRun").value, mode: el("entryMode").value, owner: item.owner || CURRENT_USER, date: el("entryDate").value, status: el("entryStatus").value, objective: el("entryObjective").value.trim(), method: el("entryMethod").value.trim(), observations: el("entryObservations").value.trim(), results: el("entryResults").value.trim(), interpretation: el("entryInterpretation").value.trim(), nextAction: el("entryNext").value.trim(), manualTags: splitIds(el("entryTags").value), requirementIds: splitIds(el("entryRequirements").value), materialIds: splitIds(el("entryMaterials").value), attachmentIds: [...new Set([...(item.attachmentIds || []), ...pendingFiles.map(file => file.id)])], updatedAt: new Date().toISOString(), provenance: { capturedBy: item.owner || CURRENT_USER, capturedAt: el("entryDate").value, method: "Human-entered; generated tags require review" } }; data.autoTags = generateAutoTags(data); data.tags = [...new Set([...data.manualTags, ...data.autoTags])]; const index = state.notebookEntries.findIndex(value => value.id === id); if (index >= 0) state.notebookEntries[index] = data; else state.notebookEntries.unshift(data); state.attachments.push(...pendingFiles); const work = workById(data.workItemId); if (work) work.progress = Math.max(work.progress, data.status === "Signed" ? 85 : 25); const run = state.runs.find(value => value.id === data.runId); if (run) run.entryId = id; selectedEntryId = id; state.activity.unshift({ id: nextId("ACT", state.activity), text: `${id} ${data.status === "Signed" ? "signed" : "updated"}`, detail: `${data.title} · ${data.attachmentIds.length} files · ${data.tags.length} tags`, date: data.date, workItemId: data.workItemId }); closeModal(); saveState("Notebook record saved with provenance, tags, and file links"); };
};

function openResearchModal(record = null, defaults = {}) {
  pendingFiles = [];
  const kind = record?.kind || defaults.kind || researchKind;
  const item = record || { id: "", kind, title: "", phaseId: defaults.phaseId || state.project.currentPhase, phaseSection: defaults.phaseSection || PHASE_SECTIONS[defaults.phaseId || state.project.currentPhase]?.[0]?.[0], owner: CURRENT_USER, status: "Draft", themes: [], workItemIds: [], requirementIds: [], attachmentIds: [] };
  const shared = `<div class="field full"><label for="researchTitle">Title</label><input id="researchTitle" value="${escapeHtml(item.title)}" required></div><div class="field"><label for="researchPhase">Phase</label><select id="researchPhase">${phaseOptions(item.phaseId)}</select></div><div class="field"><label for="researchSection">Phase section</label><select id="researchSection">${phaseSectionOptions(item.phaseId, item.phaseSection)}</select></div><div class="field"><label for="researchStatus">Status</label><select id="researchStatus">${["Draft","In review","Approved"].map(value => `<option ${value === item.status ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label for="researchThemes">Themes</label><input id="researchThemes" value="${escapeHtml((item.themes || []).join(", "))}" placeholder="cost, recovery, usability"></div>`;
  const literature = `<div class="field full"><label for="researchCitation">Citation</label><input id="researchCitation" value="${escapeHtml(item.citation || "")}" placeholder="Authors. Title. Source. Year."></div><div class="field"><label for="researchYear">Year</label><input id="researchYear" type="number" value="${item.year || 2026}"></div><div class="field"><label for="researchSource">Source / database</label><input id="researchSource" value="${escapeHtml(item.source || "")}"></div><div class="field full"><label for="researchQuestion">Research question</label><textarea id="researchQuestion">${escapeHtml(item.question || "")}</textarea></div><div class="field full"><label for="researchMethod">Methods / context</label><textarea id="researchMethod">${escapeHtml(item.method || "")}</textarea></div><div class="field full"><label for="researchFindings">Key findings</label><textarea id="researchFindings" required>${escapeHtml(item.findings || "")}</textarea></div><div class="field full"><label for="researchLimitations">Limitations</label><textarea id="researchLimitations">${escapeHtml(item.limitations || "")}</textarea></div><div class="field"><label for="researchStrength">Evidence strength</label><select id="researchStrength">${["Low","Moderate","High"].map(value => `<option ${value === item.strength ? "selected" : ""}>${value}</option>`).join("")}</select></div>`;
  const market = `<div class="field"><label for="researchOrganization">Organization / solution class</label><input id="researchOrganization" value="${escapeHtml(item.organization || "")}"></div><div class="field"><label for="researchSegment">Segment</label><input id="researchSegment" value="${escapeHtml(item.segment || "")}" placeholder="Competitor, substitute, incumbent"></div><div class="field"><label for="researchGeography">Geography</label><input id="researchGeography" value="${escapeHtml(item.geography || "")}"></div><div class="field"><label for="researchMaturity">Maturity</label><input id="researchMaturity" value="${escapeHtml(item.maturity || "")}"></div><div class="field full"><label for="researchStrengths">Strengths</label><textarea id="researchStrengths">${escapeHtml(item.strengths || "")}</textarea></div><div class="field full"><label for="researchGaps">Gaps / unmet needs</label><textarea id="researchGaps" required>${escapeHtml(item.gaps || "")}</textarea></div><div class="field"><label for="researchScore">Opportunity score (0-100)</label><input id="researchScore" type="number" min="0" max="100" value="${item.opportunityScore || 50}"></div><div class="field"><label for="researchPrice">Price / business model</label><input id="researchPrice" value="${escapeHtml(item.priceModel || "")}"></div>`;
  openModal(kind === "literature" ? "Literature extraction" : "Market intelligence", record ? `Edit ${record.id}` : `New ${kind} record`, `<form class="form-grid" id="researchForm">${shared}${kind === "literature" ? literature : market}<div class="field full"><label for="researchRelevance">Project relevance / decision affected</label><textarea id="researchRelevance" required>${escapeHtml(item.relevance || "")}</textarea></div><div class="field"><label for="researchWork">Work item IDs</label><input id="researchWork" value="${escapeHtml((item.workItemIds || []).join(", "))}"></div><div class="field"><label for="researchRequirements">Requirement IDs</label><input id="researchRequirements" value="${escapeHtml((item.requirementIds || []).join(", "))}"></div><div class="field full upload-field"><label for="researchFiles">Source files</label><input id="researchFiles" type="file" multiple><div id="pendingFileList" class="pending-files"></div></div><div class="modal-actions"><button type="button" class="button secondary" data-cancel-modal>Cancel</button><button type="submit" class="button primary">Save research record</button></div></form>`);
  el("researchPhase").onchange = () => { el("researchSection").innerHTML = phaseSectionOptions(el("researchPhase").value); };
  el("researchFiles").onchange = event => { pendingFiles = []; stageFiles(event.target.files, item.id || "pending-research", el("researchPhase").value, [`research:${kind}`]); el("pendingFileList").innerHTML = pendingFiles.map(file => `<div><strong>${escapeHtml(file.name)}</strong><span>${formatBytes(file.size)}</span></div>`).join(""); };
  el("researchForm").onsubmit = event => { event.preventDefault(); const id = item.id || nextId("RS", state.research); const data = { ...item, id, kind, entityType: "research_record", schemaVersion: SCHEMA_VERSION, title: el("researchTitle").value.trim(), phaseId: el("researchPhase").value, phaseSection: el("researchSection").value, status: el("researchStatus").value, owner: item.owner || CURRENT_USER, themes: splitIds(el("researchThemes").value), relevance: el("researchRelevance").value.trim(), workItemIds: splitIds(el("researchWork").value), requirementIds: splitIds(el("researchRequirements").value), attachmentIds: [...new Set([...(item.attachmentIds || []), ...pendingFiles.map(file => file.id)])], updatedAt: new Date().toISOString(), provenance: { capturedBy: CURRENT_USER, capturedAt: TODAY, method: kind === "literature" ? "Structured evidence extraction" : "Structured market comparison" } }; if (kind === "literature") Object.assign(data, { citation: el("researchCitation").value.trim(), year: Number(el("researchYear").value), source: el("researchSource").value.trim(), question: el("researchQuestion").value.trim(), method: el("researchMethod").value.trim(), findings: el("researchFindings").value.trim(), limitations: el("researchLimitations").value.trim(), strength: el("researchStrength").value }); else Object.assign(data, { organization: el("researchOrganization").value.trim(), segment: el("researchSegment").value.trim(), geography: el("researchGeography").value.trim(), maturity: el("researchMaturity").value.trim(), strengths: el("researchStrengths").value.trim(), gaps: el("researchGaps").value.trim(), opportunityScore: Number(el("researchScore").value), priceModel: el("researchPrice").value.trim() }); data.autoTags = generateAutoTags(data); data.manualTags = data.themes; data.tags = [...new Set([...data.themes, ...data.autoTags])]; pendingFiles.forEach(file => { file.entityId = id; file.objectKey = file.objectKey.replace("pending-research", id); }); state.attachments.push(...pendingFiles); const index = state.research.findIndex(value => value.id === id); if (index >= 0) state.research[index] = data; else state.research.unshift(data); closeModal(); saveState("Research evidence saved and connected to project decisions"); };
}

function exportLakePackage() {
  normalizeWorkspace();
  const collections = [state.workItems, state.notebookEntries, state.protocols, state.runs, state.requirements, state.materials, state.knowledge, state.research, state.attachments];
  const objects = collections.flat().map(record => ({ entity_id: record.id, entity_type: record.entityType, schema_version: SCHEMA_VERSION, project_id: state.dataLake.projectId, phase_id: record.phaseId || null, phase_section: record.phaseSection || null, tags: record.tags || [], relationships: { work_items: record.workItemIds || (record.workItemId ? [record.workItemId] : []), requirements: record.requirementIds || [], materials: record.materialIds || [], attachments: record.attachmentIds || [] }, provenance: record.provenance || { capturedBy: record.owner || CURRENT_USER }, payload: record }));
  const payload = { manifest: { schemaVersion: SCHEMA_VERSION, namespace: state.dataLake.namespace, projectId: state.dataLake.projectId, exportedAt: new Date().toISOString(), objectCount: objects.length, binaryFilesIncluded: false, note: "Attachment metadata and object keys are included; binaries require the production object-storage connector." }, objects };
  downloadJson(payload, `${state.dataLake.projectId.toLowerCase()}-data-lake-package.json`);
  showToast(`${objects.length} typed objects packaged for data-lake ingestion`);
}

function downloadJson(payload, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}

document.addEventListener("click", event => {
  const tab = event.target.closest("[data-research-kind]"); if (tab) { researchKind = tab.dataset.researchKind; renderResearch(); }
  const research = event.target.closest("[data-edit-research]"); if (research) openResearchModal(state.research.find(item => item.id === research.dataset.editResearch));
  const section = event.target.closest("[data-create-section]"); if (section) openEntryModal(null, { phaseId: section.dataset.phase, phaseSection: section.dataset.createSection, type: "Analysis" });
  if (event.target.closest("[data-pitch-prev]")) movePitch(-1);
  if (event.target.closest("[data-pitch-next]")) movePitch(1);
  const pitchDot = event.target.closest("[data-pitch-dot]"); if (pitchDot) { pitchSlide = Number(pitchDot.dataset.pitchDot); renderPitchDeck(); }
  if (event.target.closest("[data-open-market-research]")) { researchKind = "market"; setView("research"); renderResearch(); }
});
el("addResearchAction").onclick = () => openResearchModal(null, { kind: researchKind });
el("exportLakePackage").onclick = exportLakePackage;
el("mapCurrentPhase").onclick = () => { selectedPhaseId = state.project.currentPhase; setView("phases"); };

renderAll();
