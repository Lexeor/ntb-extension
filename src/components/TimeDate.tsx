import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'dayjs/locale/en';

function TimeDate() {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, [])

  return (
    <div id="time">
      <h1 className="row-clock">{now.format('HH:mm')}</h1>
      <p className="row-date">{now.locale('en').format('dddd, D MMMM')}</p>
    </div>
  )
}

export default TimeDate
