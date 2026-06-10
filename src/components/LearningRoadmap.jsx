import Reveal from './Reveal';

/**
 * Visual learning roadmap/timeline component.
 * Used on AI/ML and Coding pages.
 * Props: stages (array of { stage, title, description, skills, duration })
 */
export default function LearningRoadmap({ stages = [], accentColor = '#8134AF' }) {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-8">
        {stages.map((stage, idx) => (
          <Reveal key={idx} direction="up" delay={idx * 80}>
            <div className="relative flex gap-6 md:gap-8">
              {/* Node */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  {stage.stage}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">{stage.title}</h3>
                  {stage.duration && (
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {stage.duration}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{stage.description}</p>
                {stage.skills && stage.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg border border-gray-100 text-gray-600 bg-gray-50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
