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
 * A Article.
 */
@Entity
@Table(name = "article")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "article_name", nullable = false)
    private String articleName;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private ContentType contentType;

    @Column(name = "source_link")
    private String sourceLink;

    @Lob
    @Column(name = "thumbnail", nullable = false)
    private byte[] thumbnail;

    @NotNull
    @Column(name = "thumbnail_content_type", nullable = false)
    private String thumbnailContentType;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @OneToMany(mappedBy = "article")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser", "article", "video" }, allowSetters = true)
    private Set<Favourite> favourites = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Article id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArticleName() {
        return this.articleName;
    }

    public Article articleName(String articleName) {
        this.setArticleName(articleName);
        return this;
    }

    public void setArticleName(String articleName) {
        this.articleName = articleName;
    }

    public ContentType getContentType() {
        return this.contentType;
    }

    public Article contentType(ContentType contentType) {
        this.setContentType(contentType);
        return this;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public String getSourceLink() {
        return this.sourceLink;
    }

    public Article sourceLink(String sourceLink) {
        this.setSourceLink(sourceLink);
        return this;
    }

    public void setSourceLink(String sourceLink) {
        this.sourceLink = sourceLink;
    }

    public byte[] getThumbnail() {
        return this.thumbnail;
    }

    public Article thumbnail(byte[] thumbnail) {
        this.setThumbnail(thumbnail);
        return this;
    }

    public void setThumbnail(byte[] thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getThumbnailContentType() {
        return this.thumbnailContentType;
    }

    public Article thumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
        return this;
    }

    public void setThumbnailContentType(String thumbnailContentType) {
        this.thumbnailContentType = thumbnailContentType;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Article createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Set<Favourite> getFavourites() {
        return this.favourites;
    }

    public void setFavourites(Set<Favourite> favourites) {
        if (this.favourites != null) {
            this.favourites.forEach(i -> i.setArticle(null));
        }
        if (favourites != null) {
            favourites.forEach(i -> i.setArticle(this));
        }
        this.favourites = favourites;
    }

    public Article favourites(Set<Favourite> favourites) {
        this.setFavourites(favourites);
        return this;
    }

    public Article addFavourites(Favourite favourite) {
        this.favourites.add(favourite);
        favourite.setArticle(this);
        return this;
    }

    public Article removeFavourites(Favourite favourite) {
        this.favourites.remove(favourite);
        favourite.setArticle(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Article)) {
            return false;
        }
        return id != null && id.equals(((Article) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Article{" +
            "id=" + getId() +
            ", articleName='" + getArticleName() + "'" +
            ", contentType='" + getContentType() + "'" +
            ", sourceLink='" + getSourceLink() + "'" +
            ", thumbnail='" + getThumbnail() + "'" +
            ", thumbnailContentType='" + getThumbnailContentType() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            "}";
    }
}
