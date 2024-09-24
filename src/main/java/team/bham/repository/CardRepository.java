package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.Card;

/**
 * Spring Data JPA repository for the Card entity.
 */
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByIdAndAppUserLogin(Long id, String login);

    List<Card> findAllByAppUserLogin(String login);

    List<Card> findByAppUser_Login(String login);

    @Query("select card from Card card where card.appUser.login = ?#{principal.username}")
    List<Card> findByAppUserIsCurrentUser();

    @Query("SELECT c.applicationStatus, COUNT(c) FROM Card c WHERE c.appUser.id = :userId GROUP BY c.applicationStatus")
    List<Object[]> countStatusByUserId(@Param("userId") Long userId);

    @Query("SELECT c.applicationStatus, COUNT(c) FROM Card c WHERE c.appUser.login = :login GROUP BY c.applicationStatus")
    List<Object[]> countStatusByUserLogin(@Param("login") String login);

    @Query("SELECT c.applicationStatus, COUNT(c) FROM Card c GROUP BY c.applicationStatus")
    public List<Object[]> countStatusByUserLogin();
}
