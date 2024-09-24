package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Favourite;

/**
 * Spring Data JPA repository for the Favourite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    @Query("select favourite from Favourite favourite where favourite.appUser.login = ?#{principal.username}")
    List<Favourite> findByAppUserIsCurrentUser();
}
