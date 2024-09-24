package team.bham.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Calendar;

/**
 * Spring Data JPA repository for the Calendar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    @Query("select calendar from Calendar calendar where calendar.appUser.login = ?#{principal.username}")
    List<Calendar> findByAppUserIsCurrentUser();
}
