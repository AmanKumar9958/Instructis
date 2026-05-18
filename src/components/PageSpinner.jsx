const PageSpinner = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`} role="status" aria-live="polite">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-light-purple" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-purple animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-brand-orange animate-spin [animation-duration:1.4s]" />
        <div className="absolute inset-6 rounded-full bg-brand-orange/30 animate-pulse" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default PageSpinner;
