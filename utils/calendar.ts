
export const generateGoogleCalendarLink = (
  title: string,
  details: string,
  startDate: Date,
  durationMinutes: number = 30
): string => {
  const start = startDate.toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(startDate.getTime() + durationMinutes * 60000).toISOString().replace(/-|:|\.\d+/g, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateOutlookCalendarLink = (
  title: string,
  details: string,
  startDate: Date,
  durationMinutes: number = 30
): string => {
  const start = startDate.toISOString();
  const end = new Date(startDate.getTime() + durationMinutes * 60000).toISOString();

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: start,
    enddt: end,
    subject: title,
    body: details,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};
