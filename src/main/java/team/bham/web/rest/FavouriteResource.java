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
import team.bham.domain.Favourite;
import team.bham.repository.FavouriteRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Favourite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FavouriteResource {

    private final Logger log = LoggerFactory.getLogger(FavouriteResource.class);

    private static final String ENTITY_NAME = "favourite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FavouriteRepository favouriteRepository;

    public FavouriteResource(FavouriteRepository favouriteRepository) {
        this.favouriteRepository = favouriteRepository;
    }

    /**
     * {@code POST  /favourites} : Create a new favourite.
     *
     * @param favourite the favourite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new favourite, or with status {@code 400 (Bad Request)} if the favourite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/favourites")
    public ResponseEntity<Favourite> createFavourite(@Valid @RequestBody Favourite favourite) throws URISyntaxException {
        log.debug("REST request to save Favourite : {}", favourite);
        if (favourite.getId() != null) {
            throw new BadRequestAlertException("A new favourite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Favourite result = favouriteRepository.save(favourite);
        return ResponseEntity
            .created(new URI("/api/favourites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /favourites/:id} : Updates an existing favourite.
     *
     * @param id the id of the favourite to save.
     * @param favourite the favourite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favourite,
     * or with status {@code 400 (Bad Request)} if the favourite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the favourite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/favourites/{id}")
    public ResponseEntity<Favourite> updateFavourite(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Favourite favourite
    ) throws URISyntaxException {
        log.debug("REST request to update Favourite : {}, {}", id, favourite);
        if (favourite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favourite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouriteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Favourite result = favouriteRepository.save(favourite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favourite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /favourites/:id} : Partial updates given fields of an existing favourite, field will ignore if it is null
     *
     * @param id the id of the favourite to save.
     * @param favourite the favourite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favourite,
     * or with status {@code 400 (Bad Request)} if the favourite is not valid,
     * or with status {@code 404 (Not Found)} if the favourite is not found,
     * or with status {@code 500 (Internal Server Error)} if the favourite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/favourites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Favourite> partialUpdateFavourite(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Favourite favourite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Favourite partially : {}, {}", id, favourite);
        if (favourite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favourite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouriteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Favourite> result = favouriteRepository
            .findById(favourite.getId())
            .map(existingFavourite -> {
                if (favourite.getCreatedAt() != null) {
                    existingFavourite.setCreatedAt(favourite.getCreatedAt());
                }

                return existingFavourite;
            })
            .map(favouriteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favourite.getId().toString())
        );
    }

    /**
     * {@code GET  /favourites} : get all the favourites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of favourites in body.
     */
    @GetMapping("/favourites")
    public List<Favourite> getAllFavourites() {
        log.debug("REST request to get all Favourites");
        return favouriteRepository.findAll();
    }

    /**
     * {@code GET  /favourites/:id} : get the "id" favourite.
     *
     * @param id the id of the favourite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the favourite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/favourites/{id}")
    public ResponseEntity<Favourite> getFavourite(@PathVariable Long id) {
        log.debug("REST request to get Favourite : {}", id);
        Optional<Favourite> favourite = favouriteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(favourite);
    }

    /**
     * {@code DELETE  /favourites/:id} : delete the "id" favourite.
     *
     * @param id the id of the favourite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/favourites/{id}")
    public ResponseEntity<Void> deleteFavourite(@PathVariable Long id) {
        log.debug("REST request to delete Favourite : {}", id);
        favouriteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
