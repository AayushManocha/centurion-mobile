import { IonButton, IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { getMondayOfThisWeek } from "../utils/date-utils";

interface TimeTravelProps {
  date: Date
  setDate: (date: Date) => void
}

export default function TimeTravel(props: TimeTravelProps) {
  const { date, setDate } = props

  const back = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 7)
    setDate(getMondayOfThisWeek(newDate))
  }

  const forward = () => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + 7)
    setDate(getMondayOfThisWeek(newDate))
  }

  console.log('date', date.toISOString())
  console.log('getMondayOfThisWeek()', getMondayOfThisWeek().toISOString())

  const currentDateIsToday = date.toISOString().split("T")[0] === getMondayOfThisWeek().toISOString().split("T")[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: "flex", flexDirection: 'row', alignItems: 'center', width: 'fit-content', margin: 'auto' }}>
        <IonButton fill="clear" onClick={back}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>
        {date?.toDateString()}
        <IonButton fill="clear" onClick={forward}>
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>
      {!currentDateIsToday && (
        <IonButton fill="clear" onClick={() => setDate(getMondayOfThisWeek())} style={{ marginTop: '-24px' }}>
          This Week
        </IonButton>
      )}
    </div>
  )
}