import { useState, useMemo, useEffect, useRef } from 'react';
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
};

const StyledDatePickerWrapper = Styled.div`
  display: inline-block;
  position: relative;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
`;

const DatePickerInput = Styled.input`
  padding: 8px 12px;
  border: 1px solid var(--neko-light-gray);
  border-radius: 4px;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  outline: none;
  transition: all 200ms ease;
  cursor: pointer;
  background: white;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: var(--neko-main-color);
  }

  &:focus {
    border-color: var(--neko-main-color);
    box-shadow: 0 0 0 3px rgba(var(--neko-main-color-rgb, 61, 133, 198), 0.1);
  }
`;

const DatePickerDropdown = Styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0;
  min-width: 320px;
  
  &.inline {
    position: relative;
    top: 0;
    left: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DatePickerHeader = Styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: white;
  background: var(--neko-main-color);
  border-radius: 8px 8px 0 0;

  /* Diagonal stripe pattern */
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

  .nav-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 200ms ease;
    position: relative;
    z-index: 1;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    &:active {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .month-year {
    font-weight: 600;
    font-size: 16px;
    position: relative;
    z-index: 1;
  }
`;

const CalendarGrid = Styled.div`
  padding: 8px;
`;

const DayLabels = Styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;

  .day-label {
    text-align: center;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--neko-gray);
    padding: 8px 4px;
  }
`;

const DaysGrid = Styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = Styled.button`
  aspect-ratio: 1;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--neko-font-family);
  font-size: 14px;
  font-weight: 500;
  color: var(--neko-black);
  transition: all 200ms ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;

  &:hover:not(:disabled):not(.selected) {
    background: rgba(0, 0, 0, 0.05);
  }

  &.outside-month {
    color: var(--neko-light-gray);
  }

  &.disabled {
    color: var(--neko-light-gray);
    cursor: not-allowed;
    background: rgba(0, 0, 0, 0.02);
    text-decoration: line-through;
  }

  &.today:not(.selected) {
    border: 2px solid var(--neko-main-color);
  }

  &.selected {
    background: var(--neko-main-color);
    color: white;
    font-weight: 700;
  }

  &.excluded {
    color: var(--neko-light-gray);
    cursor: not-allowed;
    text-decoration: line-through;
    background: rgba(255, 0, 0, 0.05);
  }
`;

const TimeInputContainer = Styled.div`
  position: relative;
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fafafa;

  /* Light gray diagonal stripes */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.02) 10px,
      rgba(0, 0, 0, 0.02) 20px
    );
    background-position: 0 0;
    background-size: 28.28px 28.28px;
    pointer-events: none;
    z-index: 0;
  }

  label {
    font-weight: 600;
    font-size: 13px;
    color: var(--neko-gray);
    position: relative;
    z-index: 1;
    min-width: 40px;
  }

  input[type="time"] {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    font-family: var(--neko-font-family);
    font-size: 14px;
    outline: none;
    transition: all 200ms ease;
    background: white;
    cursor: pointer;
    position: relative;
    z-index: 1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:hover {
      border-color: rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    &:focus {
      border-color: var(--neko-main-color);
      box-shadow: 0 0 0 3px rgba(var(--neko-main-color-rgb, 61, 133, 198), 0.1),
                  0 2px 4px rgba(0, 0, 0, 0.08);
    }

    /* Style the time picker dropdown list items */
    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 200ms ease;
      
      &:hover {
        opacity: 1;
      }
    }

    /* Modern styling for time selection in supported browsers */
    &::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }

    &::-webkit-datetime-edit-text {
      padding: 0 2px;
      color: var(--neko-gray);
    }

    &::-webkit-datetime-edit-hour-field,
    &::-webkit-datetime-edit-minute-field {
      padding: 2px 4px;
      border-radius: 3px;
      transition: background 150ms ease;
      
      &:focus {
        background: var(--neko-main-color);
        color: white;
        outline: none;
      }
    }
  }
`;

function getFirstWeekDayForMonth(month, year, weekDay = Days.Monday) {
  const date = new Date(year, month, 1);
  const day = date.getDay();
  const diff = (day === 0 ? 7 : day) - weekDay;
  date.setDate(date.getDate() - diff);
  return date;
}

function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function formatDate(date, format) {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

const NekoDatePicker = (props) => {
  const {
    selected = null,
    onChange = () => {},
    dateFormat = 'yyyy/MM/dd',
    minDate = null,
    maxDate = null,
    excludeDates = [],
    showTimeInput = false,
    inline = false,
    placeholder = 'Select date...',
    className,
    disabled = false,
    ...rest
  } = props;

  const [isOpen, setIsOpen] = useState(inline);
  const [currentMonth, setCurrentMonth] = useState(
    selected ? selected.getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    selected ? selected.getFullYear() : new Date().getFullYear()
  );
  const [timeValue, setTimeValue] = useState(
    selected ? `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}` : '00:00'
  );

  const wrapperRef = useRef(null);
  const classNames = useClasses('neko-datepicker', className);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (inline) return;

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, inline]);

  // Update time value when selected date changes
  useEffect(() => {
    if (selected && showTimeInput) {
      setTimeValue(`${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}`);
    }
  }, [selected, showTimeInput]);

  const days = useMemo(() => {
    const result = [];
    const firstDay = getFirstWeekDayForMonth(currentMonth, currentYear, Days.Monday);
    const current = new Date(firstDay);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return result;
  }, [currentMonth, currentYear]);

  const isDayDisabled = (date) => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
      return true;
    }
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) {
      return true;
    }
    return false;
  };

  const isDayExcluded = (date) => {
    return excludeDates.some(excludedDate => isSameDay(date, excludedDate));
  };

  const isDayToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const handleDayClick = (date) => {
    if (isDayDisabled(date) || isDayExcluded(date)) return;

    const newDate = new Date(date);
    
    // Apply time if time input is enabled
    if (showTimeInput && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
    } else if (selected) {
      // Preserve existing time if no time input
      newDate.setHours(selected.getHours());
      newDate.setMinutes(selected.getMinutes());
      newDate.setSeconds(selected.getSeconds());
    }

    onChange(newDate);
    
    if (!inline && !showTimeInput) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selected && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(selected);
      newDate.setHours(hours || 0);
      newDate.setMinutes(minutes || 0);
      onChange(newDate);
    }
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderCalendar = () => (
    <DatePickerDropdown className={inline ? 'inline' : ''}>
      <DatePickerHeader>
        <button className="nav-button" onClick={previousMonth} type="button">
          ‹
        </button>
        <div className="month-year">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button className="nav-button" onClick={nextMonth} type="button">
          ›
        </button>
      </DatePickerHeader>

      <CalendarGrid>
        <DayLabels>
          {dayLabels.map(day => (
            <div key={day} className="day-label">{day}</div>
          ))}
        </DayLabels>

        <DaysGrid>
          {days.map((day, index) => {
            const isOutsideMonth = day.getMonth() !== currentMonth;
            const isDisabled = isDayDisabled(day);
            const isExcluded = isDayExcluded(day);
            const isToday = isDayToday(day);
            const isSelected = isSameDay(day, selected);

            let className = '';
            if (isOutsideMonth) className += 'outside-month ';
            if (isDisabled) className += 'disabled ';
            if (isExcluded) className += 'excluded ';
            if (isToday) className += 'today ';
            if (isSelected) className += 'selected ';

            return (
              <DayCell
                key={index}
                className={className.trim()}
                onClick={() => handleDayClick(day)}
                disabled={isDisabled || isExcluded}
                type="button"
              >
                {day.getDate()}
              </DayCell>
            );
          })}
        </DaysGrid>
      </CalendarGrid>

      {showTimeInput && (
        <TimeInputContainer>
          <label>Time:</label>
          <input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
          />
        </TimeInputContainer>
      )}
    </DatePickerDropdown>
  );

  if (inline) {
    return (
      <StyledDatePickerWrapper className={classNames} {...rest}>
        {renderCalendar()}
      </StyledDatePickerWrapper>
    );
  }

  return (
    <StyledDatePickerWrapper ref={wrapperRef} className={classNames} {...rest}>
      <DatePickerInput
        type="text"
        value={selected ? formatDate(selected, dateFormat) : ''}
        placeholder={placeholder}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        disabled={disabled}
      />
      {isOpen && renderCalendar()}
    </StyledDatePickerWrapper>
  );
};

NekoDatePicker.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  dateFormat: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  showTimeInput: PropTypes.bool,
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export { NekoDatePicker };
