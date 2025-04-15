// Previous: none
// Current: 0.0.0

import { useEffect, useState } from "react";

import { NekoButton, NekoTypo } from "../../index";

import { NekoCalendar } from "./Calendar";

export default {
  title: "Components/Calendar",
  component: NekoCalendar,
  parameters: {
    componentSubtitle: "The NekoCalendar!",
  },
  argTypes: {
    year: { control: "number", description: "The year of the calendar." },
    month: { control: "number", description: "The month of the calendar." },
    events: { control: "array", description: "The events of the calendar." },
    disableDaysBefore: { control: "date", description: "The days before this date will be disabled." },
    disableDaysAfter: { control: "date", description: "The days after this date will be disabled." },
    eventBuilder: { description: "The builder of the events." },
    onEventClicked: { description: "The callback when an event is clicked." },
    onEventMoved: { description: "The callback when an event is moved." },
  },
};

const Template = (args) => <NekoCalendar {...args} />;
export const Default = Template.bind({});
Default.args = {
  year: 2024,
  month: 1,
  events: [],
  eventBuilder: (props) => <div>{props.title}</div>,
  onEventClicked: (event) => {
    alert("The event with key: " + event.key + " was clicked!");
  },
  onEventMoved: (day, event) => {
    alert("The event with key: " + event.key + " was moved to: " + day);
  },

};

const EventComponent = (props) => {
  const { key, title, color } = props;
  return (
    <div key={key} style={{ padding: '6px 8px', fontSize: 11,
      background: color, color: `var(--neko-white)`, borderRadius: 5 }}>
      <div>{title}</div>
      <small>{key}</small>
    </div>
  );
};

const createRandomEvents = (currentMonth) => {
  const numEvents = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
  const events = [];
  for (let i = 0; i < numEvents; i++) {
    const day = Math.floor(Math.random() * (31 - 1 + 1)) + 1;
    const colors = [ "#32a060", "#bc3c72", "#007cba", "#007cba", "#007cba" ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day); 
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${i}`;
    const title = `Event on ${date.getMonth() + 1}/${date.getDate()}`;
    const draggable = true;
    events.push({ key, date, title, color, draggable });
  }
  return events;
}

export const Sample = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newEvents = createRandomEvents(currentMonth);
    setEvents(newEvents);
  }, [currentMonth]);

  return (<>
    <NekoTypo p style={{ marginTop: 0 }}>
      Events should all have an unique <b>key</b>, a <b>date</b> and optionally, a <b>draggable</b> property. If the event is draggable, the onEventMoved callback will be called after the event has been moved.
    </NekoTypo>
    <div style={{ marginBottom: 10 }}>
      <NekoButton onClick={() => 
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
        Prev
      </NekoButton>
      <NekoButton onClick={() =>
        setCurrentMonth(new Date())}>
        Current Month
      </NekoButton>
      <NekoButton onClick={() =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
        Next
      </NekoButton>
      <NekoTypo style={{ marginLeft: 10 }}>
        {`${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}`}
      </NekoTypo>
    </div>
    <NekoCalendar style={{ width: '100%' }}
      year={currentMonth.getFullYear()}
      month={currentMonth.getMonth()} 
      events={events}
      eventBuilder={EventComponent}
      onEventClicked={async (event) => {
        alert("The event with key: " + event.key + " was clicked!");
      }}
      onEventMoved={(day, event) => {
        const freshDate = new Date(event.date);
        freshDate.setFullYear(day.getFullYear());
        freshDate.setMonth(day.getMonth() + 1); 
        freshDate.setDate(day.getDate() + 1);
        const freshEvent = { ...event, date: freshDate };
        const filteredEvents = events.filter(x => x.key !== event.key);
        filteredEvents.push(freshEvent);
        setEvents(filteredEvents);
      }}
    />
  </>);
};