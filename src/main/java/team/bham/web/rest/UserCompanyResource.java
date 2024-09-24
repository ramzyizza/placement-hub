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
import team.bham.domain.UserCompany;
import team.bham.repository.UserCompanyRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.UserCompany}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserCompanyResource {

    private final Logger log = LoggerFactory.getLogger(UserCompanyResource.class);

    private static final String ENTITY_NAME = "userCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserCompanyRepository userCompanyRepository;

    public UserCompanyResource(UserCompanyRepository userCompanyRepository) {
        this.userCompanyRepository = userCompanyRepository;
    }

    /**
     * {@code POST  /user-companies} : Create a new userCompany.
     *
     * @param userCompany the userCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userCompany, or with status {@code 400 (Bad Request)} if the userCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-companies")
    public ResponseEntity<UserCompany> createUserCompany(@Valid @RequestBody UserCompany userCompany) throws URISyntaxException {
        log.debug("REST request to save UserCompany : {}", userCompany);
        if (userCompany.getId() != null) {
            throw new BadRequestAlertException("A new userCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserCompany result = userCompanyRepository.save(userCompany);
        return ResponseEntity
            .created(new URI("/api/user-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-companies/:id} : Updates an existing userCompany.
     *
     * @param id the id of the userCompany to save.
     * @param userCompany the userCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userCompany,
     * or with status {@code 400 (Bad Request)} if the userCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-companies/{id}")
    public ResponseEntity<UserCompany> updateUserCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UserCompany userCompany
    ) throws URISyntaxException {
        log.debug("REST request to update UserCompany : {}, {}", id, userCompany);
        if (userCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserCompany result = userCompanyRepository.save(userCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-companies/:id} : Partial updates given fields of an existing userCompany, field will ignore if it is null
     *
     * @param id the id of the userCompany to save.
     * @param userCompany the userCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userCompany,
     * or with status {@code 400 (Bad Request)} if the userCompany is not valid,
     * or with status {@code 404 (Not Found)} if the userCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the userCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserCompany> partialUpdateUserCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UserCompany userCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserCompany partially : {}, {}", id, userCompany);
        if (userCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserCompany> result = userCompanyRepository
            .findById(userCompany.getId())
            .map(existingUserCompany -> {
                if (userCompany.getName() != null) {
                    existingUserCompany.setName(userCompany.getName());
                }
                if (userCompany.getLogo() != null) {
                    existingUserCompany.setLogo(userCompany.getLogo());
                }
                if (userCompany.getLogoContentType() != null) {
                    existingUserCompany.setLogoContentType(userCompany.getLogoContentType());
                }
                if (userCompany.getProfileImageBackground() != null) {
                    existingUserCompany.setProfileImageBackground(userCompany.getProfileImageBackground());
                }
                if (userCompany.getProfileImageBackgroundContentType() != null) {
                    existingUserCompany.setProfileImageBackgroundContentType(userCompany.getProfileImageBackgroundContentType());
                }
                if (userCompany.getCompanySize() != null) {
                    existingUserCompany.setCompanySize(userCompany.getCompanySize());
                }
                if (userCompany.getIndustry() != null) {
                    existingUserCompany.setIndustry(userCompany.getIndustry());
                }
                if (userCompany.getTotalLocation() != null) {
                    existingUserCompany.setTotalLocation(userCompany.getTotalLocation());
                }

                return existingUserCompany;
            })
            .map(userCompanyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /user-companies} : get all the userCompanies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userCompanies in body.
     */
    @GetMapping("/user-companies")
    public List<UserCompany> getAllUserCompanies() {
        log.debug("REST request to get all UserCompanies");
        return userCompanyRepository.findAll();
    }

    /**
     * {@code GET  /user-companies/:id} : get the "id" userCompany.
     *
     * @param id the id of the userCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-companies/{id}")
    public ResponseEntity<UserCompany> getUserCompany(@PathVariable Long id) {
        log.debug("REST request to get UserCompany : {}", id);
        Optional<UserCompany> userCompany = userCompanyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userCompany);
    }

    /**
     * {@code DELETE  /user-companies/:id} : delete the "id" userCompany.
     *
     * @param id the id of the userCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-companies/{id}")
    public ResponseEntity<Void> deleteUserCompany(@PathVariable Long id) {
        log.debug("REST request to delete UserCompany : {}", id);
        userCompanyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
