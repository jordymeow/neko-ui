import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { useClasses } from '../hooks';

const Days = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
}

const StyledNekoCalendar = Styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-family: var(--neko-font-family);
  font-size: var(--neko-small-font-size);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CalendarHeaders = Styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 16px 0px;
  color: white;
  background: var(--neko-main-color);
  border-radius: 8px 8px 0px 0px;

  /* Diagonal stripe pattern - same as NekoHeader */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.3) 20px,
      rgba(255, 255, 255, 0.3) 40px
    );
    background-position: 0 0;
    background-size: 56.57px 56.57px;
    pointer-events: none;
    z-index: 0;
  }

  div {
    width: calc(100% / 7);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 1;
  }
`;

const CalendarContent = Styled.div`
  display: flex;
  flex-direction: column;
`;

const WeekContainer = Styled.div`
  display: flex;
`;

const DayContainer = Styled.div`
  width: calc(100% / 7);
  min-height: 80px;
  background: var(--neko-white);
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  transition: all 200ms ease;
  box-sizing: border-box;

  &:first-child {
    border-left: 1px solid rgba(0, 0, 0, 0.06);
  }

  &:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }

  &:hover:not(.disabled) {
    background: rgba(0, 0, 0, 0.02);
  }

  .day {
    text-align: right;
    color: var(--neko-black);
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
  }

  &.highlighted {
    background: #fff3e0;
    box-shadow: inset 0 0 0 2px var(--neko-main-color);
  }

  &.today .day {
    display: inline-block;
    background: var(--neko-main-color);
    color: white;
    font-weight: 700;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }

  .gray-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.04);
    opacity: 1;
  }

  .event {
    margin-bottom: 3px;
  }

  .event:last-child {
    margin-bottom: 0px;
  }
`;

function getFirstWeekDayForMonth(month, year, weekDay = Days.Monday) {
  const date = new Date(year, month);
  while (date.getDay() !== weekDay) {
    date.setDate(date.getDate() - 1);
  }
  return date;
}

function numberOfDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  while (start <= end) {
    count++;
    start.setDate(start.getDate() + 1);
  }
  return count - 1;
}

function splitArrayInChunks(array, chunkSize) {
  const chunks = [];
  let i = 0;
  while (i < array.length) {
    chunks.push(array.slice(i, i += chunkSize));
  }
  return chunks;
}

const NekoCalendar = (props) => {
  const {
    month = new Date().getMonth(),
    year = new Date().getFullYear(),
    onEventClicked = () => { console.log("[NekoCalendar] onEventClicked not handled."); },
    onEventMoved = () => { console.log("[NekoCalendar] onEventMoved not handled."); },
    eventBuilder = () => "YOOO",
    events,
    className,
    ...rest
  } = props;
  const [draggedEvent, setDraggedEvent] = useState();
  const [highlightedDay, setHighlightedDay] = useState();
  const classNames = useClasses('neko-calendar', className);

  let { disableDaysBefore = null } = props;
  disableDaysBefore = disableDaysBefore ? disableDaysBefore :
    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const weeks = useMemo(() => {
    const days = [];
    const currentDate = getFirstWeekDayForMonth(month, year, Days.Monday);
    const totalCalendarDays = numberOfDaysBetween(currentDate, new Date(year, month, 1)) < 5 ? 34 : 41;
    const lastDate = new Date(currentDate).setDate(currentDate.getDate() + totalCalendarDays)
    while (currentDate <= lastDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return splitArrayInChunks(days, 7);
  }, [month, year]);

  const isDayToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  return (
    <StyledNekoCalendar className={classNames} {...rest}>

      <CalendarHeaders>
        {Object.keys(Days).map(day => (
          <div key={day}>{day}</div>
        ))}
      </CalendarHeaders>

      <CalendarContent>
        {weeks.map(week => 
          <WeekContainer key={week}>
            {week.map(day => {
              const isCurrentMonth = day.getMonth() == month;
              const isDisabled = !isCurrentMonth || day < disableDaysBefore;
              const dayClassName = (isDisabled ? 'disabled ' : '') + (isDayToday(day) ? 'today' : '')
                + (day === highlightedDay ? 'highlighted' : '');
              const filterEvents = events.filter(event => isCurrentMonth && event.date.getDate() === day.getDate());
              return (
                <DayContainer className={dayClassName} key={day.getTime()}
                  onDragOver={(e) => { 
                    if ( isDisabled || isSameDay(day, draggedEvent.date) ) { 
                      return false;
                    };
                    e.preventDefault();
                    setHighlightedDay(day);
                    return true;
                  }}
                  onDragLeave={() => setHighlightedDay(null)}
                  onDrop={() => { onEventMoved(day, draggedEvent); setHighlightedDay(null) }}>
                  <div className="day">{day.getDate()}</div>
                  {filterEvents.map(event => 
                    <div className="event" key={event.key} draggable={event.draggable} 
                      onClick={() => onEventClicked(event)}
                      onDragStart={(e) => setDraggedEvent(event)}>
                      {eventBuilder({ ...event })}
                    </div>)
                  }
                  {isDisabled && <div className="gray-overlay" />}
                </DayContainer>
              );
            })}
          </WeekContainer>
        )}
      </CalendarContent>

    </StyledNekoCalendar>
  );
}

NekoCalendar.propTypes = {
  month: PropTypes.number,
  year: PropTypes.number,
  disableDaysBefore: PropTypes.instanceOf(Date),
  disableDaysAfter: PropTypes.instanceOf(Date),
  eventBuilder: PropTypes.func,
  events: PropTypes.array,
  onEventClicked: PropTypes.func,
  onEventMoved: PropTypes.func,
};

export { NekoCalendar };
