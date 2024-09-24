package team.bham.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.CardStatus;

/**
 * A Card.
 */
@Entity
@Table(name = "card")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private CardStatus applicationStatus;

    @Column(name = "created_date_time")
    private ZonedDateTime createdDateTime;

    @NotNull
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @NotNull
    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "job_location")
    private String jobLocation;

    @Column(name = "job_duration")
    private String jobDuration;

    @ManyToOne
    private User appUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Card id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CardStatus getApplicationStatus() {
        return this.applicationStatus;
    }

    public Card applicationStatus(CardStatus applicationStatus) {
        this.setApplicationStatus(applicationStatus);
        return this;
    }

    public void setApplicationStatus(CardStatus applicationStatus) {
        this.applicationStatus = applicationStatus;
    }

    public ZonedDateTime getCreatedDateTime() {
        return this.createdDateTime;
    }

    public Card createdDateTime(ZonedDateTime createdDateTime) {
        this.setCreatedDateTime(createdDateTime);
        return this;
    }

    public void setCreatedDateTime(ZonedDateTime createdDateTime) {
        this.createdDateTime = createdDateTime;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public Card companyName(String companyName) {
        this.setCompanyName(companyName);
        return this;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public Card jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobLocation() {
        return this.jobLocation;
    }

    public Card jobLocation(String jobLocation) {
        this.setJobLocation(jobLocation);
        return this;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public String getJobDuration() {
        return this.jobDuration;
    }

    public Card jobDuration(String jobDuration) {
        this.setJobDuration(jobDuration);
        return this;
    }

    public void setJobDuration(String jobDuration) {
        this.jobDuration = jobDuration;
    }

    public User getAppUser() {
        return this.appUser;
    }

    public void setAppUser(User user) {
        this.appUser = user;
    }

    public Card appUser(User user) {
        this.setAppUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Card)) {
            return false;
        }
        return id != null && id.equals(((Card) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Card{" +
            "id=" + getId() +
            ", applicationStatus='" + getApplicationStatus() + "'" +
            ", createdDateTime='" + getCreatedDateTime() + "'" +
            ", companyName='" + getCompanyName() + "'" +
            ", jobTitle='" + getJobTitle() + "'" +
            ", jobLocation='" + getJobLocation() + "'" +
            ", jobDuration='" + getJobDuration() + "'" +
            "}";
    }
}
