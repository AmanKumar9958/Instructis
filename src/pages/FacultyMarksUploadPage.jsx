const FacultyMarksUploadPage = () => {
  return (
    <section className="w-full max-w-4xl rounded-3xl bg-white p-10 shadow-xl shadow-stone-200">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
        Instructis Portal
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl">
        Faculty Marks Upload
      </h1>
      <p className="mt-3 text-base text-neutral-600 md:text-lg">
        Upload assessment marks and verify entries in minutes.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl bg-stone-100 p-6">
          <h3 className="text-lg font-semibold text-neutral-900">Quick Actions</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Jump into your most used tasks with fewer clicks.
          </p>
        </div>
        <div className="rounded-2xl bg-stone-100 p-6">
          <h3 className="text-lg font-semibold text-neutral-900">Insights</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Track progress, uploads, and class updates in one view.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FacultyMarksUploadPage
