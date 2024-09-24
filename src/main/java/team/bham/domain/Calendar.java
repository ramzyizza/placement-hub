package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.Color;

/**
 * A Calendar.
 */
@Entity
@Table(name = "calendar")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Calendar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "calendar_name", nullable = false)
    private String calendarName;

    @Column(name = "calendar_description")
    private String calendarDescription;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "calendar_color", nullable = false)
    private Color calendarColor;

    @OneToMany(mappedBy = "calendar", cascade = CascadeType.REMOVE)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "calendar" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @ManyToOne
    private User appUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Calendar id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCalendarName() {
        return this.calendarName;
    }

    public Calendar calendarName(String calendarName) {
        this.setCalendarName(calendarName);
        return this;
    }

    public void setCalendarName(String calendarName) {
        this.calendarName = calendarName;
    }

    public String getCalendarDescription() {
        return this.calendarDescription;
    }

    public Calendar calendarDescription(String calendarDescription) {
        this.setCalendarDescription(calendarDescription);
        return this;
    }

    public void setCalendarDescription(String calendarDescription) {
        this.calendarDescription = calendarDescription;
    }

    public Color getCalendarColor() {
        return this.calendarColor;
    }

    public Calendar calendarColor(Color calendarColor) {
        this.setCalendarColor(calendarColor);
        return this;
    }

    public void setCalendarColor(Color calendarColor) {
        this.calendarColor = calendarColor;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setCalendar(null));
        }
        if (events != null) {
            events.forEach(i -> i.setCalendar(this));
        }
        this.events = events;
    }

    public Calendar events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public Calendar addEvent(Event event) {
        this.events.add(event);
        event.setCalendar(this);
        return this;
    }

    public Calendar removeEvent(Event event) {
        this.events.remove(event);
        event.setCalendar(null);
        return this;
    }

    public User getAppUser() {
        return this.appUser;
    }

    public void setAppUser(User user) {
        this.appUser = user;
    }

    public Calendar appUser(User user) {
        this.setAppUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Calendar)) {
            return false;
        }
        return id != null && id.equals(((Calendar) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Calendar{" +
            "id=" + getId() +
            ", calendarName='" + getCalendarName() + "'" +
            ", calendarDescription='" + getCalendarDescription() + "'" +
            ", calendarColor='" + getCalendarColor() + "'" +
            "}";
    }
}
