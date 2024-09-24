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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.Placement;
import team.bham.repository.PlacementRepository;
import team.bham.service.PlacementService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Placement}.
 */
/**
 * REST controller for managing {@link team.bham.domain.Placement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlacementResource {

    private final Logger log = LoggerFactory.getLogger(PlacementResource.class);

    private static final String ENTITY_NAME = "placement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlacementRepository placementRepository;

    private final PlacementService placementService;

    @Autowired
    public PlacementResource(PlacementRepository placementRepository, PlacementService placementService) {
        this.placementRepository = placementRepository;
        this.placementService = placementService;
    }

    /**
     * {@code POST  /placements} : Create a new placement.
     *
     * @param placement the placement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new placement, or with status {@code 400 (Bad Request)} if the placement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/placements")
    public ResponseEntity<Placement> createPlacement(@Valid @RequestBody Placement placement) throws URISyntaxException {
        log.debug("REST request to save Placement : {}", placement);
        if (placement.getId() != null) {
            throw new BadRequestAlertException("A new placement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Placement result = placementRepository.save(placement);
        return ResponseEntity
            .created(new URI("/api/placements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /placements/:id} : Updates an existing placement.
     *
     * @param id the id of the placement to save.
     * @param placement the placement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated placement,
     * or with status {@code 400 (Bad Request)} if the placement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the placement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/placements/{id}")
    public ResponseEntity<Placement> updatePlacement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Placement placement
    ) throws URISyntaxException {
        log.debug("REST request to update Placement : {}, {}", id, placement);
        if (placement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, placement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!placementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Placement result = placementRepository.save(placement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, placement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /placements/:id} : Partial updates given fields of an existing placement, field will ignore if it is null
     *
     * @param id the id of the placement to save.
     * @param placement the placement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated placement,
     * or with status {@code 400 (Bad Request)} if the placement is not valid,
     * or with status {@code 404 (Not Found)} if the placement is not found,
     * or with status {@code 500 (Internal Server Error)} if the placement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/placements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Placement> partialUpdatePlacement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Placement placement
    ) throws URISyntaxException {
        log.debug("REST request to partial update Placement partially : {}, {}", id, placement);
        if (placement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, placement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!placementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Placement> result = placementRepository
            .findById(placement.getId())
            .map(existingPlacement -> {
                if (placement.getRole() != null) {
                    existingPlacement.setRole(placement.getRole());
                }
                if (placement.getLocation() != null) {
                    existingPlacement.setLocation(placement.getLocation());
                }
                if (placement.getSalary() != null) {
                    existingPlacement.setSalary(placement.getSalary());
                }
                if (placement.getDuration() != null) {
                    existingPlacement.setDuration(placement.getDuration());
                }
                if (placement.getIndustry() != null) {
                    existingPlacement.setIndustry(placement.getIndustry());
                }
                if (placement.getAbout() != null) {
                    existingPlacement.setAbout(placement.getAbout());
                }
                if (placement.getLink() != null) {
                    existingPlacement.setAbout(placement.getLink());
                }
                if (placement.getJobDescription() != null) {
                    existingPlacement.setJobDescription(placement.getJobDescription());
                }
                if (placement.getMinimumQualification() != null) {
                    existingPlacement.setMinimumQualification(placement.getMinimumQualification());
                }
                if (placement.getApplicationDeadline() != null) {
                    existingPlacement.setApplicationDeadline(placement.getApplicationDeadline());
                }

                return existingPlacement;
            })
            .map(placementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, placement.getId().toString())
        );
    }

    /**
     * {@code GET  /placements} : get all the placements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of placements in body.
     */
    @GetMapping("/placements")
    public List<Placement> getAllPlacements() {
        log.debug("REST request to get all Placements");
        return placementRepository.findAll();
    }

    /**
     * {@code GET  /placements/:id} : get the "id" placement.
     *
     * @param id the id of the placement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the placement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/placements/{id}")
    public ResponseEntity<Placement> getPlacement(@PathVariable Long id) {
        log.debug("REST request to get Placement : {}", id);
        Optional<Placement> placement = placementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(placement);
    }

    /**
     * {@code DELETE  /placements/:id} : delete the "id" placement.
     *
     * @param id the id of the placement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/placements/{id}")
    public ResponseEntity<Void> deletePlacement(@PathVariable Long id) {
        log.debug("REST request to delete Placement : {}", id);
        placementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * Search for placements by role or company name.
     *
     * @param searchTerm the search term.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matching placements in the body.
     */
    @GetMapping("/placements/search")
    public ResponseEntity<List<Placement>> searchPlacements(@RequestParam String searchTerm) {
        log.debug("REST request to search Placements by searchTerm : {}", searchTerm);
        List<Placement> result = placementService.searchByRoleOrCompanyName(searchTerm);
        return ResponseEntity.ok().body(result);
    }
}
