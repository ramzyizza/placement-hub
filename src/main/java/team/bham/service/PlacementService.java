package team.bham.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Placement;
import team.bham.repository.PlacementRepository;

/**
 * Service Implementation for managing {@link Placement}.
 */
@Service
@Transactional
public class PlacementService {

    private final PlacementRepository placementRepository;

    @Autowired
    public PlacementService(PlacementRepository placementRepository) {
        this.placementRepository = placementRepository;
    }

    /**
     * Save a placement.
     *
     * @param placement the entity to save.
     * @return the persisted entity.
     */
    public Placement save(Placement placement) {
        return placementRepository.save(placement);
    }

    /**
     * Get all the placements.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Placement> findAll() {
        return placementRepository.findAll();
    }

    /**
     * Get one placement by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Placement findOne(Long id) {
        return placementRepository.findById(id).orElse(null);
    }

    /**
     * Delete the placement by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        placementRepository.deleteById(id);
    }

    /**
     * Search for placements by role or company name.
     *
     * @param searchTerm the search term.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Placement> searchByRoleOrCompanyName(String searchTerm) {
        return placementRepository.findByRoleOrCompanyName(searchTerm);
    }
}
