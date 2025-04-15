// Previous: none
// Current: 0.0.0

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
  Sunday: 0
}

const StyledNekoCalendar = Styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  font-family: var(--neko-font-family);
  font-size: font-size: var(--neko-small-font-size);
`;

const CalendarHeaders = Styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0px;
  color: white;
  background: var(--neko-main-color);
  border-radius: 5px 5px 0px 0px;

  div {
    width: calc(100% / 7);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  background: purple;
  width: calc(100% / 7);
  background: var(--neko-white);
  padding: 3px;
  border-bottom: 1px solid var(--neko-light-gray);
  border-right: 1px solid var(--neko-light-gray);
  position: relative;
  transition: background-color 150ms linear;
  box-sizing: border-box;

  &:first-child {
    border-left: 1px solid var(--neko-light-gray);
  }

  &:last-child {
    border-right: 1px solid var(--neko-light-gray);
  }

  .day {
    text-align: right;
    color: var(--neko-black);
    margin-bottom: 5px;
  }

  &.highlighted {
    background: #ffe8bc;
  }

  &.today .day {
    font-weight: bold;
    text-decoration: underline;
  }

  .gray-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--neko-light-gray);
    opacity: 0.8;
  }

  .event {
    margin-bottom: 2px;
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
    const totalDaysCount = numberOfDaysBetween(currentDate, new Date(year, month + 1, 1));
    const totalCalendarDays = totalDaysCount < 25 ? 34 : 41;
    const lastDate = new Date(currentDate);
    lastDate.setDate(currentDate.getDate() + totalCalendarDays);
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
              const isCurrentMonth = day.getMonth() === month;
              const isDisabled = !isCurrentMonth || day < disableDaysBefore;
              const dayClassName = (isDisabled ? 'disabled ' : '') + (isDayToday(day) ? 'today' : '')
                + (day === highlightedDay ? 'highlighted' : '');
              const filterEvents = events.filter(event => isCurrentMonth && event.date.getDate() === day.getDate());
              return (
                <DayContainer className={dayClassName} key={day.getTime()}
                  onDragOver={(e) => { 
                    if ( isDisabled || isSameDay(day, draggedEvent?.date) ) { 
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