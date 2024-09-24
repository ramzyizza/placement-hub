package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Placement;

/**
 * Spring Data JPA repository for the Placement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    @Query(
        "SELECT p FROM Placement p WHERE lower(p.role) like lower(concat('%', :searchTerm, '%')) OR lower(p.userCompany.name) like lower(concat('%', :searchTerm, '%'))"
    )
    List<Placement> findByRoleOrCompanyName(@Param("searchTerm") String searchTerm);
}
