package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.CompanyPosts;
import team.bham.repository.CompanyPostsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.CompanyPosts}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CompanyPostsResource {

    private final Logger log = LoggerFactory.getLogger(CompanyPostsResource.class);

    private static final String ENTITY_NAME = "companyPosts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompanyPostsRepository companyPostsRepository;

    public CompanyPostsResource(CompanyPostsRepository companyPostsRepository) {
        this.companyPostsRepository = companyPostsRepository;
    }

    /**
     * {@code POST  /company-posts} : Create a new companyPosts.
     *
     * @param companyPosts the companyPosts to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new companyPosts, or with status {@code 400 (Bad Request)} if the companyPosts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/company-posts")
    public ResponseEntity<CompanyPosts> createCompanyPosts(@Valid @RequestBody CompanyPosts companyPosts) throws URISyntaxException {
        log.debug("REST request to save CompanyPosts : {}", companyPosts);
        if (companyPosts.getId() != null) {
            throw new BadRequestAlertException("A new companyPosts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyPosts result = companyPostsRepository.save(companyPosts);
        return ResponseEntity
            .created(new URI("/api/company-posts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /company-posts/:id} : Updates an existing companyPosts.
     *
     * @param id the id of the companyPosts to save.
     * @param companyPosts the companyPosts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyPosts,
     * or with status {@code 400 (Bad Request)} if the companyPosts is not valid,
     * or with status {@code 500 (Internal Server Error)} if the companyPosts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/company-posts/{id}")
    public ResponseEntity<CompanyPosts> updateCompanyPosts(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CompanyPosts companyPosts
    ) throws URISyntaxException {
        log.debug("REST request to update CompanyPosts : {}, {}", id, companyPosts);
        if (companyPosts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyPosts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyPostsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CompanyPosts result = companyPostsRepository.save(companyPosts);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, companyPosts.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /company-posts/:id} : Partial updates given fields of an existing companyPosts, field will ignore if it is null
     *
     * @param id the id of the companyPosts to save.
     * @param companyPosts the companyPosts to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated companyPosts,
     * or with status {@code 400 (Bad Request)} if the companyPosts is not valid,
     * or with status {@code 404 (Not Found)} if the companyPosts is not found,
     * or with status {@code 500 (Internal Server Error)} if the companyPosts couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/company-posts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CompanyPosts> partialUpdateCompanyPosts(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CompanyPosts companyPosts
    ) throws URISyntaxException {
        log.debug("REST request to partial update CompanyPosts partially : {}, {}", id, companyPosts);
        if (companyPosts.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, companyPosts.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!companyPostsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CompanyPosts> result = companyPostsRepository
            .findById(companyPosts.getId())
            .map(existingCompanyPosts -> {
                if (companyPosts.getPostContent() != null) {
                    existingCompanyPosts.setPostContent(companyPosts.getPostContent());
                }
                if (companyPosts.getPostImage() != null) {
                    existingCompanyPosts.setPostImage(companyPosts.getPostImage());
                }
                if (companyPosts.getPostImageContentType() != null) {
                    existingCompanyPosts.setPostImageContentType(companyPosts.getPostImageContentType());
                }
                if (companyPosts.getCreatedAt() != null) {
                    existingCompanyPosts.setCreatedAt(companyPosts.getCreatedAt());
                }

                return existingCompanyPosts;
            })
            .map(companyPostsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, companyPosts.getId().toString())
        );
    }

    /**
     * {@code GET  /company-posts} : get all the companyPosts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of companyPosts in body.
     */
    @GetMapping("/company-posts")
    public List<CompanyPosts> getAllCompanyPosts() {
        log.debug("REST request to get all CompanyPosts");
        return companyPostsRepository.findAll();
    }

    /**
     * {@code GET  /company-posts/:id} : get the "id" companyPosts.
     *
     * @param id the id of the companyPosts to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the companyPosts, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/company-posts/{id}")
    public ResponseEntity<CompanyPosts> getCompanyPosts(@PathVariable Long id) {
        log.debug("REST request to get CompanyPosts : {}", id);
        Optional<CompanyPosts> companyPosts = companyPostsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(companyPosts);
    }

    /**
     * {@code DELETE  /company-posts/:id} : delete the "id" companyPosts.
     *
     * @param id the id of the companyPosts to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/company-posts/{id}")
    public ResponseEntity<Void> deleteCompanyPosts(@PathVariable Long id) {
        log.debug("REST request to delete CompanyPosts : {}", id);
        companyPostsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
