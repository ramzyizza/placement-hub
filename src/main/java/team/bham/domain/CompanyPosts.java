package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CompanyPosts.
 */
@Entity
@Table(name = "company_posts")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CompanyPosts implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "post_content", nullable = false)
    private String postContent;

    @Lob
    @Column(name = "post_image")
    private byte[] postImage;

    @Column(name = "post_image_content_type")
    private String postImageContentType;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties(value = { "appUser", "posts", "jobs", "reviews" }, allowSetters = true)
    private UserCompany userCompany;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CompanyPosts id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPostContent() {
        return this.postContent;
    }

    public CompanyPosts postContent(String postContent) {
        this.setPostContent(postContent);
        return this;
    }

    public void setPostContent(String postContent) {
        this.postContent = postContent;
    }

    public byte[] getPostImage() {
        return this.postImage;
    }

    public CompanyPosts postImage(byte[] postImage) {
        this.setPostImage(postImage);
        return this;
    }

    public void setPostImage(byte[] postImage) {
        this.postImage = postImage;
    }

    public String getPostImageContentType() {
        return this.postImageContentType;
    }

    public CompanyPosts postImageContentType(String postImageContentType) {
        this.postImageContentType = postImageContentType;
        return this;
    }

    public void setPostImageContentType(String postImageContentType) {
        this.postImageContentType = postImageContentType;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public CompanyPosts createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserCompany getUserCompany() {
        return this.userCompany;
    }

    public void setUserCompany(UserCompany userCompany) {
        this.userCompany = userCompany;
    }

    public CompanyPosts userCompany(UserCompany userCompany) {
        this.setUserCompany(userCompany);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CompanyPosts)) {
            return false;
        }
        return id != null && id.equals(((CompanyPosts) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CompanyPosts{" +
            "id=" + getId() +
            ", postContent='" + getPostContent() + "'" +
            ", postImage='" + getPostImage() + "'" +
            ", postImageContentType='" + getPostImageContentType() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
