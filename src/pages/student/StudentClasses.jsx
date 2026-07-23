import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { Video, Calendar, Clock, Loader2, PlayCircle, ExternalLink, BookOpen } from 'lucide-react'

export default function StudentClasses() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [hasBatches, setHasBatches] = useState(true)
  const [activeTab, setActiveTab] = useState('live')

  useEffect(() => {
    async function fetchClasses() {
      if (!user) return

      try {
        setLoading(true)
        let assignedBatchesArr = user.assigned_batches || []
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            assignedBatchesArr = userDocSnap.data().assigned_batches || assignedBatchesArr
          }
        } catch (userErr) {
          console.warn("Could not fetch fresh user doc, using cached user data.", userErr)
        }

        if (assignedBatchesArr.length === 0) {
          setHasBatches(false)
          setLoading(false)
          return
        }

        // Fetch live_classes for all assigned batches
        const classesRef = collection(db, 'live_classes')
        const allFetchedClasses = []

        // Firestore 'in' queries are limited to 10 items.
        // We chunk the array if it's larger than 10, or just query if <= 10.
        const chunkedBatches = []
        for (let i = 0; i < assignedBatchesArr.length; i += 10) {
          chunkedBatches.push(assignedBatchesArr.slice(i, i + 10))
        }

        for (const chunk of chunkedBatches) {
          const q = query(classesRef, where('batch_id', 'in', chunk))
          const snap = await getDocs(q)
          snap.forEach(d => allFetchedClasses.push({ id: d.id, ...d.data() }))
        }

        // Sort by scheduled_at locally to avoid complex index requirements
        allFetchedClasses.sort((a, b) => {
          const timeA = a.scheduled_at?.toMillis() || 0
          const timeB = b.scheduled_at?.toMillis() || 0
          return timeB - timeA // Default descending (newest first)
        })

        setClasses(allFetchedClasses)
        setHasBatches(true)
      } catch (err) {
        console.error("Error fetching classes:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (!hasBatches) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Classes Available</h2>
        <p className="text-gray-500 mb-8">
          You have not been assigned to a batch yet. Classes will appear here once you are assigned to a batch by the administration.
        </p>
      </div>
    )
  }

  const now = new Date().getTime()

  // Categorize classes by both is_active flag AND scheduled date
  const liveClasses = classes.filter(c => c.is_active && (c.scheduled_at?.toMillis() || 0) <= now)
  const upcomingClasses = classes.filter(c => (c.scheduled_at?.toMillis() || 0) > now)
  const pastClasses = classes.filter(c => !c.is_active && (c.scheduled_at?.toMillis() || 0) <= now)

  // Reverse past classes to show newest past class first
  const displayClasses = {
    'live': liveClasses,
    'upcoming': upcomingClasses.sort((a, b) => (a.scheduled_at?.toMillis() || 0) - (b.scheduled_at?.toMillis() || 0)), // Upcoming ascending
    'past': pastClasses
  }[activeTab]

  const tabs = [
    { id: 'live', label: 'Live Now', count: liveClasses.length, icon: PlayCircle, color: 'text-red-500', bg: 'bg-red-500' },
    { id: 'upcoming', label: 'Upcoming', count: upcomingClasses.length, icon: Calendar, color: 'text-brand-purple', bg: 'bg-brand-purple' },
    { id: 'past', label: 'Previous', count: pastClasses.length, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Classes Hub</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === tab.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Class Grid */}
      {displayClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayClasses.map(cls => {
            const dateObj = cls.scheduled_at ? new Date(cls.scheduled_at.toMillis()) : new Date()

            return (
              <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className={`h-1.5 w-full ${activeTab === 'live' ? 'bg-red-500' : activeTab === 'upcoming' ? 'bg-brand-purple' : 'bg-gray-300'}`} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-600">
                      <Video className="w-3.5 h-3.5 text-gray-400" />
                      Class
                    </div>
                    {activeTab === 'live' && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        LIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{cls.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">by {cls.teacher_name || 'Faculty'}</p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <Calendar className="w-4 h-4 text-brand-purple" />
                      <span>{dateObj.toLocaleDateString()}</span>
                      <span className="text-gray-300">|</span>
                      <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {activeTab === 'live' && (
                      <a
                        href={cls.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors shadow-sm shadow-red-200"
                      >
                        Join Class <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {activeTab === 'upcoming' && (
                      <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl font-bold cursor-not-allowed border border-gray-200">
                        Starts at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    )}

                    {/* {activeTab === 'past' && (
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                        <PlayCircle className="w-4 h-4" />
                        View Recording
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            {activeTab === 'live' ? <PlayCircle className="w-8 h-8 text-red-300" /> :
              activeTab === 'upcoming' ? <Calendar className="w-8 h-8 text-brand-purple/30" /> :
                <Clock className="w-8 h-8 text-gray-300" />}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No {activeTab} classes</h3>
          <p className="text-gray-500">There are currently no {activeTab} classes for your batches.</p>
        </div>
      )}
    </div>
  )
}
