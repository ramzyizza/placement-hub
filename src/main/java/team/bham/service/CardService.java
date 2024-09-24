package team.bham.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Card;
import team.bham.domain.enumeration.CardStatus;
import team.bham.repository.CardRepository;
import team.bham.security.SecurityUtils;

/**
 * Service class for managing cards.
 */
@Service
@Transactional
public class CardService {

    private final Logger log = LoggerFactory.getLogger(CardService.class);
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * Save a card.
     *
     * @param card the entity to save.
     * @return the persisted entity.
     */
    public Card save(Card card) {
        log.debug("Request to save Card : {}", card);
        return cardRepository.save(card);
    }

    /**
     * Get all the cards.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Card> findAll() {
        log.debug("Request to get all Cards");
        return cardRepository.findAll();
    }

    /**
     * Get all the cards for the current user.
     *
     *
     * @return the list of entities for the current user.
     */
    @Transactional(readOnly = true)
    public List<Card> findAllForCurrentUser() {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalStateException("Current user login not found"));
        log.debug("Request to get all Cards for user {}", userLogin);
        return cardRepository.findAllByAppUserLogin(userLogin);
    }

    /**
     * Get one card by id, ensuring it belongs to the current user.
     *
     * @param id the id of the entity.
     * @return the entity if it belongs to the current user.
     */
    @Transactional(readOnly = true)
    public Optional<Card> findOneForCurrentUser(Long id) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new IllegalStateException("Current user login not found"));
        log.debug("Request to get Card : {} for user {}", id, userLogin);
        return cardRepository.findByIdAndAppUserLogin(id, userLogin);
    }

    /**
     * Get one card by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Card> findOne(Long id) {
        log.debug("Request to get Card : {}", id);
        return cardRepository.findById(id);
    }

    /**
     * Delete the card by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Card : {}", id);
        cardRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> countCardStatusesForCurrentUser() {
        String currentUserLogin = SecurityUtils
            .getCurrentUserLogin()
            .orElseThrow(() -> new IllegalStateException("Current user login not found"));
        List<Object[]> counts = cardRepository.countStatusByUserLogin(currentUserLogin);
        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] count : counts) {
            String status = ((Enum<?>) count[0]).name();
            Long countValue = (Long) count[1];
            statusCounts.put(status, countValue);
        }
        return statusCounts;
    }
}
