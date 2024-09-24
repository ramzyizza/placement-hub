package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.UserCompany;

/**
 * Spring Data JPA repository for the UserCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserCompanyRepository extends JpaRepository<UserCompany, Long> {}
