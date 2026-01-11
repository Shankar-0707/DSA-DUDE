import React from 'react';

const generate2026Days = () => {
    // Generate all days in 2026
    const days = [];
    const startDate = new Date('2026-01-01T00:00:00');
    const endDate = new Date('2026-12-31T00:00:00');

    const current = new Date(startDate);
    while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
};

export default function ActivityCalendar({ loginActivity }) {
    const activitySet = new Set(
        loginActivity ? loginActivity.map((d) => new Date(d).setHours(0, 0, 0, 0)) : []
    );

    const days = generate2026Days();

    // Group into weeks
    const weeks = [];
    let currentWeek = [];

    // Align the first week. Jan 1, 2026 is a Thursday (4).
    // So we need 4 empty slots (Sun-Wed) at the start.
    const firstDay = days[0];
    const firstDayIndex = firstDay.getDay(); // 4 (Thursday)

    // Fill initial empty slots
    for (let i = 0; i < firstDayIndex; i++) {
        currentWeek.push(null);
    }

    days.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Push remaining days
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    // Helper to check if a week starts a new month
    const isNewMonth = (week) => {
        return week.some(day => day && day.getDate() === 1);
    };

    return (
        <div className="w-full overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Activity
            </h2>

            <div className="flex items-end gap-[2px] pb-2 min-w-max ">
                {weeks.map((week, wIdx) => {
                    const containsFirstOfMonth = week.some(d => d && d.getDate() === 1);
                    const weekMonthLabel = containsFirstOfMonth ? week.find(d => d && d.getDate() === 1).toLocaleString('default', { month: 'short' }) : null;

                    return (
                        <div key={wIdx} className={`flex flex-col gap-[2px] ${containsFirstOfMonth ? 'ml-6 relative' : ''}`}>
                            {/* Month Label Absolute */}
                            {containsFirstOfMonth && (
                                <span className="absolute -top-6 left-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {weekMonthLabel}
                                </span>
                            )}

                            {week.map((day, dIdx) => {
                                if (!day) return <div key={dIdx} className="w-[12px] h-[12px]" />;
                                const active = activitySet.has(day.getTime());
                                return (
                                    <div
                                        key={dIdx}
                                        title={day.toDateString()}
                                        className={`w-[12px] h-[12px] rounded-[1px] transition-all hover:ring-1 hover:ring-foreground/50 ${active
                                            ? "bg-green-500 shadow-sm shadow-green-500/50"
                                            : "bg-muted-foreground/10 dark:bg-zinc-800"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-6 justify-end">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    <div className="w-[12px] h-[12px] rounded-[1px] bg-muted-foreground/10 dark:bg-zinc-800" />
                    <div className="w-[12px] h-[12px] rounded-[1px] bg-green-900/40" />
                    <div className="w-[12px] h-[12px] rounded-[1px] bg-green-700/60" />
                    <div className="w-[12px] h-[12px] rounded-[1px] bg-green-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
