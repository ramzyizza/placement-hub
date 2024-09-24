package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Color;
import team.bham.domain.enumeration.EventType;
import team.bham.domain.enumeration.RepeatType;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(name = "event_description")
    private String eventDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_color")
    private Color eventColor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @NotNull
    @Column(name = "event_start", nullable = false)
    private ZonedDateTime eventStart;

    @NotNull
    @Column(name = "event_end", nullable = false)
    private ZonedDateTime eventEnd;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "event_repeat", nullable = false)
    private RepeatType eventRepeat;

    @Column(name = "event_location")
    private String eventLocation;

    @ManyToOne
    private User appUser;

    @ManyToOne
    @JsonIgnoreProperties(value = { "events", "appUser" }, allowSetters = true)
    private Calendar calendar;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Event id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return this.eventName;
    }

    public Event eventName(String eventName) {
        this.setEventName(eventName);
        return this;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return this.eventDescription;
    }

    public Event eventDescription(String eventDescription) {
        this.setEventDescription(eventDescription);
        return this;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public Color getEventColor() {
        return this.eventColor;
    }

    public Event eventColor(Color eventColor) {
        this.setEventColor(eventColor);
        return this;
    }

    public void setEventColor(Color eventColor) {
        this.eventColor = eventColor;
    }

    public EventType getEventType() {
        return this.eventType;
    }

    public Event eventType(EventType eventType) {
        this.setEventType(eventType);
        return this;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public ZonedDateTime getEventStart() {
        return this.eventStart;
    }

    public Event eventStart(ZonedDateTime eventStart) {
        this.setEventStart(eventStart);
        return this;
    }

    public void setEventStart(ZonedDateTime eventStart) {
        this.eventStart = eventStart;
    }

    public ZonedDateTime getEventEnd() {
        return this.eventEnd;
    }

    public Event eventEnd(ZonedDateTime eventEnd) {
        this.setEventEnd(eventEnd);
        return this;
    }

    public void setEventEnd(ZonedDateTime eventEnd) {
        this.eventEnd = eventEnd;
    }

    public RepeatType getEventRepeat() {
        return this.eventRepeat;
    }

    public Event eventRepeat(RepeatType eventRepeat) {
        this.setEventRepeat(eventRepeat);
        return this;
    }

    public void setEventRepeat(RepeatType eventRepeat) {
        this.eventRepeat = eventRepeat;
    }

    public String getEventLocation() {
        return this.eventLocation;
    }

    public Event eventLocation(String eventLocation) {
        this.setEventLocation(eventLocation);
        return this;
    }

    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }

    public User getAppUser() {
        return this.appUser;
    }

    public void setAppUser(User user) {
        this.appUser = user;
    }

    public Event appUser(User user) {
        this.setAppUser(user);
        return this;
    }

    public Calendar getCalendar() {
        return this.calendar;
    }

    public void setCalendar(Calendar calendar) {
        this.calendar = calendar;
    }

    public Event calendar(Calendar calendar) {
        this.setCalendar(calendar);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return id != null && id.equals(((Event) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", eventName='" + getEventName() + "'" +
            ", eventDescription='" + getEventDescription() + "'" +
            ", eventColor='" + getEventColor() + "'" +
            ", eventType='" + getEventType() + "'" +
            ", eventStart='" + getEventStart() + "'" +
            ", eventEnd='" + getEventEnd() + "'" +
            ", eventRepeat='" + getEventRepeat() + "'" +
            ", eventLocation='" + getEventLocation() + "'" +
            "}";
    }
}
