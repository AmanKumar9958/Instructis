const LoginPage = () => {
  return (
    <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl shadow-stone-200 md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Instructis Portal</p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl">Login</h1>
      <p className="mt-3 text-base text-neutral-600 md:text-lg">
        Sign in to access your personalized dashboard and learning tools.
      </p>

      <form className="mt-8 space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-400"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">Password</span>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-sky-400"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Continue
        </button>
      </form>
    </section>
  )
}

export default LoginPage
