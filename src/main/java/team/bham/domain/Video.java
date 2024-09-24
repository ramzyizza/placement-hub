package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.ContentType;

/**
 * A Video.
 */
@Entity
@Table(name = "video")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Video implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "video_title", nullable = false)
    private String videoTitle;

    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    @Lob
    @Column(name = "thumbnail", nullable = false)
    private byte[] thumbnail;

    @NotNull
    @Column(name = "thumbnail_content_type", nullable = false)
    private String thumbnailContentType;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @NotNull
    @Column(name = "source_url", nullable = false)
    private String sourceURL;

    @OneToMany(mappedBy = "video")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "article", "video" }, allowSetters = true)
    private Set<Favourite> favourites = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Video id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVideoTitle() {
        return this.videoTitle;
    }

    public Video videoTitle(String videoTitle) {
        this.setVideoTitle(videoTitle);
        return this;
    }

    public void setVideoTitle(String videoTitle) {
        this.videoTitle = videoTitle;
    }

    public String getDescription() {
        return this.description;
    }

    public Video description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContentType getContentType() {
        return this.contentType;
    }

    public Video contentType(ContentType contentType) {
        this.setContentType(contentType);
        return this;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public byte[] getThumbnail() {
        return this.thumbnail;
    }

    public Video thumbnail(byte[] thumbnail) {
        this.setThumbnail(thumbnail);
        return this;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getThumbnailContentType() {
        return this.thumbnailContentType;
    }

    public Video thumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
        return this;
    }

    public void setThumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Video createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getSourceURL() {
        return this.sourceURL;
    }

    public Video sourceURL(String sourceURL) {
        this.setSourceURL(sourceURL);
        return this;
    }

    public void setSourceURL(String sourceURL) {
        this.sourceURL = sourceURL;
    }

    public Set<Favourite> getFavourites() {
        return this.favourites;
    }

    public void setFavourites(Set<Favourite> favourites) {
        if (this.favourites != null) {
            this.favourites.forEach(i -> i.setVideo(null));
        }
        if (favourites != null) {
            favourites.forEach(i -> i.setVideo(this));
        }
        this.favourites = favourites;
    }

    public Video favourites(Set<Favourite> favourites) {
        this.setFavourites(favourites);
        return this;
    }

    public Video addFavourites(Favourite favourite) {
        this.favourites.add(favourite);
        favourite.setVideo(this);
        return this;
    }

    public Video removeFavourites(Favourite favourite) {
        this.favourites.remove(favourite);
        favourite.setVideo(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Video)) {
            return false;
        }
        return id != null && id.equals(((Video) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Video{" +
            "id=" + getId() +
            ", videoTitle='" + getVideoTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", contentType='" + getContentType() + "'" +
            ", thumbnail='" + getThumbnail() + "'" +
            ", thumbnailContentType='" + getThumbnailContentType() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", sourceURL='" + getSourceURL() + "'" +
            "}";
    }
}
