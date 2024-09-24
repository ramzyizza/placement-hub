package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CompanyPostsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CompanyPosts.class);
        CompanyPosts companyPosts1 = new CompanyPosts();
        companyPosts1.setId(1L);
        CompanyPosts companyPosts2 = new CompanyPosts();
        companyPosts2.setId(companyPosts1.getId());
        assertThat(companyPosts1).isEqualTo(companyPosts2);
        companyPosts2.setId(2L);
        assertThat(companyPosts1).isNotEqualTo(companyPosts2);
        companyPosts1.setId(null);
        assertThat(companyPosts1).isNotEqualTo(companyPosts2);
    }
}
