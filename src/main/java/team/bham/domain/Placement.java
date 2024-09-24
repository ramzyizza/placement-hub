package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Placement.
 */
@Entity
@Table(name = "placement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Placement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "role", nullable = false)
    private String role;

    @NotNull
    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "link", nullable = false)
    private String link;

    @NotNull
    @Column(name = "salary", nullable = false)
    private Integer salary;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @NotNull
    @Column(name = "industry", nullable = false)
    private String industry;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "about", nullable = false)
    private String about;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "job_description", nullable = false)
    private String jobDescription;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "minimum_qualification", nullable = false)
    private String minimumQualification;

    @NotNull
    @Column(name = "application_deadline", nullable = false)
    private ZonedDateTime applicationDeadline;

    @ManyToOne
    @JsonIgnoreProperties(value = { "appUser", "posts", "jobs", "reviews" }, allowSetters = true)
    private UserCompany userCompany;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Placement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return this.role;
    }

    public Placement role(String role) {
        this.setRole(role);
        return this;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLocation() {
        return this.location;
    }

    public Placement location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getSalary() {
        return this.salary;
    }

    public Placement salary(Integer salary) {
        this.setSalary(salary);
        return this;
    }

    public void setSalary(Integer salary) {
        this.salary = salary;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Placement duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getIndustry() {
        return this.industry;
    }

    public Placement industry(String industry) {
        this.setIndustry(industry);
        return this;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getAbout() {
        return this.about;
    }

    public Placement about(String about) {
        this.setAbout(about);
        return this;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getJobDescription() {
        return this.jobDescription;
    }

    public Placement jobDescription(String jobDescription) {
        this.setJobDescription(jobDescription);
        return this;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getMinimumQualification() {
        return this.minimumQualification;
    }

    public Placement minimumQualification(String minimumQualification) {
        this.setMinimumQualification(minimumQualification);
        return this;
    }

    public void setMinimumQualification(String minimumQualification) {
        this.minimumQualification = minimumQualification;
    }

    public ZonedDateTime getApplicationDeadline() {
        return this.applicationDeadline;
    }

    public Placement applicationDeadline(ZonedDateTime applicationDeadline) {
        this.setApplicationDeadline(applicationDeadline);
        return this;
    }

    public void setApplicationDeadline(ZonedDateTime applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public UserCompany getUserCompany() {
        return this.userCompany;
    }

    public void setUserCompany(UserCompany userCompany) {
        this.userCompany = userCompany;
    }

    public Placement userCompany(UserCompany userCompany) {
        this.setUserCompany(userCompany);
        return this;
    }

    public String getLink() {
        return this.link;
    }

    public Placement link(String link) {
        this.setLink(link);
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Placement)) {
            return false;
        }
        return id != null && id.equals(((Placement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Placement{" +
            "id=" + getId() +
            ", role='" + getRole() + "'" +
            ", location='" + getLocation() + "'" +
            ", salary=" + getSalary() +
            ", duration=" + getDuration() +
            ", industry='" + getIndustry() + "'" +
            ", about='" + getAbout() + "'" +
            ", jobDescription='" + getJobDescription() + "'" +
            ", minimumQualification='" + getMinimumQualification() + "'" +
            ", applicationDeadline='" + getApplicationDeadline() + "'" +
            "}";
    }
}
