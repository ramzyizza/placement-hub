package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.CompanySize;
import team.bham.domain.enumeration.Industry;

/**
 * A UserCompany.
 */
@Entity
@Table(name = "user_company")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Lob
    @Column(name = "profile_image_background")
    private byte[] profileImageBackground;

    @Column(name = "profile_image_background_content_type")
    private String profileImageBackgroundContentType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "company_size", nullable = false)
    private CompanySize companySize;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "industry", nullable = false)
    private Industry industry;

    @NotNull
    @Column(name = "total_location", nullable = false)
    private Integer totalLocation;

    @OneToOne
    @JoinColumn(unique = true)
    private User appUser;

    @OneToMany(mappedBy = "userCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userCompany" }, allowSetters = true)
    private Set<CompanyPosts> posts = new HashSet<>();

    @OneToMany(mappedBy = "userCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userCompany" }, allowSetters = true)
    private Set<Placement> jobs = new HashSet<>();

    @OneToMany(mappedBy = "userCompany")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "userCompany" }, allowSetters = true)
    private Set<Review> reviews = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserCompany id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public UserCompany name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getLogo() {
        return this.logo;
    }

    public UserCompany logo(byte[] logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return this.logoContentType;
    }

    public UserCompany logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public byte[] getProfileImageBackground() {
        return this.profileImageBackground;
    }

    public UserCompany profileImageBackground(byte[] profileImageBackground) {
        this.setProfileImageBackground(profileImageBackground);
        return this;
    }

    public void setProfileImageBackground(byte[] profileImageBackground) {
        this.profileImageBackground = profileImageBackground;
    }

    public String getProfileImageBackgroundContentType() {
        return this.profileImageBackgroundContentType;
    }

    public UserCompany profileImageBackgroundContentType(String profileImageBackgroundContentType) {
        this.profileImageBackgroundContentType = profileImageBackgroundContentType;
        return this;
    }

    public void setProfileImageBackgroundContentType(String profileImageBackgroundContentType) {
        this.profileImageBackgroundContentType = profileImageBackgroundContentType;
    }

    public CompanySize getCompanySize() {
        return this.companySize;
    }

    public UserCompany companySize(CompanySize companySize) {
        this.setCompanySize(companySize);
        return this;
    }

    public void setCompanySize(CompanySize companySize) {
        this.companySize = companySize;
    }

    public Industry getIndustry() {
        return this.industry;
    }

    public UserCompany industry(Industry industry) {
        this.setIndustry(industry);
        return this;
    }

    public void setIndustry(Industry industry) {
        this.industry = industry;
    }

    public Integer getTotalLocation() {
        return this.totalLocation;
    }

    public UserCompany totalLocation(Integer totalLocation) {
        this.setTotalLocation(totalLocation);
        return this;
    }

    public void setTotalLocation(Integer totalLocation) {
        this.totalLocation = totalLocation;
    }

    public User getAppUser() {
        return this.appUser;
    }

    public void setAppUser(User user) {
        this.appUser = user;
    }

    public UserCompany appUser(User user) {
        this.setAppUser(user);
        return this;
    }

    public Set<CompanyPosts> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<CompanyPosts> companyPosts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setUserCompany(null));
        }
        if (companyPosts != null) {
            companyPosts.forEach(i -> i.setUserCompany(this));
        }
        this.posts = companyPosts;
    }

    public UserCompany posts(Set<CompanyPosts> companyPosts) {
        this.setPosts(companyPosts);
        return this;
    }

    public UserCompany addPost(CompanyPosts companyPosts) {
        this.posts.add(companyPosts);
        companyPosts.setUserCompany(this);
        return this;
    }

    public UserCompany removePost(CompanyPosts companyPosts) {
        this.posts.remove(companyPosts);
        companyPosts.setUserCompany(null);
        return this;
    }

    public Set<Placement> getJobs() {
        return this.jobs;
    }

    public void setJobs(Set<Placement> placements) {
        if (this.jobs != null) {
            this.jobs.forEach(i -> i.setUserCompany(null));
        }
        if (placements != null) {
            placements.forEach(i -> i.setUserCompany(this));
        }
        this.jobs = placements;
    }

    public UserCompany jobs(Set<Placement> placements) {
        this.setJobs(placements);
        return this;
    }

    public UserCompany addJob(Placement placement) {
        this.jobs.add(placement);
        placement.setUserCompany(this);
        return this;
    }

    public UserCompany removeJob(Placement placement) {
        this.jobs.remove(placement);
        placement.setUserCompany(null);
        return this;
    }

    public Set<Review> getReviews() {
        return this.reviews;
    }

    public void setReviews(Set<Review> reviews) {
        if (this.reviews != null) {
            this.reviews.forEach(i -> i.setUserCompany(null));
        }
        if (reviews != null) {
            reviews.forEach(i -> i.setUserCompany(this));
        }
        this.reviews = reviews;
    }

    public UserCompany reviews(Set<Review> reviews) {
        this.setReviews(reviews);
        return this;
    }

    public UserCompany addReview(Review review) {
        this.reviews.add(review);
        review.setUserCompany(this);
        return this;
    }

    public UserCompany removeReview(Review review) {
        this.reviews.remove(review);
        review.setUserCompany(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserCompany)) {
            return false;
        }
        return id != null && id.equals(((UserCompany) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserCompany{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", profileImageBackground='" + getProfileImageBackground() + "'" +
            ", profileImageBackgroundContentType='" + getProfileImageBackgroundContentType() + "'" +
            ", companySize='" + getCompanySize() + "'" +
            ", industry='" + getIndustry() + "'" +
            ", totalLocation=" + getTotalLocation() +
            "}";
    }
}
