package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.CompanyPosts;

/**
 * Spring Data JPA repository for the CompanyPosts entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyPostsRepository extends JpaRepository<CompanyPosts, Long> {}
