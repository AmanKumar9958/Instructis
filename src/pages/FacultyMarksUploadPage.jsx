import { useCallback, useRef, useState } from 'react'
import * as XLSX from '@e965/xlsx'

/* ── constants ──────────────────────────────────────────────────────────── */

const EXAM_TYPES = {
  JEE: 'JEE',
  NEET: 'NEET',
}

const COLUMNS = {
  [EXAM_TYPES.JEE]: [
    { key: 'studentName', label: 'Student Name', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100', headerColor: 'bg-slate-600 text-white' },
    { key: 'physics',     label: 'Physics',       color: 'bg-blue-50  text-blue-900  dark:bg-blue-900/30 dark:text-blue-200',   headerColor: 'bg-blue-600 text-white' },
    { key: 'chemistry',   label: 'Chemistry',     color: 'bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-200', headerColor: 'bg-green-600 text-white' },
    { key: 'maths',       label: 'Maths',         color: 'bg-purple-50 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200', headerColor: 'bg-purple-600 text-white' },
  ],
  [EXAM_TYPES.NEET]: [
    { key: 'studentName', label: 'Student Name', color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100', headerColor: 'bg-slate-600 text-white' },
    { key: 'physics',     label: 'Physics',       color: 'bg-blue-50  text-blue-900  dark:bg-blue-900/30 dark:text-blue-200',   headerColor: 'bg-blue-600 text-white' },
    { key: 'chemistry',   label: 'Chemistry',     color: 'bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-200', headerColor: 'bg-green-600 text-white' },
    { key: 'biology',     label: 'Biology',       color: 'bg-teal-50  text-teal-900  dark:bg-teal-900/30 dark:text-teal-200',   headerColor: 'bg-teal-600 text-white' },
  ],
}

/* max marks per subject */
const MAX_MARKS = {
  [EXAM_TYPES.JEE]:  { physics: 100, chemistry: 100, maths: 100,    total: 300 },
  [EXAM_TYPES.NEET]: { physics: 180, chemistry: 180, biology: 360,  total: 720 },
}

/* header aliases accepted in the uploaded file (case-insensitive) */
const HEADER_ALIASES = {
  studentName: ['student name', 'studentname', 'name', 'student'],
  physics:     ['physics', 'phy'],
  chemistry:   ['chemistry', 'chem'],
  maths:       ['maths', 'math', 'mathematics'],
  biology:     ['biology', 'bio'],
}

/* ── helpers ────────────────────────────────────────────────────────────── */

const normalise = (str) => (str ?? '').toString().trim().toLowerCase()

/** Map raw header row → our column keys */
const buildHeaderMap = (rawHeaders, examType) => {
  const subjectKeys = COLUMNS[examType].map((c) => c.key)
  const map = {}
  rawHeaders.forEach((raw, idx) => {
    const n = normalise(raw)
    subjectKeys.forEach((key) => {
      if (HEADER_ALIASES[key]?.includes(n)) map[key] = idx
    })
  })
  return map
}

const toNum = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

/** Compute total and percentage for one row */
const computeStats = (row, examType) => {
  const cols = COLUMNS[examType].filter((c) => c.key !== 'studentName')
  const total = cols.reduce((sum, c) => sum + toNum(row[c.key]), 0)
  const maxTotal = MAX_MARKS[examType].total
  const pct = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(1) : '—'
  return { total, pct }
}

/** Grade badge colour based on percentage */
const gradeBadgeClass = (pct) => {
  const p = parseFloat(pct)
  if (p >= 85) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (p >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
  if (p >= 50) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
}

/** Build & download a sample Excel template */
const downloadSampleTemplate = (examType) => {
  const headers = COLUMNS[examType].map((c) => c.label)
  const sampleRow =
    examType === EXAM_TYPES.JEE
      ? ['Aarav Sharma', 85, 78, 92]
      : ['Priya Mehta',  150, 160, 310]

  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Marks')
  XLSX.writeFile(wb, `${examType}_marks_template.xlsx`)
}

/* ── sub-components ─────────────────────────────────────────────────────── */

const ExamToggle = ({ examType, onChange }) => (
  <div className="flex gap-2 rounded-2xl bg-stone-100 p-1.5 dark:bg-stone-900">
    {Object.values(EXAM_TYPES).map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => onChange(type)}
        className={`flex-1 rounded-xl px-6 py-2 text-sm font-semibold transition-all ${
          examType === type
            ? type === EXAM_TYPES.JEE
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-teal-600 text-white shadow-md'
            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
      >
        {type}
      </button>
    ))}
  </div>
)

const DropZone = ({ onFile, isDragging, onDragOver, onDragLeave, onDrop, inputRef }) => (
  <div
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onClick={() => inputRef.current?.click()}
    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 transition-all ${
      isDragging
        ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
        : 'border-stone-300 bg-stone-50 hover:border-blue-400 hover:bg-blue-50/50 dark:border-stone-700 dark:bg-stone-900/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/10'
    }`}
  >
    <span className="text-4xl">📊</span>
    <div className="text-center">
      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        Drag &amp; drop your Excel or CSV file here
      </p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        or click to browse — supports <code>.xlsx</code>, <code>.xls</code>, <code>.csv</code>
      </p>
    </div>
    <input
      ref={inputRef}
      type="file"
      accept=".xlsx,.xls,.csv"
      className="hidden"
      onChange={(e) => onFile(e.target.files?.[0])}
    />
  </div>
)

/* ── main component ─────────────────────────────────────────────────────── */

const FacultyMarksUploadPage = () => {
  const [examType, setExamType] = useState(EXAM_TYPES.JEE)
  const [rows, setRows]         = useState([])
  const [fileName, setFileName] = useState('')
  const [error, setError]       = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  /* ── parse uploaded file ── */
  const parseFile = useCallback((file) => {
    if (!file) return
    setError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb   = XLSX.read(data, { type: 'array' })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const raw  = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

        if (raw.length < 2) {
          setError('The file appears to be empty or has no data rows.')
          return
        }

        const headerRow = raw[0].map(String)
        const headerMap = buildHeaderMap(headerRow, examType)
        const requiredKeys = COLUMNS[examType].map((c) => c.key)

        const missing = requiredKeys.filter((k) => headerMap[k] === undefined)
        if (missing.length > 0) {
          const expected = COLUMNS[examType].map((c) => c.label).join(', ')
          setError(`Missing columns: ${missing.join(', ')}. Expected headers: ${expected}`)
          return
        }

        const parsed = raw.slice(1)
          .filter((row) => row.some((cell) => cell !== ''))
          .map((row) => {
            const entry = {}
            requiredKeys.forEach((key) => {
              entry[key] = row[headerMap[key]] ?? ''
            })
            return entry
          })

        setRows(parsed)
        setFileName(file.name)
      } catch {
        setError('Failed to read the file. Please ensure it is a valid Excel or CSV file.')
      }
    }
    reader.readAsArrayBuffer(file)
  }, [examType])

  /* ── drag & drop handlers ── */
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = ()    => setIsDragging(false)
  const handleDrop      = (e)  => { e.preventDefault(); setIsDragging(false); parseFile(e.dataTransfer.files?.[0]) }

  /* ── exam type switch: clear table ── */
  const handleExamChange = (type) => {
    setExamType(type)
    setRows([])
    setFileName('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleClear = () => {
    setRows([])
    setFileName('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const columns  = COLUMNS[examType]
  const subjects = columns.filter((c) => c.key !== 'studentName')

  /* ── summary stats ── */
  const subjectAverages = subjects.map((col) => {
    if (rows.length === 0) return { ...col, avg: '—' }
    const avg = rows.reduce((s, r) => s + toNum(r[col.key]), 0) / rows.length
    return { ...col, avg: avg.toFixed(1) }
  })

  return (
    <section className="w-full space-y-8">

      {/* ── header card ── */}
      <div className="w-full rounded-3xl bg-white p-8 shadow-xl shadow-stone-200 dark:bg-gray-900 dark:shadow-none md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-500">
          Instructis Portal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-white">
          Faculty Marks Upload
        </h1>
        <p className="mt-3 text-base text-neutral-600 md:text-lg dark:text-neutral-300">
          Select the exam type, upload your Excel/CSV file, and instantly view a colour-coded marks table.
        </p>
      </div>

      {/* ── upload card ── */}
      <div className="w-full rounded-3xl bg-white p-6 shadow-xl shadow-stone-200 dark:bg-gray-900 dark:shadow-none md:p-8">

        {/* exam type selector */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Select Exam Type</h2>
          <div className="sm:w-64">
            <ExamToggle examType={examType} onChange={handleExamChange} />
          </div>
        </div>

        {/* column preview chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {columns.map((col) => (
            <span
              key={col.key}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${col.headerColor}`}
            >
              {col.label}
            </span>
          ))}
          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">Total</span>
          <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">%</span>
        </div>

        {/* drop zone */}
        <div className="mt-6">
          <DropZone
            onFile={parseFile}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            inputRef={inputRef}
          />
        </div>

        {/* actions row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => downloadSampleTemplate(examType)}
            className="flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-stone-700 dark:bg-stone-900 dark:text-neutral-300 dark:hover:text-blue-400"
          >
            ⬇️ Download Sample Template
          </button>

          {rows.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
            >
              ✕ Clear Table
            </button>
          )}
        </div>

        {/* error */}
        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-800 dark:bg-rose-900/20">
            <span className="mt-0.5 text-rose-500">⚠️</span>
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
          </div>
        )}
      </div>

      {/* ── marks table ── */}
      {rows.length > 0 && (
        <div className="w-full rounded-3xl bg-white shadow-xl shadow-stone-200 dark:bg-gray-900 dark:shadow-none">

          {/* table header bar */}
          <div className="flex flex-col gap-2 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Uploaded Marks
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${examType === EXAM_TYPES.JEE ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'}`}>
                  {examType}
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {fileName} · {rows.length} student{rows.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* subject averages */}
            <div className="flex flex-wrap gap-2">
              {subjectAverages.map((col) => (
                <div key={col.key} className={`rounded-xl px-3 py-1.5 text-center ${col.color}`}>
                  <p className="text-xs font-medium opacity-70">{col.label} avg</p>
                  <p className="text-sm font-bold">{col.avg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* scrollable table */}
          <div className="mt-4 overflow-x-auto pb-6 md:pb-8">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-slate-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white first:rounded-none">
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${col.headerColor} px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide`}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="bg-orange-500 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white">
                    Total
                  </th>
                  <th className="bg-rose-500 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const { total, pct } = computeStats(row, examType)
                  const isEven = i % 2 === 0
                  return (
                    <tr
                      key={i}
                      className={`transition-colors hover:brightness-95 ${isEven ? 'bg-white dark:bg-gray-900' : 'bg-stone-50 dark:bg-stone-900/60'}`}
                    >
                      <td className="border-b border-stone-100 px-4 py-3 text-xs font-medium text-neutral-400 dark:border-stone-800">
                        {i + 1}
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`border-b border-stone-100 px-4 py-3 dark:border-stone-800 ${
                            col.key === 'studentName'
                              ? 'font-medium text-neutral-800 dark:text-neutral-100'
                              : `font-normal ${col.color} text-center`
                          }`}
                        >
                          {row[col.key] !== '' ? row[col.key] : '—'}
                        </td>
                      ))}
                      <td className="border-b border-stone-100 px-4 py-3 text-center font-semibold text-orange-700 dark:border-stone-800 dark:text-orange-400">
                        {total}
                      </td>
                      <td className="border-b border-stone-100 px-4 py-3 text-center dark:border-stone-800">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${gradeBadgeClass(pct)}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </section>
  )
}

export default FacultyMarksUploadPage
