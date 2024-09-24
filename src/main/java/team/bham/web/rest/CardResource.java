package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
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
import team.bham.domain.Card;
import team.bham.repository.CardRepository;
import team.bham.service.CardService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Card}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CardResource {

    private final Logger log = LoggerFactory.getLogger(CardResource.class);

    private static final String ENTITY_NAME = "card";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CardRepository cardRepository;

    private final CardService cardService;

    public CardResource(CardRepository cardRepository, CardService cardService) {
        this.cardRepository = cardRepository;
        this.cardService = cardService;
    }

    /**
     * {@code POST  /cards} : Create a new card.
     *
     * @param card the card to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new card, or with status {@code 400 (Bad Request)} if the card has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cards")
    public ResponseEntity<Card> createCard(@Valid @RequestBody Card card) throws URISyntaxException {
        log.debug("REST request to save Card : {}", card);
        if (card.getId() != null) {
            throw new BadRequestAlertException("A new card cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Card result = cardRepository.save(card);
        return ResponseEntity
            .created(new URI("/api/cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cards/:id} : Updates an existing card.
     *
     * @param id the id of the card to save.
     * @param card the card to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated card,
     * or with status {@code 400 (Bad Request)} if the card is not valid,
     * or with status {@code 500 (Internal Server Error)} if the card couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cards/{id}")
    public ResponseEntity<Card> updateCard(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Card card)
        throws URISyntaxException {
        log.debug("REST request to update Card : {}, {}", id, card);
        if (card.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, card.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Card result = cardRepository.save(card);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, card.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cards/:id} : Partial updates given fields of an existing card, field will ignore if it is null
     *
     * @param id the id of the card to save.
     * @param card the card to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated card,
     * or with status {@code 400 (Bad Request)} if the card is not valid,
     * or with status {@code 404 (Not Found)} if the card is not found,
     * or with status {@code 500 (Internal Server Error)} if the card couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Card> partialUpdateCard(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Card card
    ) throws URISyntaxException {
        log.debug("REST request to partial update Card partially : {}, {}", id, card);
        if (card.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, card.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Card> result = cardRepository
            .findById(card.getId())
            .map(existingCard -> {
                if (card.getApplicationStatus() != null) {
                    existingCard.setApplicationStatus(card.getApplicationStatus());
                }
                if (card.getCreatedDateTime() != null) {
                    existingCard.setCreatedDateTime(card.getCreatedDateTime());
                }
                if (card.getCompanyName() != null) {
                    existingCard.setCompanyName(card.getCompanyName());
                }
                if (card.getJobTitle() != null) {
                    existingCard.setJobTitle(card.getJobTitle());
                }
                if (card.getJobLocation() != null) {
                    existingCard.setJobLocation(card.getJobLocation());
                }
                if (card.getJobDuration() != null) {
                    existingCard.setJobDuration(card.getJobDuration());
                }

                return existingCard;
            })
            .map(cardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, card.getId().toString())
        );
    }

    /**
     * {@code GET  /cards} : get all the cards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cards in body.
     */
    @GetMapping("/cards")
    public List<Card> getAllCards() {
        log.debug("REST request to get all Cards");
        return cardRepository.findAll();
    }

    /**
     * {@code GET  /cards/:id} : get the "id" card.
     *
     * @param id the id of the card to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the card, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cards/{id}")
    public ResponseEntity<Card> getCard(@PathVariable Long id) {
        log.debug("REST request to get Card : {}", id);
        Optional<Card> card = cardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(card);
    }

    /**
     * {@code DELETE  /cards/:id} : delete the "id" card.
     *
     * @param id the id of the card to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        log.debug("REST request to delete Card : {}", id);
        cardRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /cards} : get all the cards for the current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cards in body for the current user.
     */
    @GetMapping("/cards/user")
    public List<Card> getAllCardsForCurrentUser() {
        log.debug("REST request to get all Cards for the current user");
        return cardService.findAllForCurrentUser();
    }

    /**
     * {@code GET  /cards/:id} : get the "id" card if it belongs to the current user.
     *
     * @param id the id of the card to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the card, or with status {@code 404 (Not Found)} if the card does not belong to the current user or is not found.
     */
    @GetMapping("/cards/user/{id}")
    public ResponseEntity<Card> getCardForCurrentUser(@PathVariable Long id) {
        log.debug("REST request to get Card : {} for the current user", id);
        Optional<Card> card = cardService.findOneForCurrentUser(id);
        return ResponseUtil.wrapOrNotFound(card);
    }

    /**
     * {@code GET  /cards/status-counts} : get the count of each card status for the current user.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the map of status counts in body.
     */
    @GetMapping("/cards/status-counts")
    public ResponseEntity<Map<String, Long>> getCardStatusCountsForCurrentUser() {
        log.debug("REST request to get card status counts for the current user");
        Map<String, Long> statusCounts = cardService.countCardStatusesForCurrentUser();
        return ResponseEntity.ok().body(statusCounts);
    }
}
